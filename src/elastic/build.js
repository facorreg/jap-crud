import { getEnv } from '@utils';

import createIndex from './create-index';
import indexSchema from './schemas/index.schema';

const build = async (client) => {
  try {
    await createIndex(client, getEnv('CORPUS_ES_INDEX', 'tatoeba'), {}, indexSchema);

    return Promise.resolve();
  } catch (err) {
    return Promise.reject(err);
  }
};

export default build;
