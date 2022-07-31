const router = require("express").Router();
// const { json } = require("sequelize/types");
const { Category, Product } = require("../../models");

// The `/api/categories` endpoint

router.get("/", async (req, res) => {
  try {
    const category = await Category.findAll({
      include: { model: Product },
    });
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id, {
      include: { model: Product },
    });
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/", async (req, res) => {
  try {
    const category = await Category.create({
      id: req.body.id,
      category_name: req.body.category_name,
    });
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const category = await Category.update(req.body, {
      where: {
        id: req.params.id,
      },
    })
      .then((category) => {
        // find all associated tags from CategoryTag
        return Category.findAll({ where: { product_id: req.params.id } });
      })
      .then((category) => {
        // get list of current ids
        const categoryIds = category.map(({ id }) => id);
        // create filtered list of new ids
        const newCategory = req.body.categoryIds
          .filter((id) => !categoryIds.includes(id))
          .map((id) => {
            return {
              id: req.params.id,
            };
          });
        // figure out which ones to remove
        const categoryToRemove = category
          .filter(({ id }) => !req.body.categoryIds.includes(id))
          .map(({ id }) => id);

        // run both actions
        return Promise.all([
          Category.destroy({ where: { id: categoryToRemove } }),
          Category.bulkCreate(newCategory),
        ]);
      });
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const category = await Category.destroy(req.params.id, {
      where: { id: req.params.id },
    });
    if (!category) {
      res.status(404) > json({ message: "No category found with this id!" });
      return;
    }
    res.status(200).json({ message: "category destroyed" });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
