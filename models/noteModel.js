const mongoose = require("mongoose");

const noteModel = new mongoose.Schema(
  {
    noteTitle: {
      type: String,
      required: [true, "Please enter a valid note title"],
      trim: true,
      minLength: 3,
      maxLength: 100,
    },

    noteContent: {
      type: String,
      required: [true, "A note cannot be created with empty content"],
      trim: true,
      minLength: 5,
      maxLength: 500,
    },

    ownedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "A note must be owned by a user"],
    },
    noteCategory: {
      type: String,
      required: [true, "Please enter a valid category"],
      enum: ["Personal", "Family", "Work", "Other"],
    },

    tags: [
      { type: String, required: [true, "Each note must have one or more tag"] },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Note", noteModel);
