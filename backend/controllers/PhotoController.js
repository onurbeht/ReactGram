const Photo = require("../models/Photo");
const User = require("../models/User");

const mongoose = require("mongoose");

const insertPhoto = async (req, res) => {
  const { title } = req.body;
  const image = req.file.filename;

  const reqUser = req.user;

  const user = await User.findById(reqUser._id);

  //Create a photo
  const newPhoto = await Photo.create({
    image,
    title,
    userId: user._id,
    userName: user.name,
  });

  //check if photo was created sucessfully
  if (!newPhoto) {
    res.status(422).json({
      errors: ["Houve um problema, por favor tente novamente mais tarde."],
    });
    return;
  }

  res.status(201).json(newPhoto);
};

//Remove a photo from DB
const deletePhoto = async (req, res) => {
  const { id } = req.params;

  const reqUser = req.user;

  try {
    const photo = await Photo.findById(new mongoose.Types.ObjectId(id));

    //check if photo exists
    if (!photo) {
      res.status(404).json({
        errors: ["Ocorreu um erro, por favor tente novamente mais tarde."],
      });
      return;
    }

    //check if photo belongs to user
    if (!photo.userId.equals(reqUser._id)) {
      res.status(422).json({
        errors: ["Ocorreu um erro, por favor tente novamente mais tarde."],
      });
    }

    await Photo.findByIdAndDelete(photo.id);

    res.status(200).json({
      id: photo._id,
      message: "Foto excluída com sucesso!",
    });
  } catch (error) {
    res.status(404).json({ errors: ["Foto não encontrado!"] });
  }
};

//Get all photos
const getAllPhotos = async (req, res) => {
  const photos = await Photo.find({})
    .sort([["createdAt", -1]])
    .exec();

  res.status(200).json(photos);
};

//get user photos
const getUserPhotos = async (req, res) => {
  const { id } = req.params;

  const photos = await Photo.find({ userId: id })
    .sort([["createdAt", -1]])
    .exec();

  if (photos.length === 0) {
    res.status(404).json({ errors: ["usuário(a) não tem fotos"] });
    return;
  }

  res.status(200).json(photos);
};

//get photo by id
const getPhotoById = async (req, res) => {
  const { id } = req.params;

  const photo = await Photo.findById(new mongoose.Types.ObjectId(id));

  if (!photo) {
    res.status(404).json({ errors: ["Foto não encontrada."] });
    return;
  }

  res.status(200).json(photo);
};

//Update a photo
const updatePhoto = async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const reqUser = req.user;

  const photo = await Photo.findById(id);

  //check if photo exists
  if (!photo) {
    res.status(404).json({ errors: ["Foto não encontrada"] });
    return;
  }

  //check if photo belongs to user
  if (!photo.userId.equals(reqUser._id)) {
    res.status(422).json({
      errors: ["Ocorreu um erro, por favor tente novamente mais tarde."],
    });
    return;
  }

  if (title) {
    photo.title = title;
  }

  await photo.save();

  res.status(200).json({ photo, message: "Foto atualizada com sucesso!" });
};

//Like funcionality
const likePhoto = async (req, res) => {
  const { id } = req.params;
  const reqUser = req.user;

  const photo = await Photo.findById(id);

  //check if photo exists
  if (!photo) {
    res.status(404).json({ errors: ["Foto não encontrada"] });
    return;
  }

  //check if user already liked the photo
  if (photo.likes.includes(reqUser._id)) {
    photo.likes.splice(photo.likes.indexOf(reqUser._id, 1));
    await photo.save();
    res.status(200).json({ message: "Like removido" });
    return;
  } else {
    //Put user._id em likes
    await photo.likes.push(reqUser._id);

    await photo.save();

    res.status(200).json({
      photoId: id,
      userId: reqUser._id,
      message: "A foto foi curtida",
    });
  }
};

//Comment functionality
const commentPhoto = async (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;

  const reqUser = req.user;

  const user = await User.findById(reqUser._id);
  const photo = await Photo.findById(id);

  //check if photo exists
  if (!photo) {
    res.status(404).json({ errors: ["Foto não encontrada"] });
    return;
  }

  //Put comment in the array comments
  const userComment = {
    comment,
    userName: user.name,
    userImage: user.profileImage,
    userId: user._id,
  };

  photo.comments.push(userComment);

  await photo.save();

  res
    .status(200)
    .json({ comment: userComment, message: "Comentário adicionado" });
};

//Search photo by title
const searchPhoto = async (req, res) => {
  const { q } = req.query;

  const photos = await Photo.find({ title: new RegExp(q, "i") }).exec();

  if (photos.length === 0) {
    res.status(404).json({ errors: ["Nenhuma foto encontrada."] });
    return;
  }

  res.status(200).json(photos);
};

module.exports = {
  insertPhoto,
  deletePhoto,
  getAllPhotos,
  getUserPhotos,
  getPhotoById,
  updatePhoto,
  likePhoto,
  commentPhoto,
  searchPhoto,
};
