import express from 'express';
import rootRouter from './routes/index';
import cors from 'cors';
import logger from 'morgan';
import { config } from 'dotenv';

config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(logger('dev'));

app.use('/api/v1', rootRouter);

app.listen(process.env.PORT || 8080, () => {
  console.log('Listening on port ', process.env.PORT || 8080);
});
