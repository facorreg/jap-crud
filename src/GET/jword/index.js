import { toKatakana } from 'wanakana';

import Jword from '@models/jword.model';

const getJword = (reading, word) => {
  return Jword.find({
    $or: [{ word: word || reading }, { reading }, { reading: toKatakana(word) }],
  });
};
export default getJword;
