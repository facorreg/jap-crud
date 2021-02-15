import mongoose from 'mongoose';

const jwordSchema = mongoose.Schema({
  reading: {
    required: true,
    type: String,
  },
  word: String,
});

jwordSchema.index({ reading: 1, word: 1 }, { unique: true });
const Jword = mongoose.model('Jword', jwordSchema);

export default Jword;
