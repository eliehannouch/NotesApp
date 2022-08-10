const Note = require("../../models/noteModel");
const User = require("../../models/userModel");
const Category = require("../../models/categoryModel");
const errorHandler = require("../../utils/validationErrorHandler").validateData;

exports.createNewNote = async (req, res) => {
  try {
    const noteOwner = await User.findById(req.user._id);
    if (!noteOwner) {
      return res.status(401).json({
        message: "The note owner does not exist / Or you are not logged in",
      });
    }

    const newNote = new Note({
      noteTitle: req.body.noteTitle,
      noteContent: req.body.noteContent,
      noteCategory: req.body.noteCategory,
      tags: req.body.tags,
      ownedBy: req.user._id,
    });
    await newNote.save();

    await noteOwner.updateOne({ $push: { ownedNotes: newNote._id } });
    await Category.findOneAndUpdate(
      { categoryType: newNote.noteCategory },
      { $push: { notesThatBelongToThisCategory: newNote._id } },
      { upsert: true }
    );

    return res.status(201).json({
      message: "Note created successfully",
      data: newNote,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

exports.deleteNote = async (req, res) => {
  try {
    const noteToDelete = await Note.findById(req.params.id);
    if (!noteToDelete) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    const noteOwner = await User.findById(req.user._id);
    if (!noteOwner) {
      return res.status(401).json({
        message: "The note owner does not exist",
      });
    }

    if (noteToDelete.ownedBy.toString() !== noteOwner._id.toString()) {
      return res.status(401).json({
        message: "You are not authorized to delete this note",
      });
    }

    await Category.findOneAndDelete(
      { categoryType: noteToDelete.noteCategory },
      { $pull: { notesThatBelongToThisCategory: noteToDelete._id } }
    );
    await noteToDelete.remove();

    await noteOwner.updateOne({ $pull: { ownedNotes: noteToDelete._id } });

    return res.status(200).json({
      message: "Note deleted successfully",
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

exports.updateNote = async (req, res) => {
  try {
    const noteToUpdate = await Note.findById(req.body.NOTEID);
    if (!noteToUpdate) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    const noteOwner = await User.findById(req.user._id);
    if (!noteOwner) {
      return res.status(401).json({
        message: "The note owner does not exist",
      });
    }

    if (noteToUpdate.ownedBy.toString() !== noteOwner._id.toString()) {
      return res.status(401).json({
        message: "You are not authorized to update this note",
      });
    }

    if (req.body.ownedBy) {
      return res.status(400).json({
        message: "You are not allowed to change the owner of a note",
      });
    }

    await noteToUpdate.updateOne(req.body);

    if (req.body.noteCategory) {
      // Remove the note from the old category
      await Category.findOneAndUpdate(
        { categoryType: noteToUpdate.noteCategory },
        { $pull: { notesThatBelongToThisCategory: noteToUpdate._id } }
      );
      // add the note to the new category
      await Category.findOneAndUpdate(
        { categoryType: req.body.noteCategory },
        { $push: { notesThatBelongToThisCategory: noteToUpdate._id } },
        { upsert: true }
      );
    }
    return res.status(200).json({
      message: "Note updated successfully",
      data: noteToUpdate,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

exports.searchByTag = async (req, res) => {
  try {
    const notes = await Note.find({
      $and: [{ tags: { $in: [req.params.tag] } }, { ownedBy: req.user._id }],
    });

    if (notes.length > 0) {
      return res.status(200).json({
        message: "Notes that have the provided tag are: ",
        data: notes,
      });
    }
    return res.status(404).json({
      message: "No notes found with the provided tag",
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

// Sort in ascending order by update date
exports.sortNotesByUpdateDate = async (req, res) => {
  try {
    const notes = await Note.aggregate([
      { $match: { ownedBy: req.user._id } },
      { $sort: { updatedAt: 1 } },
    ]);

    if (notes.length == 0)
      return res.status(404).json({ message: "No notes found" });

    return res.status(200).json({
      message: "Notes sorted by update date",
      data: notes,
    });
  } catch (error) {
    console.log(error);
    errorHandler(res, error);
  }
};

exports.filterByCategory = async (req, res) => {
  try {
    const notes = await Note.find({
      $and: [{ noteCategory: req.params.category }, { ownedBy: req.user._id }],
    });

    if (notes.length == 0)
      return res.status(404).json({ message: "No notes found" });

    return res.status(200).json({
      message: "Notes filtered by category",
      data: notes,
    });
  } catch (err) {
    errorHandler(res, err);
  }
};
