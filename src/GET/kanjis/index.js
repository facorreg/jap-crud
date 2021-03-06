import { omit } from 'lodash';

// eslint-disable-next-line import/no-cycle
import createKanji from '@CREATE/kanji';
import Example from '@models/ka-example.model';
import Kanji from '@models/kanji.model';
import { deMongoize, filterEmpty, getInCollection } from '@utils';

const getKanjis = async (characters, ids) => {
  let kanjis = deMongoize(
    await getInCollection(Kanji, characters || ids, characters ? 'character' : ''),
  );

  if (!kanjis?.length && characters.length) {
    return characters.map(createKanji);
  }

  kanjis = filterEmpty(
    await Promise.all(
      kanjis.map(async ({ exampleIds, ...rest }) => {
        if (!exampleIds) {
          return Promise.resolve(null);
        }
        try {
          const examples = await getInCollection(Example, exampleIds);
          return Promise.resolve(omit({ ...rest, examples }), ['exampleIds']);
        } catch {
          return Promise.resolve(null);
        }
      }),
    ),
  );

  return kanjis;
};

export default getKanjis;
