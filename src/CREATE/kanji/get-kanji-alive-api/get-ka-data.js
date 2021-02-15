import axios from 'axios';

import { promesify, getEnv } from '@utils';

const getKaData = async (word) => {
  try {
    const url = `${getEnv('KANJI_ALIVE_URL', '')}${word}`;
    const headers = {
      'x-rapidapi-host': 'kanjialive-api.p.rapidapi.com',
      'x-rapidapi-key': getEnv('KANJI_ALIVE_API_KEY', ''),
    };

    return await axios.get(encodeURI(url), { headers }).then((res) => res?.data);
  } catch {
    return promesify(false, 'Failed to fetch kanji-alive-api');
  }
};

export default getKaData;
