import axios from 'axios';
import { uniq, flattenDeep } from 'lodash';
import { isKanji } from 'wanakana';

import createKanji from '@CREATE/kanji';
import getJword from '@GET/jword';
import getExamplesQuery from '@es/schemas/get-examples.query';
import Jword from '@models/jword.model';
import Sense from '@models/sense.model';
import Word from '@models/word.model';
import { promesify, getEnv, filterEmpty, insertMany, tokenize } from '@utils';

export const getJishoData = async (word) => {
  try {
    const url = getEnv('JISHO_URL');
    const params = { keyword: word };
    const { data, meta } = await axios.get(url, { params }).then((res) => res?.data || {});

    if (meta?.status !== 200) {
      return promesify(false, 'Failed to fetch JISHO_API');
    }

    return Promise.resolve(data);
  } catch (err) {
    return Promise.reject(err);
  }
};

const getExamples = async (japanese, definitions, esClient) => {
  try {
    const japaneseList = uniq(
      flattenDeep(japanese.map(({ reading, word }) => filterEmpty([word, reading]))),
    );
    const enList = definitions.map((def) => def.replace(/[(,].*$/, ''));

    const searchResults = await esClient.search(getExamplesQuery(japaneseList, enList));

    return Promise.resolve(searchResults?.body?.hits?.hits?.map(({ _source: src }) => src));
  } catch (err) {
    return promesify(false, 'Failed to get examples from ES');
  }
};

const senseParser = async (
  { english_definitions: ed, parts_of_speech: pos, tags = [] },
  japanese,
  esClient,
) => {
  const isWiki = pos.find((t) => t.toLowerCase().includes('wikipedia'));

  if (isWiki) return null;

  return {
    definitions: ed?.join(', '),
    examples: await getExamples(japanese, ed, esClient).catch(() => []),
    partsOfSpeech: pos?.join(', '),
    tags: tags?.join(', '),
  };
};

const saveAndGetIds = async (jwords, rawSenses, kanjis) => {
  const getIds = (arr) => arr.map(({ _id: id }) => id);

  const { insertedIds: jWordIds } = await insertMany(Jword, jwords, ({ reading, word }) =>
    // eslint-disable-next-line no-use-before-define
    Jword.findOne({ reading, word }),
  );

  const senses = rawSenses.map(({ examples, ...rest }) => ({
    ...rest,
    examples: examples?.map(({ mongoId }) => mongoId),
  }));

  const { insertedIds: senseIds } = await insertMany(Sense, senses, ({ definitions }) =>
    Sense.findOne({ definitions }),
  );

  const kanjiIds = getIds(kanjis);

  return [jWordIds, senseIds, kanjiIds];
};

const createWord = async (word, esClient) => {
  const localData = await getJword(word, word);

  if (localData?.length) return promesify(false, `${word} already exists`);
  const data = await getJishoData(word);

  try {
    return await Promise.all(
      data.map(async ({ isCommon, japanese, senses: rawSenses }) => {
        const jwords = filterEmpty(
          await Promise.all(
            japanese.map(async ({ reading, word: jWord }) => {
              return { reading: reading || jWord, word: !reading && jWord ? null : jWord };
            }),
          ),
        );

        const senses = filterEmpty(
          await Promise.all(rawSenses?.map((sense) => senseParser(sense, japanese, esClient))),
        );

        const kanjiWithin = uniq(
          flattenDeep(
            japanese.map(({ word: jword }) =>
              jword ? jword.split('').map((r) => (isKanji(r) ? r : null)) : null,
            ),
          ),
        ).filter((e) => e);

        const kanjis = await Promise.all(kanjiWithin.map(createKanji));

        const [jwordIds, senseIds, kanjiIds] = await saveAndGetIds(jwords, senses, kanjis);

        const newWord = await new Word({ isCommon, jwordIds, kanjiIds, senseIds });
        await newWord.save();

        return {
          japanese: jwords,
          kanjis,
          senses: await Promise.all(
            senses.map(async ({ examples, ...rest }) => ({
              examples: await tokenize(examples),
              ...rest,
            })),
          ),
        };
      }),
    );
  } catch (err) {
    console.log(err);

    return promesify(false, 'Failed to create Word');
  }
};

export default createWord;
