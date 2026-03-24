const conversionService = require('../services/conversionService')
const { getProductById } = require('../services/productService')
const auth = require('../middlewares/authMiddleware')
const role = require('../middlewares/roleMiddleware')
const router = require('express').Router()
const { updateLedgerStatus, updateAvailableBalance} = require('../services/ledgerService')

router.post('/',   async (req, res) => {
  // in production this should be a webhook call by brand ( add role["brand"] middleware)
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

    // uncomment below code when this is triggered through webhook
    // if(product.brand_id != req.user.id) {
    //   res.status(403).send("Invalid product Id")
    //   return
    // }
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
router.use(auth)
router.get('/', role(['admin']), async (req, res) => {
  // this route can be used by admin to get all conversions and check their status and details
  try { 
    const conversions = await conversionService.getAllPendingConversions();
    res.json(conversions)
  } catch(err) {
    res.status(500).json({ error: err.message });
  }       
})

// this can be automated or all the conversion can be considered true/approved by default but this is good for extra security checks
router.patch('/:id/approve', role(['admin']), async (req, res) => {
  try {
    const { id } = req.params;

    // Get conversion
    const conversion = await conversionService.getConversionById(id);

    const { creator_id, commission } = conversion;

    // Update wallet
    await updateAvailableBalance(creator_id, commission);

    // Update ledger
    await updateLedgerStatus(id,'approved');

    res.json({ message: 'Approved' });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router