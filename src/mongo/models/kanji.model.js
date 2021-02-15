import mongoose from 'mongoose';

const kanjiSchema = mongoose.Schema({
  character: {
    type: String,
    unique: true,
  },
  exampleIds: [mongoose.Schema.Types.ObjectId],
  kunyomi: String,
  meaning: String,
  onyomi: String,
  references: {
    classic_nelson: String,
    grade: Number,
    jlpt: Number,
    kodansha: String,
  },
  strokes: {
    count: Number,
    images: [String],
  },
  video: {
    poster: String,
    video: String,
  },
});

const Kanji = mongoose.model('Kanji', kanjiSchema);

export default Kanji;
