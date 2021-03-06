const Category = require("../models/categories.js");
const Items = require("../models/items.js");
const { body, validationResult } = require("express-validator");

const categoriesIndex = async (req, res) => {
  try {
    const allCategories = await Category.find();
    res.render("category/category", {
      title: "All Categories",
      allCategories,
    });
  } catch (err) {
    console.log(err);
  }
};

const getNewCategory = (req, res) => {
  try {
    res.render("category/new-category", { title: "new category" });
  } catch (err) {
    console.log(err);
  }
};

const postNewCategory = [
  [
    body("name").isLength({ min: 5, max: 32 }).escape(),
    body("description").isLength({ min: 5, max: 500 }).escape(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.render("category/new-category", {
          title: "new category",
          error: req.body,
        });
      } else {
        const category = new Category(req.body);
        await category.save();
        res.redirect("categories");
      }
    } catch (err) {
      console.log(err);
    }
  },
];

const deleteCategory = async (req, res) => {
  try {
    const category = req.params.category;
    const { name, _id } = await Category.findOne({ name: category });
    const items = await Items.find({ category: _id });
    if (items.length > 0) {
      res.json({ redirect: `/categories/${name}/${_id}` });
    } else {
      await Category.findByIdAndDelete(_id);
      res.json({ redirect: "category/categories" });
    }
  } catch (err) {
    console.log(err);
  }
};

const deleteError = async (req, res) => {
  const error = req.params.error;
  const items = await Items.find({ category: error });
  res.render("category/delete-error", { title: "error deleting", items });
};

const getspecificCategory = async (req, res) => {
  const param = req.params.category;
  const [category] = await Category.find({ name: param });
  res.render("category/specific-category", {
    title: category.name,
    category,
  });
};

module.exports = {
  categoriesIndex,
  getNewCategory,
  postNewCategory,
  deleteCategory,
  deleteError,
  getspecificCategory,
};
