import Category from "../models/category.model.js";

const createCategory = async (req, res, next) => {
  try {
    const category = new Category({
      title: req.body.title,
    });

    const createCategory = await category.save();
    return res.json(createCategory);
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.categoryId);

    if (!category) {
      const error = new Error("Category was not found");
      next(error);
      return;
    }

    const updated = await Category.findByIdAndUpdate(
      category._id,
      {
        $set: {
          title: req.body.title,
        },
      },
      { new: true }
    );

    return res.json(updated);
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findOneAndDelete({
      _id: req.params.categoryId,
    });

    if (!category) {
      const error = new Error("Category was not found");
      return next(error);
    }

    return res.json({
      message: "Category is successfully deleted",
    });
  } catch (error) {
    next(error);
  }
};

const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

export { getAllCategories, createCategory, deleteCategory, updateCategory };
