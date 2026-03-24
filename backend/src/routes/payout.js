const router = require('express').Router()
const authMiddleware = require('../middlewares/authMiddleware')
const roleMiddleware = require('../middlewares/roleMiddleware')
const {  deductWalletBalance, createLedger, getWalletForUpdate} = require('../services/ledgerService')
const { createPayout } = require('../services/payoutService')
const db = require('../db/db')

///


router.post('/', authMiddleware, roleMiddleware(['creator']), async (req, res) => {
  const creatorId = req.user.id;
  const { amount } = req.body;

  if (!amount || amount < 500) {
    return res.status(400).json({ error: 'Minimum ₹500 required' });
  }

  try {
    // 1. Begin transaction
    await new Promise((resolve, reject) =>
      db.beginTransaction(err => (err ? reject(err) : resolve()))
    );

    // 2. Lock wallet + get balance
    const balance = await getWalletForUpdate(creatorId);

    if (balance < amount) {
      throw new Error("Insufficient balance");
    }

    // 3. Create payout
    const payoutId = await createPayout(creatorId, amount);

    // 4. Deduct balance
    await deductWalletBalance(creatorId, amount);

    // 5. Ledger entry
    await createLedger(creatorId, amount, 'debit', payoutId);

    // 6. Commit
    await new Promise((resolve, reject) =>
      db.commit(err => (err ? reject(err) : resolve()))
    );

    res.json({ message: 'Payout requested', payoutId });

  } catch (err) {
    // rollback on any failure
    await new Promise(resolve => db.rollback(() => resolve()));

    res.status(400).json({ error: err.message });
  }
});
module.exports = router