const parseKanjiApi = ({
  kanji,
  kun_readings: kunReadings = [],
  on_readings: onReadings = [],
  stroke_count: strokeCount,
  meanings = [],
  jlpt,
  grade,
} = {}) => ({
  kunyomi: kunReadings,
  meaning: meanings.map((meaning) => meaning.replace('-', '')),
  onyomi: onReadings,
  references: {
    grade,
    jlpt,
  },
  strokes: { count: strokeCount },
  word: kanji,
});

export default parseKanjiApi;
