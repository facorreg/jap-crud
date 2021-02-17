import { Client } from '@elastic/elasticsearch';

import { getEnv } from '@utils';

const createESClient = () => {
  const client = new Client({
    node: `http://localhost:${getEnv('ELASTIC_PORT', 9200)}`,
  });

  // eslint-disable-next-line no-console
  console.log('Successfull connection to ES');
  return client;
};

export default createESClient;
