import cliProgress from 'cli-progress';

import { getEnv, promesify } from '@utils';

const bulk = (client, data, parser) => {
  const loadingBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
  loadingBar.start(data.length, 0);
  // const parserWithLoader = parser(loadingBar);

  return (async () => {
    try {
      const dbulk = data.reduce((acc, d, index) => {
        if (getEnv('ENV') !== 'prod') {
          loadingBar.update(index);
        }
        return parser(acc, d);
      }, []);
      await client.bulk({ body: dbulk });
      // eslint-disable-next-line no-console
      console.log(`Successfully imported ${data.length}`);
      return Promise.resolve();
    } catch (err) {
      return promesify(false, 'Failed bulk operation', err);
    }
  })().finally(() => loadingBar.stop());
};

export default bulk;
