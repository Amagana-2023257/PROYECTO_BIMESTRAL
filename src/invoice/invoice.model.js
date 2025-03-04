import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
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
                    required: true
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
        status: {
            type: String,
            enum: ["PENDING", "PAID", "CANCELLED"],
            default: "PENDING"
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

const Invoice = mongoose.model("Invoice", invoiceSchema);
export default Invoice;


/**
 * @swagger
 * components:
 *   schemas:
 *     InvoiceProduct:
 *       type: object
 *       properties:
 *         product:
 *           type: string
 *           description: ID del producto en la factura.
 *           example: "63f3b8315b846cb8d3a3c2fd"
 *         quantity:
 *           type: number
 *           description: Cantidad de productos en la factura.
 *           example: 2
 *         price:
 *           type: number
 *           description: Precio unitario del producto.
 *           example: 199.99
 * 
 *     Invoice:
 *       type: object
 *       properties:
 *         user:
 *           type: string
 *           description: ID del usuario asociado a la factura.
 *           example: "63f3b8315b846cb8d3a3c2fd"
 *         products:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/InvoiceProduct'
 *         total:
 *           type: number
 *           description: Total de la factura calculado como la suma del precio de los productos y sus cantidades.
 *           example: 399.98
 *         status:
 *           type: string
 *           description: Estado de la factura (puede ser "PENDING", "PAID", "CANCELLED").
 *           example: "PENDING"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha en la que la factura fue creada.
 *           example: "2025-02-12T14:00:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de la última actualización de la factura.
 *           example: "2025-02-12T14:00:00Z"
 *       required:
 *         - user
 *         - products
 *         - total
 *         - status
 */
