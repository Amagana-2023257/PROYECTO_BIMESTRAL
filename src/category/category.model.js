import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },
        description: {
            type: String,
            required: true
        },
        status: {
            type: Boolean,
            default: true 
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        }
    },
    { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);
export default Category;


/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Nombre único de la categoría.
 *           example: "Tecnología"
 *         description:
 *           type: string
 *           description: Descripción detallada de la categoría.
 *           example: "Categoría dedicada a productos tecnológicos."
 *         status:
 *           type: boolean
 *           description: Estado de la categoría (activa o desactivada).
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación de la categoría.
 *           example: "2025-02-12T14:00:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de la última actualización de la categoría.
 *           example: "2025-02-12T14:00:00Z"
 *       required:
 *         - name
 *         - description
 *         - status
 *         - createdAt
 *         - updatedAt
 */

/**
 * @swagger
 * tags:
 *   name: Category
 *   description: Esquema y estructura de la categoría.
 */

/**
 * @swagger
 * components:
 *   responses:
 *     CategoryResponse:
 *       description: Respuesta que incluye los detalles de una categoría.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 */

/**
 * @swagger
 * components:
 *   responses:
 *     CategoryListResponse:
 *       description: Respuesta que incluye una lista de categorías.
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/Category'
 */

