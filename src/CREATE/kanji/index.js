import { uniq, omit, first } from 'lodash';

// eslint-disable-next-line import/no-cycle
import getKanjis from '@GET/kanjis';
import KaExample from '@models/ka-example.model';
import Kanji from '@models/kanji.model';
import { promesify, insertMany, deMongoize, getInCollection } from '@utils';

import getKanjiAlive from './get-kanji-alive-api';
import getKanjiApi from './get-kanji-api';

const getKanjiData = async (character) => {
  try {
    const apiPromises = [getKanjiAlive(character), getKanjiApi(character)];

    const apiData = await Promise.all(apiPromises);

    return Promise.resolve(apiData);
  } catch (error) {
    return Promise.reject(error);
  }
};

const parseKanjiData = ([kanjiAlive, kanjiApi]) => {
  if (!kanjiAlive?.word && !kanjiApi?.word) return null;

  const takeFirstValidValue = (key, obj1 = kanjiAlive, obj2 = kanjiApi) =>
    obj1?.[key] || obj2?.[key];

  const mergeArrays = (key, link, obj1 = kanjiAlive, obj2 = kanjiApi) =>
    uniq([...(obj1?.[key] || []), ...(obj2?.[key] || [])]).join(link);

  const { examples, radical, strokes: kAliveStrokes, video } = kanjiAlive || {};
  const { strokes: kApiStrokes } = kanjiApi || {};

  return {
    character: takeFirstValidValue('word'),
    examples,
    kunyomi: mergeArrays('kunyomi', '、', kanjiAlive, kanjiApi),
    meaning: mergeArrays('meaning', ', '),
    onyomi: mergeArrays('onyomi', '、', kanjiAlive, kanjiApi),
    radical,
    references: {
      ...kanjiAlive?.references,
      ...kanjiApi?.references,
    },
    strokes: {
      ...kAliveStrokes,
      count: takeFirstValidValue('count', kAliveStrokes, kApiStrokes),
    },
    video,
  };
};

const createKanji = async (kanji) => {
  try {
    const localKanji = await getInCollection(Kanji, [kanji], 'character');
    if (localKanji?.length) return first(getKanjis([localKanji]));
    const kanjiData = await getKanjiData(kanji);
    const { examples, ...parsed } = parseKanjiData(kanjiData);
    const { insertedIds } = await insertMany(KaExample, examples || [], ({ furigana, word }) =>
      KaExample.findOne({ furigana, word }),
    );

    const newKanji = new Kanji({ exampleIds: insertedIds, ...parsed });
    await newKanji.save();

    return Promise.resolve(omit({ ...deMongoize(newKanji), examples }, ['exampleIds']));
  } catch (err) {
    console.log(err);
    return promesify(false, 'Failed to create kanji');
  }
};

export default createKanji;
