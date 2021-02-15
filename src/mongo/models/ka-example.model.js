import mongoose from 'mongoose';

const KaExampleSchema = mongoose.Schema({
  audio: {
    audio: String,
    format: String,
  },
  furigana: String,
  meaning: String,
  type: String,
  word: String,
});

KaExampleSchema.index({ furigana: 1, word: 1 }, { unique: true });

const Example = mongoose.model('ka_example', KaExampleSchema);

export default Example;
