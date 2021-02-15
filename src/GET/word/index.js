// eslint-disable-next-line import/no-cycle
import createWord from '@CREATE/word';
import getJword from '@GET/jword';
import Kanji from '@models/kanji.model';
import Sense from '@models/sense.model';
import Word from '@models/word.model';
import { promesify, filterEmpty } from '@utils';
/*
  @todo: Currently we get words stricly equal to "word",
    later we ought to try to add an option to look for more words
    that wont match perfectly
*/

const getInCollection = (Collection, inArr, field = '_id') =>
  Collection.find({ [field]: { $in: inArr } });

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
        return {
          japanese: filterEmpty(
            jIds.map((jId) => jwords.find(({ _id: id }) => id.toString() === jId.toString())),
          ),
          kanjis: await getInCollection(Kanji, kanjiIds),
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
