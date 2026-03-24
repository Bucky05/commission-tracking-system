const router = require("express").Router();
const role = require('../middlewares/roleMiddleware')
const authMiddleware = require('../middlewares/authMiddleware')
const {
  createReferralApplication,
  getApplicationsByBrandId,
  updateApplicationStatus,
  getReferralLink,
  getApplicationsByCreatorId
} = require("../services/referralService");

router.use(authMiddleware)

router.post("/", role(["creator"]), async (req, res) => {
  try {
    const { product_id } = req.body;
    const creatorId = req.user.id;

    await createReferralApplication(product_id, creatorId);
    res.json("Application submitted");
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

router.get("/brand", role(["brand"]), async (req, res) => {
  const brandId = req.user.id;
  try {
    const applications = await getApplicationsByBrandId(brandId);
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/creator", role(["creator"]), async (req, res) => {
  const creatorId = req.user.id;
  try {
    const applications = await getApplicationsByCreatorId(creatorId);
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch("/:id", role(["brand"]), async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // approved / rejected
    await updateApplicationStatus(id,status)
    res.json({ message: "Updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/referral-link/:productId', role(['creator']), async (req, res) => {
  try {
    const { productId } = req.params;
    const creatorId = req.user.id;

    const link = await getReferralLink(creatorId, productId);

    res.json({ referral_link: link });

  } catch (err) {
    res.status(403).json({ error: err.message });
  }
});


module.exports = router