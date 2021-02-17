const indexSchema = {
  mappings: {
    properties: {
      en: {
        analyzer: 'english',
        fields: {
          ngram: {
            analyzer: 'ngram_tokenizer_analyzer',
            type: 'text',
          },
        },
        type: 'text',
      },
      jp: {
        analyzer: 'kuromoji',
        fields: {
          baseform: {
            analyzer: 'jp_baseform',
            type: 'text',
          },
        },
        type: 'text',
      },
      mongoId: {
        type: 'text',
      },
    },
  },
  settings: {
    analysis: {
      analyzer: {
        jp_baseform: {
          tokenizer: 'jp_baseform_tokenizer',
          type: 'custom',
        },
        ngram_tokenizer_analyzer: {
          filter: [
            'lowercase',
            'english_stemmer',
            'english_possessive_stemmer',
            'updated_english_stopwords',
          ],
          tokenizer: 'ngram_tokenizer',
          type: 'custom',
        },
        updated_english_analyzer: {
          filter: [
            'lowercase',
            'english_stemmer',
            'english_possessive_stemmer',
            'updated_english_stopwords',
          ],
          tokenizer: 'standard',
        },
      },
      filter: {
        english_possessive_stemmer: {
          language: 'possessive_english',
          type: 'stemmer',
        },
        english_stemmer: {
          language: 'english',
          type: 'stemmer',
        },
        updated_english_stopwords: {
          stopwords: [
            'an',
            'and',
            'are',
            'but',
            'if',
            'is',
            'it',
            'no',
            'not',
            'or',
            'the',
            'their',
            'then',
            'there',
            'these',
            'they',
            'this',
            'to',
            'was',
            'will',
          ],
          type: 'stop',
        },
      },
      tokenizer: {
        jp_baseform_tokenizer: {
          mode: 'search',
          type: 'kuromoji_tokenizer',
        },
        ngram_tokenizer: {
          max_gram: 8,
          min_gram: 3,
          type: 'ngram',
        },
      },
    },
    index: {
      max_ngram_diff: 20,
    },
    number_of_shards: 2,
  },
};

export default indexSchema;
