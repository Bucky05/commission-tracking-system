const productService = require('../services/productService');
const { trackClick } = require('../services/trackingService')
const router = require('express').Router()
const role = require('../middlewares/roleMiddleware')
const authMiddleware = require('../middlewares/authMiddleware')


router.get("/my-products",authMiddleware,role(["brand"]),async (req,res) => {
    try {
        const brandId = req.user.id
        const products = await productService.getProductsForBrand(brandId)
        res.json(products)
    } catch(err) {
        res.status(500).json({message:err.message})
    }
})
router.get('/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const creatorId = req.query.ref;

    // track click (only if referral exists)
    if (creatorId) {
      await trackClick(productId, creatorId);
      res.redirect(`http://localhost:3000/product/${productId}?ref=${creatorId}`);
      return
    }

    const product = await productService.getProductById(productId);

    res.json(product);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/",async (req,res) => {
    try {
        const products = await productService.getAllProducts()
        res.json(products)
    } catch(err) {
        res.status(500).json({message:err.message})
    }
})

router.get("/brand/:brandId",async (req,res) => {
    try {
        const brandId = req.params.brandId
        const products = await productService.getProductsByBrandId(brandId)
        res.json(products)
    } catch(err) {
        res.status(500).json({message:err.message})
    }
})
router.use(authMiddleware)

router.post("/", role(["brand"]), async (req, res) => {
  try {
    const { name, price, commissionPercentage } = req.body;

    const brandId = req.user.id;

    await productService.addProduct(brandId, name, price, commissionPercentage);
    res.json({ message: "Product created" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});






module.exports = router;