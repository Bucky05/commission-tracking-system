const express = require('express');
const app = express();
const authRouter = require('./routes/auth');
const referralRouter = require('./routes/referral')
const authMiddleware = require('./middlewares/authMiddleware');
const productRouter = require('./routes/products')



app.use(express.json());

app.use('/api/v1/auth',authRouter)

app.use(authMiddleware)

app.use('/api/v1/product',productRouter)

app.use('/api/v1/referral',referralRouter)

app.listen(3500, () => {
  console.log('Server running');
});