const router = require('express').Router()
const authMiddleware = require('../middlewares/authMiddleware')
const roleMiddleware = require('../middlewares/roleMiddleware')
const { getWalletBalance, deductWalletBalance, createLedger} = require('../services/ledgerService')
const { createPayout } = require('../services/payoutService')

router.post('/', authMiddleware, roleMiddleware(['creator']), async (req, res) => {
  try {
    const creatorId = req.user.id;
    const { amount } = req.body;

    // 1. Validate input
    if (!amount || amount < 500) {
      return res.status(400).json({ error: 'Minimum ₹500 required' });
    }

    // 2. Check balance
    const balance = await getWalletBalance(creatorId);

    if (balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }
    // Ideally should be done in single Transaction
    // 3. Create payout
    const payoutId = await createPayout(creatorId, amount);

    // 4. Deduct balance
    await deductWalletBalance(creatorId, amount);

    // 5. Ledger entry
    await createLedger(creatorId, amount,'debit',payoutId);

    res.json({ message: 'Payout requested' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router