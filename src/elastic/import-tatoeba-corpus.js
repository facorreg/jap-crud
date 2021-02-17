import Corpus from '@models/corpus.model';
import { getEnv, deMongoize } from '@utils';

import bulk from './bulk';

const bulkParser = (dbulk, { _id: id, en, jp }) => [
  ...dbulk,
  {
    index: {
      _index: getEnv('CORPUS_ES_INDEX', 'tatoeba'),
      _type: '_doc',
    },
  },
  { en, jp, mongoId: id },
];

const importTatoebaCorpus = async (client) => {
  const data = deMongoize(await Corpus.find({}));
  return bulk(client, data, bulkParser);
};

export default importTatoebaCorpus;
