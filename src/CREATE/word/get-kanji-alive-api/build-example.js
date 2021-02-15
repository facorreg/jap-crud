import { last } from 'lodash';

import { promesify } from '@utils';

const exampleParser = ({ audio: rawAudio, furigana = '', meaning: exMeaning, word }) => {
  /* utiliser la fonction avec laquelle on créera des mots */
  const audio = rawAudio?.mp3 || '';

  return {
    audio: {
      audio,
      format: last(audio.split('.')),
    },
    furigana: furigana.slice(0, -1),
    meaning: exMeaning?.english,
    word,
  };
};

const buildExample = async ({ japanese, ...rest }) => {
  let errorMsg;
  try {
    const [word, furigana = ''] = japanese.split('（');

    const newEx = await exampleParser({ furigana, word, ...rest });

    return Promise.resolve(newEx);
  } catch (err) {
    return promesify(errorMsg || 'Failed to get Examples from local db');
  }
};

export default buildExample;
