// eslint-disable-next-line import/no-cycle

import createWord from '@CREATE/word';
import getJword from '@GET/jword';
import getKanjis from '@GET/kanjis';
import Sense from '@models/sense.model';
import Word from '@models/word.model';
import { promesify, filterEmpty, getInCollection } from '@utils';

const getWord = async (word) => {
  try {
    const jwords = await getJword(word, word);
    const jwordIds = jwords?.map(({ _id: id }) => id);

    if (!jwordIds?.length) {
      return Promise.resolve(await createWord(word));
    }

    const rawWords = await getInCollection(Word, jwordIds, 'jwordIds');

    const words = await Promise.all(
      rawWords.map(async ({ jwordIds: jIds, kanjiIds, senseIds }) => {
        const kanjis = await getKanjis(null, kanjiIds);

        return {
          japanese: filterEmpty(
            jIds.map((jId) => jwords.find(({ _id: id }) => id.toString() === jId.toString())),
          ),
          kanjis,
          senses: await getInCollection(Sense, senseIds),
        };
      }),
    );

    return Promise.resolve(words);
  } catch (err) {
    return promesify(false, 'Failed to get word');
  }
};

export default getWord;
