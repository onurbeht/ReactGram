const express = require("express");
const router = express.Router();

//Controller
const {
  register,
  login,
  getCurrentUser,
} = require("../controllers/UserController");

//Middlewares
const validate = require("../middlewares/handlerValidation");
const {
  userCreateValidation,
  loginValidation,
} = require("../middlewares/userValidations");
const authGuard = require("../middlewares/authGuard");

//Routes
//POST
router.post("/register", userCreateValidation(), validate, register);
router.post("/login", loginValidation(), validate, login);

//GET
router.get("/profile", authGuard, getCurrentUser);

module.exports = router;
