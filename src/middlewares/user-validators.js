import { body } from "express-validator"; 
import { validarCampos } from "./validate-fields.js";
import { handleErrors } from "./handle-errors.js";
import { emailExists, blockRole } from "../helpers/db-validators.js"


export const registerValidator = [
  body("name")
    .notEmpty().withMessage("El nombre es requerido")
    .isLength({ min: 3 }).withMessage("El nombre debe tener al menos 3 caracteres"),

  body("email")
    .isEmail().withMessage("El correo electrónico no es válido")
    .normalizeEmail() 
    .custom(emailExists), 
  body("password")
    .notEmpty().withMessage("La contraseña es requerida")
    .isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres"),

  body("role")
    .optional() 
    .custom(blockRole), 

  validarCampos, 
  handleErrors,
];

export const loginValidator = [
  body("email")
    .isEmail()
    .withMessage("El correo electrónico no es válido")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("La contraseña es requerida"),
  validarCampos,
  handleErrors,
];

