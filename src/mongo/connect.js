import mongoose from 'mongoose';

const connect = (db, createCo = false) =>
  mongoose[createCo ? 'createConnection' : 'connect'](`mongodb://localhost/${db}`, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

export default connect;
