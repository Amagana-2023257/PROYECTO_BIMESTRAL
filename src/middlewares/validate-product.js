import { body, param, query } from "express-validator";

export const addProductValidator = [
    body("name")
        .isString().withMessage("El nombre debe ser una cadena de texto.")
        .notEmpty().withMessage("El nombre es obligatorio.")
        .isLength({ min: 3 }).withMessage("El nombre debe tener al menos 3 caracteres."),
    body("description")
        .isString().withMessage("La descripción debe ser una cadena de texto.")
        .notEmpty().withMessage("La descripción es obligatoria.")
        .isLength({ min: 5 }).withMessage("La descripción debe tener al menos 5 caracteres."),
    body("price")
        .isNumeric().withMessage("El precio debe ser un número.")
        .notEmpty().withMessage("El precio es obligatorio.")
        .isFloat({ min: 0 }).withMessage("El precio debe ser un número positivo."),
    body("stock")
        .isNumeric().withMessage("El stock debe ser un número.")
        .notEmpty().withMessage("El stock es obligatorio.")
        .isInt({ min: 0 }).withMessage("El stock debe ser un número entero positivo."),
    body("category")
        .isMongoId().withMessage("El ID de categoría no es válido.")
        .notEmpty().withMessage("La categoría es obligatoria.")
];

export const updateProductValidator = [
    param("id")
        .isMongoId().withMessage("El ID de producto no es válido."),
    body("name")
        .optional()
        .isString().withMessage("El nombre debe ser una cadena de texto.")
        .isLength({ min: 3 }).withMessage("El nombre debe tener al menos 3 caracteres."),
    body("description")
        .optional()
        .isString().withMessage("La descripción debe ser una cadena de texto.")
        .isLength({ min: 5 }).withMessage("La descripción debe tener al menos 5 caracteres."),
    body("price")
        .optional()
        .isNumeric().withMessage("El precio debe ser un número.")
        .isFloat({ min: 0 }).withMessage("El precio debe ser un número positivo."),
    body("stock")
        .optional()
        .isNumeric().withMessage("El stock debe ser un número.")
        .isInt({ min: 0 }).withMessage("El stock debe ser un número entero positivo."),
    body("category")
        .optional()
        .isMongoId().withMessage("El ID de categoría no es válido."),
];

export const getProductByIdValidator = [
    param("id")
        .isMongoId().withMessage("El ID de producto no es válido.")
];

export const deleteProductValidator = [
    param("id")
        .isMongoId().withMessage("El ID de producto no es válido.")
];

export const searchProductsValidator = [
    query("query")
        .isString().withMessage("El término de búsqueda debe ser una cadena de texto.")
        .notEmpty().withMessage("El término de búsqueda es obligatorio."),
];



