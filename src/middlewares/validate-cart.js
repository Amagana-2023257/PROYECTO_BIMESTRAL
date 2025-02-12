import { body, param, validationResult } from "express-validator";
import { validarCampos } from "./validate-fields.js"; 
import { handleErrors } from "./handle-errors.js"; 
import { searchProduct } from "../helpers/db-validators.js"

export const createCartValidator = [
  validarCampos,
  handleErrors
];

export const getCartValidator = [

  validarCampos,
  handleErrors
];

export const addProductToCartValidator = [
  body("productId")
    .notEmpty()
    .withMessage("El ID del producto es obligatorio.")
    .isMongoId()
    .withMessage("El ID del producto debe ser un ID válido de MongoDB.")
    .custom(searchProduct),
  body("quantity")
    .notEmpty()
    .withMessage("La cantidad es obligatoria.")
    .isInt({ min: 1 })
    .withMessage("La cantidad debe ser un número entero positivo.")
    .toInt(),
  validarCampos,
  handleErrors
];

export const updateProductQuantityValidator = [
  body("productId")
    .notEmpty()
    .withMessage("El ID del producto es obligatorio.")
    .isMongoId()
    .withMessage("El ID del producto debe ser un ID válido de MongoDB.")
    .custom(searchProduct),
  body("quantity")
    .notEmpty()
    .withMessage("La cantidad es obligatoria.")
    .isInt({ min: 1 })
    .withMessage("La cantidad debe ser un número entero positivo.")
    .toInt(),
  validarCampos,
  handleErrors
];

export const removeProductFromCartValidator = [
  param("productId")
    .notEmpty()
    .withMessage("El ID del producto es obligatorio.")
    .isMongoId()
    .withMessage("El ID del producto debe ser un ID válido de MongoDB.")
    .custom(searchProduct),
  validarCampos,
  handleErrors
];

export const clearCartValidator = [
  validarCampos,
  handleErrors
];
