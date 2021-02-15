import mongoose from 'mongoose';

const wordSchema = mongoose.Schema({
  isCommon: Boolean,
  jwordIds: [mongoose.Schema.Types.ObjectId],
  kanjiIds: [mongoose.Schema.Types.ObjectId],
  senseIds: [mongoose.Schema.Types.ObjectId],
});

const Word = mongoose.model('Word', wordSchema);

export default Word;
