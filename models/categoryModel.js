const mongoose = require("mongoose");

const categoryModel = new mongoose.Schema(
  {
    categoryType: {
      type: String,
      required: [true, "Please enter a valid category name"],
      trim: true,
      unique: true,
      enum: ["Personal", "Family", "Work", "Other"],
    },

    categoryDescription: {
      type: String,
      required: [true, "Please enter a valid category description"],
      trim: true,
      minLength: 5,
      maxLength: 255,
    },

    notesThatBelongToThisCategory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Note",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categoryModel);
