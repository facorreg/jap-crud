// eslint-disable-next-line import/no-cycle

import createWord from '@CREATE/word';
import getJword from '@GET/jword';
import getKanjis from '@GET/kanjis';
import Corpus from '@models/corpus.model';
import Sense from '@models/sense.model';
import Word from '@models/word.model';
import { promesify, filterEmpty, getInCollection, deMongoize, tokenize } from '@utils';

const getWord = async (word, esClient) => {
  try {
    const jwords = await getJword(word, word);
    const jwordIds = jwords?.map(({ _id: id }) => id);

    if (!jwordIds?.length) {
      return Promise.resolve(await createWord(word, esClient));
    }

    const rawWords = await getInCollection(Word, jwordIds, 'jwordIds');

    const words = await Promise.all(
      rawWords.map(async ({ jwordIds: jIds, kanjiIds, senseIds }, index) => {
        const japanese = filterEmpty(
          jIds.map((jId) => jwords.find(({ _id: id }) => id.toString() === jId.toString())),
        );

        let kanjis = await getKanjis(null, kanjiIds);

        /* Removes extra Kanjis */
        const allChars = filterEmpty(japanese.map(({ word: jword }) => jword)).join('');
        const newKanjiIds = kanjis
          .filter(({ character }) => allChars.includes(character))
          .map(({ _id: id }) => id);

        if (newKanjiIds.length !== kanjiIds.length) {
          rawWords[index].kanjiIds = newKanjiIds;
          await rawWords[index].save();
          kanjis = kanjis.filter(({ _id: id }) => newKanjiIds.includes(id));
        }

        const rawSenses = deMongoize(await getInCollection(Sense, senseIds));
        const senses = await Promise.all(
          rawSenses.map(async ({ examples, ...rest }) => ({
            ...rest,
            examples: await tokenize(await getInCollection(Corpus, examples)),
          })),
        );

        return {
          japanese,
          kanjis,
          senses,
        };
      }),
    );

    return Promise.resolve(words);
  } catch (err) {
    return promesify(false, 'Failed to get word');
  }
};

export default getWord;
