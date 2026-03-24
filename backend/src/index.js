const express = require('express');
const cors = require('cors');
const app = express();
const authRouter = require('./routes/auth');
const referralRouter = require('./routes/referral')
const conversionRouter = require('./routes/conversion')
const productRouter = require('./routes/products')
const payoutRouter = require('./routes/payout')
const walletRouter = require('./routes/wallet')

app.use(express.json());
app.use(cors());

app.use('/api/v1/auth',authRouter)

app.use('/api/v1/product',productRouter)

app.use('/api/v1/referral',referralRouter)

app.use('/api/v1/conversion',conversionRouter)

app.use('/api/v1/payout',payoutRouter)

app.use('/api/v1/wallet', walletRouter)
app.listen(3500, () => {
  console.log('Server running');
});