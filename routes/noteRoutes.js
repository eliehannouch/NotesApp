const express = require("express");
const router = express.Router();
const protectEndPoints =
  require("../controllers/authControllers/authorizationController").protectRoutes;
const notesController = require("../controllers/notesControllers/notes_CRUD_controller");

router.post("/newNote", protectEndPoints, notesController.createNewNote);
router.delete("/deleteNote/:id", protectEndPoints, notesController.deleteNote);
router.patch("/updateNote", protectEndPoints, notesController.updateNote);

router.get("/searchByTag/:tag", protectEndPoints, notesController.searchByTag);

router.get(
  "/sortNotesByUpdateDate",
  protectEndPoints,
  notesController.sortNotesByUpdateDate
);

router.get(
  "/filterByCategory/:category",
  protectEndPoints,
  notesController.filterByCategory
);
module.exports = router;
