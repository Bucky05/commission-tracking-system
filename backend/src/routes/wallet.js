const router = require('express').Router();
const auth = require('../middlewares/authMiddleware')
const role = require('../middlewares/roleMiddleware')
const { getWalletBalance } = require('../services/ledgerService')

router.get('/', auth, role(['creator']), async (req, res) => {
  try {
    const balance = await getWalletBalance(req.user.id);    
    res.json(balance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }     
});

module.exports = router;