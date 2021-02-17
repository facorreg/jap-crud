import mongoose from 'mongoose';

import connect from '@mongo/connect';
import { getEnv } from '@utils';

const connection = connect(getEnv('DB_TATOEBA'), true);

const corpusSchema = mongoose.Schema({
  en: {
    required: true,
    type: String,
    unique: true,
  },
  jp: {
    required: true,
    type: String,
    unique: true,
  },
});

const Corpus = connection.model('sentences', corpusSchema);

export default Corpus;
