require('dotenv').config();
const express = require('express');
const app = express();
const authRouter = require('./routes/auth');
const authMiddleware = require('./middlewares/authMiddleware');

app.use(express.json());

app.use('/api/v1/auth',authRouter)

app.use(authMiddleware)

app.listen(3500, () => {
  console.log('Server running');
});