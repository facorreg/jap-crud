import { promesify } from '@utils';

const createIndex = async (esClient, index, options = {}, body) => {
  try {
    await esClient.indices.create({ index, ...options, body });
    return Promise.resolve();
  } catch (err) {
    return promesify(false, 'Failed to create index');
  }
};

export default createIndex;
