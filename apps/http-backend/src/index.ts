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

app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ message: 'OK' });
});

app.listen(process.env.PORT || 3001, () => {
  console.log('Listening on port ', process.env.PORT || 3001);
});
