import { getEnv } from '@utils';

const getexamples = (jpList, enList, { from = 0, size = 5 } = {}) => {
  return {
    body: {
      query: {
        bool: {
          must: [
            {
              query_string: {
                auto_generate_synonyms_phrase_query: true,
                boost: 2,
                default_field: 'en',
                query: enList.join(' OR '),
              },
            },
            {
              query_string: {
                auto_generate_synonyms_phrase_query: true,
                boost: 2,
                default_field: 'jp',
                query: jpList.join(' OR '),
              },
            },
          ],
        },
      },
    },
    from,
    index: getEnv('CORPUS_ES_INDEX', 'tatoeba'),
    size,
  };
};

export default getexamples;
