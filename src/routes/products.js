const { addProduct, getProductsForBrand , getAllProducts, getProductsByBrandId} = require("../services/productService");
const router = require('express').Router()
const role = require('../middlewares/roleMiddleware')

router.post("/", role(["brand"]), async (req, res) => {
  try {
    const { name, price, commission_percentage } = req.body;

    const brandId = req.user.id;

    await addProduct(brandId, name, price, commission_percentage);
    res.json({ message: "Product created" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/my-products",role(["brand"]),async (req,res) => {
    try {
        const brandId = req.user.id
        const products = await getProductsForBrand(brandId)
        res.json(products)
    } catch(err) {
        res.status(500).json({message:err.message})
    }
})

router.get("/",async (req,res) => {
    try {
        const products = await getAllProducts()
        res.json(products)
    } catch(err) {
        res.status(500).json({message:err.message})
    }
})

router.get("/brand/:brandId",async (req,res) => {
    try {
        const brandId = req.params.brandId
        const products = await getProductsByBrandId(brandId)
        res.json(products)
    } catch(err) {
        res.status(500).json({message:err.message})
    }
})
module.exports = router;