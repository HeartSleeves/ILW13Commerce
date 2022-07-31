const router = require("express").Router();
const { Tag, Product, ProductTag } = require("../../models");

// The `/api/tags` endpoint

router.get("/", async (req, res) => {
  try {
    const tag = await Tag.findAll({
      include: [{ model: Product, through: ProductTag, as: "Product" }],
    });
    res.status(200).json(tag);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const tag = await Tag.findByPk(req.params.id, {
      include: [{ model: Product, through: ProductTag, as: "Product" }],
    });
    res.status(200).json(tag);
  } catch (err) {
    res.status(500).json(err);
  }
});

// router.post("/", async (req, res) => {
// try {
//   const tag = await  Tag.create(req.body)
//     .then((tag) => {
//       if (req.body.productIds.length) {
//         const productTagIdArr = req.body.productIds.map((product_id) => {
//           return {
//             product_id: tag.id,
//             product_id,
//           };
//         });
//         return ProductTag.bulkCreate(productTagIdArr);
//       }
//       res.status(200).json(tag);
//     })
//     .then((tagIds) => res.status(200).json(tagIds))
//     .catch((err) => {
//       console.log(err);
//       res.status(400).json(err);
//     });
// });

// router.put("/:id", async (req, res) => {
// try {
//   const tag = await  Tag.update(req.body, {
//     where: {
//       id: req.params.id,
//     },
//   })
//     .then((tag) => {
//       return ProductTag.findAll({ where: { tag_id: req.params.id } });
//     })
//     .then((productTags) => {
//       const productTagIds = productTags.map(({ product_id }) => product_id);
//       // create filtered list of new product_ids
//       const newProductTags = req.body.tagIds
//         .filter((product_id) => !productTagIds.includes(product_id))
//         .map((product_id) => {
//           return {
//             tag_id: req.params.id,
//             product_id,
//           };
//         });
//       // figure out which ones to remove
//       const productTagsToRemove = productTags
//         .filter(({ product_id }) => !req.body.tagIds.includes(product_id))
//         .map(({ id }) => id);

//       // run both actions
//       return Promise.all([
//         ProductTag.destroy({ where: { id: productTagsToRemove } }),
//         ProductTag.bulkCreate(newProductTags),
//       ]);
//     })
//     .then((updatedProductTags) => res.json(updatedProductTags))
//     .catch((err) => {
//       // console.log(err);
//       res.status(400).json(err);
//     });
// });

// router.delete("/:id", async (req, res) => {
// try {
//   const tag = await  Tag.findByPk(req.params.id, {
//     where: [(id = req.params.id)],
//   }).catch((err) => {
//     console.log(err);
//     res.status(400).json(err);
//   });
// });

module.exports = router;
