const { body } = require("express-validator");

const photoInsertValidation = () => {
  return [
    body("title")
      .not()
      .equals("undefined")
      .withMessage("O título é obrigatório!")
      .isString()
      .withMessage("O título é obrigatório!")
      .isLength({ min: 1 })
      .withMessage("O título precisa de pelo menos um caractere"),
    body("image").custom((value, { req }) => {
      if (!req.file) {
        throw new Error("A imagem é obrigatória!");
      }
      return true;
    }),
  ];
};

const photoUpdateValidation = () => {
  return [
    body("title")
      .optional()
      .isString()
      .withMessage("O titulo é obrigatório!")
      .isLength({ min: 1 })
      .withMessage("O título precisa de pelo menos um caracteres."),
  ];
};

const commentValidation = () => {
  return [body("comment").isString().withMessage("O comentário é obrigatório")];
};

module.exports = {
  photoInsertValidation,
  photoUpdateValidation,
  commentValidation,
};
