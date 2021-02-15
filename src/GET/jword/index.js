import { toKatakana } from 'wanakana';

import Jword from '@models/jword.model';

const getJword = (reading, word) =>
  Jword.find({
    $or: [
      { reading: { $eq: reading } },
      { reading: { $eq: toKatakana(word) } },
      { word: { $eq: word || reading } },
    ],
  });

export default getJword;
