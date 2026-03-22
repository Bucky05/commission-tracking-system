const express = require('express');
const app = express();
const authRouter = require('./routes/auth');
const referralRouter = require('./routes/referral')
const conversionRouter = require('./routes/conversion')
const productRouter = require('./routes/products')



app.use(express.json());

app.use('/api/v1/auth',authRouter)

app.use('/api/v1/product',productRouter)

app.use('/api/v1/referral',referralRouter)

app.use('/api/v1/conversion',conversionRouter)

app.listen(3500, () => {
  console.log('Server running');
});