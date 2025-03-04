import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        products: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1
                },
                price: {
                    type: Number,
                    required: true
                }
            }
        ],
        total: {
            type: Number,
            required: true
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

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;


/**
 * @swagger
 * components:
 *   schemas:
 *     CartProduct:
 *       type: object
 *       properties:
 *         product:
 *           type: string
 *           description: ID del producto en el carrito.
 *           example: "63f3b8315b846cb8d3a3c2fd"
 *         quantity:
 *           type: number
 *           description: Cantidad del producto en el carrito.
 *           example: 3
 *         price:
 *           type: number
 *           description: Precio del producto.
 *           example: 199.99
 * 
 *     Cart:
 *       type: object
 *       properties:
 *         user:
 *           type: string
 *           description: ID del usuario asociado al carrito.
 *           example: "63f3b8315b846cb8d3a3c2fd"
 *         products:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CartProduct'
 *         total:
 *           type: number
 *           description: Total del carrito.
 *           example: 599.97
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha en que fue creado el carrito.
 *           example: "2025-02-12T14:00:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de la última actualización del carrito.
 *           example: "2025-02-12T14:00:00Z"
 *       required:
 *         - user
 *         - products
 *         - total
 * 
 *   responses:
 *     CartResponse:
 *       description: Respuesta que incluye los detalles del carrito.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cart'
 *     CartNotFoundResponse:
 *       description: Respuesta de error cuando el carrito no es encontrado.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: "Carrito no encontrado."
 *               error:
 *                 type: string
 *                 example: "Cart not found"
 */