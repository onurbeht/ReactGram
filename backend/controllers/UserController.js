const User = require("../models/User");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JWT_SECRET;

//Generete user token
const genereteToken = (id) => {
  return jwt.sign({ id }, jwtSecret, { expiresIn: "7d" });
};

//Register user and sign in
const register = async (req, res) => {
  const { name, email, password } = req.body;

  //check if user exists
  const user = await User.findOne({ email });

  if (user) {
    res.status(422).json({
      errros: ["Por favor, utilize outro email"],
    });
    return;
  }

  //genereate password hash
  const salt = await bcrypt.genSalt();
  const passwordHash = await bcrypt.hash(password, salt);

  //create user
  const newUser = await User.create({
    name,
    email,
    password: passwordHash,
  });

  //if user was created successfully, return the token
  if (!newUser) {
    res.status(422).json({
      errors: ["Houve um erro, por favor tente mais tarde."],
    });
    return;
  }

  res.status(201).json({
    _id: newUser._id,
    token: genereteToken(newUser._id),
  });
};

//sign user in
const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  //check if users exists
  if (!user) {
    res.status(404).json({
      errors: ["Usuários ou senha inválidos"],
    });
    return;
  }

  //check if password matches
  if (!(await bcrypt.compare(password, user.password))) {
    res.status(422).json({
      errors: ["Usuários ou senha inválidos"],
    });
    return;
  }

  //Return user and token
  res.status(201).json({
    _id: user._id,
    profileImage: user.profileImage,
    token: genereteToken(user._id),
  });
};

module.exports = {
  register,
  login,
};
