import { promesify } from '@utils';

import buildExample from './build-example';
import getKaData from './get-ka-data';
import kanjiFormater from './kanji-formater';

const getKanjiAliveData = async (word) => {
  try {
    const rawData = await getKaData(word);
    const { error, examples: rawExamples, kanji, radical, references } = rawData || {};

    if (error) return {};

    const examples = await Promise.all(rawExamples?.map((ex) => buildExample(ex)));

    const ret = {
      meaning: kanji?.meaning?.english.split(', '),
      word: kanji?.character,
      ...kanjiFormater({ ...kanji, radical, references }),
      examples,
    };

    return Promise.resolve(ret);
  } catch (err) {
    return promesify('Failed to fetch KanjiAlive data');
  }
};

export default getKanjiAliveData;
