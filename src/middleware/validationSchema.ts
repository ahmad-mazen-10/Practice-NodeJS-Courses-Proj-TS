const { body } = require("express-validator");

const validationSchema = () => {
  return [
    body("name")
      .notEmpty()
      .withMessage("name is required")
      .isLength({ min: 4 })
      .withMessage("name at least 2 char"),
    body("price").notEmpty().withMessage("price is required"),
  ];
};

module.exports = { validationSchema };
