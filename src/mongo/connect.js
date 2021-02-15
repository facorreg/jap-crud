import mongoose from 'mongoose';

const connect = (db) =>
  mongoose.connect(`mongodb://localhost/${db}`, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

export default connect;
