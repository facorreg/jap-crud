import getKaData from './get-ka-data';
import parseKanjiData from './parse-ka-data';

const getKanjiApi = async (word) => {
  try {
    const response = await getKaData(word);
    const parsedResponse = parseKanjiData(response);
    return Promise.resolve(parsedResponse);
  } catch (err) {
    return Promise.reject(err);
  }
};

export default getKanjiApi;
