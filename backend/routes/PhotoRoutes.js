const express = require("express");
const router = express.Router();

//Controller
const {
  insertPhoto,
  deletePhoto,
  getAllPhotos,
  getUserPhotos,
  getPhotoById,
  updatePhoto,
  likePhoto,
  commentPhoto,
  searchPhoto,
} = require("../controllers/PhotoController");

//Middlewares
const {
  photoInsertValidation,
  photoUpdateValidation,
  commentValidation,
} = require("../middlewares/photoValidation");
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
router.get("/search", authGuard, searchPhoto);
router.get("/:id", authGuard, getPhotoById);

//PUT
router.put("/:id", authGuard, photoUpdateValidation(), validate, updatePhoto);
router.put("/like/:id", authGuard, likePhoto);
router.put(
  "/comment/:id",
  authGuard,
  commentValidation(),
  validate,
  commentPhoto
);

module.exports = router;
