const express = require("express");
const router = express.Router();

//Controller
const {
  insertPhoto,
  deletePhoto,
  getAllPhotos,
  getUserPhotos,
} = require("../controllers/PhotoController");

//Middlewares
const { photoInsertValidation } = require("../middlewares/photoValidation");
const authGuard = require("../middlewares/authGuard");
const validate = require("../middlewares/handlerValidation");
const { imageUpload } = require("../middlewares/imageUpload");

//Routes
//POST
router.post(
  "/",
  authGuard,
  imageUpload.single("image"),
  photoInsertValidation(),
  validate,
  insertPhoto
);

//DELETE
router.delete("/:id", authGuard, deletePhoto);

//GET
router.get("/", authGuard, getAllPhotos);
router.get("/user/:id", authGuard, getUserPhotos);

module.exports = router;
