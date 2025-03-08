import express from 'express';
import rootRouter from './routes/index';
import cors from 'cors';
import logger from 'morgan';

const app = express();
app.use(cors());
app.use(express.json());
app.use(logger('dev'));

app.use('/api/v1', rootRouter);

app.listen(3001, () => {
  console.log('Listening on port 3001');
});
