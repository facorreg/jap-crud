import { omit } from 'lodash';

const kanjiFormater = ({ kunyomi, onyomi, radical, references, strokes, video }) => ({
  kunyomi: kunyomi?.hiragana?.split('、') || 'N/A',
  onyomi: onyomi?.katakana?.split('、') || 'N/A',
  radical: (() => ({
    ...omit(radical, ['position']),
    meaning: radical?.meaning?.english,
    name: radical?.name?.hiragana,
  }))(),
  references,
  strokes: omit(strokes, ['timings']),
  type: 'kanji',
  video: {
    poster: video?.poster,
    video: video?.webm || video?.mp4,
  },
});

export default kanjiFormater;
