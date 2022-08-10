const Category = require("../../models/categoryModel");
const errorHandler = require("../../utils/validationErrorHandler").validateData;

exports.createNewCategory = async (req, res) => {
  try {
    const category = await Category.findOne({
      categoryType: req.body.categoryType,
    });
    if (category) {
      return res.status(409).json({
        message: "Category already exists, notes can be directly link to it",
      });
    }

    const newCategory = await Category.create({
      categoryType: req.body.categoryType,
      categoryDescription: req.body.categoryDescription,
    });
    res.status(201).json({
      message: "Category created successfully",
      data: newCategory,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findOne({
      _id: req.params.DELETEID,
    });
    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }
    await category.remove();
    res.status(200).json({
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.log(error);
    errorHandler(res, error);
  }
};

// Finding one category based on it's type, and expanding all the notes that belong to it if exist
// Same applies to find all .
exports.fetchCategoryContent = async (req, res) => {
  try {
    const category = await Category.findOne({
      categoryType: req.params.TYPE,
    });

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    if (category.notesThatBelongToThisCategory.length > 0) {
      await category.populate("notesThatBelongToThisCategory");
    }

    res.status(200).json({
      message: "Category found successfully",
      data: category,
    });
  } catch (error) {
    console.log(error);
    errorHandler(res, error);
  }
};

exports.updateCategoryDesciption = async (req, res) => {
  try {
    const category = await Category.findOne({
      categoryType: req.body.UPDATETYPE,
    });

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    if (req.body.categoryType) {
      return res
        .status(400)
        .json({
          message:
            "Category type cannot be changed, you can only update the description",
        });
    }

    category.categoryDescription = req.body.categoryDescription;
    await category.save();
    res.status(200).json({
      message: "Category description updated successfully",
      data: category,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};
