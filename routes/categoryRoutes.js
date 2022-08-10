const express = require("express");
const router = express.Router();

const categoryController = require("../controllers/categoryControllers/category_CRUD_Controller");

router.post("/newCategory", categoryController.createNewCategory);
router.delete("/deleteCategory/:DELETEID", categoryController.deleteCategory);
router.get("/fetchCategory/:TYPE", categoryController.fetchCategoryContent);
router.patch("/updateCategory", categoryController.updateCategoryDesciption);

module.exports = router;
