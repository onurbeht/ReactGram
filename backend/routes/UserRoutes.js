const express = require("express");
const router = express.Router();

//Controller
const {
  register,
  login,
  getCurrentUser,
  update,
  getUserByID,
} = require("../controllers/UserController");

//Middlewares
const validate = require("../middlewares/handlerValidation");
const {
  userCreateValidation,
  loginValidation,
  userUpdateValidation,
} = require("../middlewares/userValidations");
const authGuard = require("../middlewares/authGuard");
const { imageUpload } = require("../middlewares/imageUpload");

//Routes
//POST
router.post("/register", userCreateValidation(), validate, register);
router.post("/login", loginValidation(), validate, login);

//GET
router.get("/profile", authGuard, getCurrentUser);
router.get("/:id", getUserByID);

//PUT
router.put(
  "/",
  authGuard,
  userUpdateValidation(),
  validate,
  imageUpload.single("profileImage"),
  update
);

module.exports = router;
