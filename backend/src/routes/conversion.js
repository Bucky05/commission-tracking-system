const conversionService = require('../services/conversionService')
const { getProductById } = require('../services/productService')
const auth = require('../middlewares/authMiddleware')
const role = require('../middlewares/roleMiddleware')
const router = require('express').Router()

router.use(auth,role(['brand']))
router.post('/',  async (req, res) => {
  try {
    const { productId, creatorId, referenceId } = req.body;

    if (!productId || !creatorId) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const isApproved = await conversionService.checkApproval(productId, creatorId);
    if (!isApproved) {
      return res.status(400).json({ error: 'Creator not approved' });
    }

    // Check duplicate (if referenceId exists)
    if (referenceId) {
      const isDuplicate = await conversionService.checkDuplicate(referenceId);
      if (isDuplicate) {
        return res.status(400).json({ error: 'Duplicate conversion' });
      }
    }

    // Get product
    const product = await getProductById(productId);

    const commission =
      (product.price * product.commission_percentage) / 100;

    // Insert conversion
    await conversionService.createConversion({
      productId,
      creatorId,
      amount: product.price,
      commission,
      referenceId,
    });

    res.json({
      message: 'Conversion recorded',
      commission,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router