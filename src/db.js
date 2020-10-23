import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

mongoose.connect(
  process.env.PRODUCTION ? process.env.MONGO_URL_PROD : process.env.MONGO_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  }
).catch(err => console.log(err));

const db = mongoose.connection;

db.once('open', () => console.log('✅ Mongo DB is Connected'));
db.on('error', () => console.log('❌ Mongo DB has Error'))