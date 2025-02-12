import { body, param } from "express-validator";

export const addCategoryValidator = [
    body("name")
        .isString().withMessage("El nombre debe ser una cadena de texto.")
        .notEmpty().withMessage("El nombre es obligatorio.")
        .isLength({ min: 3 }).withMessage("El nombre debe tener al menos 3 caracteres."),
    body("description")
        .isString().withMessage("La descripción debe ser una cadena de texto.")
        .notEmpty().withMessage("La descripción es obligatoria.")
        .isLength({ min: 5 }).withMessage("La descripción debe tener al menos 5 caracteres.")
];

export const getCategoryByIdValidator = [
    param("id")
        .isMongoId().withMessage("El ID de categoría no es válido.")
];

export const updateCategoryValidator = [
    param("id")
        .isMongoId().withMessage("El ID de categoría no es válido."),
    body("name")
        .optional()
        .isString().withMessage("El nombre debe ser una cadena de texto.")
        .isLength({ min: 3 }).withMessage("El nombre debe tener al menos 3 caracteres."),
    body("description")
        .optional()
        .isString().withMessage("La descripción debe ser una cadena de texto.")
        .isLength({ min: 5 }).withMessage("La descripción debe tener al menos 5 caracteres.")
];

export const deleteCategoryValidator = [
    param("id")
        .isMongoId().withMessage("El ID de categoría no es válido.")
];

export const activateCategoryValidator = [
    param("id")
        .isMongoId().withMessage("El ID de categoría no es válido.")
];
