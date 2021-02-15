import mongoose from 'mongoose';

const SenseSchema = mongoose.Schema({
  definitions: {
    required: true,
    type: String,
    unique: true,
  },
  examples: [mongoose.Schema.Types.ObjectId],
  partsOfSpeech: String,
  tags: String,
});

const Sense = mongoose.model('Sense', SenseSchema);

export default Sense;
