import axios from 'axios';

import { promesify, getEnv } from '@utils';

const getKaData = async (word) => {
  try {
    const url = `${getEnv('KANJI_API_URL', '')}${word}`;
    const response = await axios.get(encodeURI(url)).then(({ data }) => data);

    return Promise.resolve(response);
  } catch (err) {
    return promesify('Failed to fetch kanjiApi data');
  }
};

export default getKaData;
