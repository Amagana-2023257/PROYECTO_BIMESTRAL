import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        stock: {
            type: Number,
            required: true,
            default: 0
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true
        },
        image: {
            type: String,
            default: null
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

const Product = mongoose.model("Product", productSchema);
export default Product;


/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Nombre del producto.
 *           example: "Smartphone"
 *         description:
 *           type: string
 *           description: Descripción detallada del producto.
 *           example: "Smartphone de 6.5 pulgadas con 128GB de almacenamiento."
 *         price:
 *           type: number
 *           description: Precio del producto.
 *           example: 299.99
 *         stock:
 *           type: number
 *           description: Número de unidades disponibles en inventario.
 *           example: 50
 *         category:
 *           type: string
 *           description: ID de la categoría a la que pertenece el producto.
 *           example: "63f3b8315b846cb8d3a3c2fd"  # Este es solo un ejemplo.
 *         image:
 *           type: string
 *           description: Nombre del archivo de la imagen del producto.
 *           example: "smartphone-image.jpg"
 *         status:
 *           type: boolean
 *           description: Estado del producto (activo o inactivo).
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación del producto.
 *           example: "2025-02-12T14:00:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de la última actualización del producto.
 *           example: "2025-02-12T14:00:00Z"
 *       required:
 *         - name
 *         - description
 *         - price
 *         - stock
 *         - category
 *         - status
 *         - createdAt
 *         - updatedAt
 */
