import kuromoji from 'kuromoji';

import { partOfSpeech, conjugatedTypes, conjugatedForms } from './tokens';

const tokenizerPromise = new Promise((resolve, reject) => {
  kuromoji
    .builder({ dicPath: 'node_modules/kuromoji/dict' })
    .build((err, tokenizer) => (err ? reject : resolve)(err || tokenizer));
}).then((tokenizer) => tokenizer);

const tokenize = async (corpus) => {
  const tokenizer = await tokenizerPromise;

  return corpus.map(({ en, jp }) => ({
    en,
    tokens: tokenizer
      .tokenize(jp)
      .map(
        ({
          basic_form: bf,
          conjugated_form: cf,
          conjugated_type: ct,
          pos,
          pos_detail_1: posDetail1,
          pos_detail_2: posDetail2,
          pos_detail_3: posDetail3,
          surface_form: sf,
          word_id: wId,
          word_position: wp,
          word_type: wt,
          ...tokens
        }) => ({
          basicForm: bf,
          conjugatedForm: conjugatedForms[cf] || cf,
          conjugatedType: conjugatedTypes[ct] || ct,
          pos: partOfSpeech[pos] || pos,
          posDetail1: partOfSpeech[posDetail1] || posDetail1,
          posDetail2: partOfSpeech[posDetail2] || posDetail2,
          posDetail3: partOfSpeech[posDetail3] || posDetail3,
          surfaceForm: sf,
          wordId: wId,
          wordPosition: wp,
          wordType: wt,
          ...tokens,
        }),
      ),
  }));
};

export default tokenize;
