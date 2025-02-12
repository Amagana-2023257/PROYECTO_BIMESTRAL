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

/**
 * @swagger
 * components:
 *   responses:
 *     InvoiceResponse:
 *       description: Respuesta con los detalles de la factura.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Invoice'
 *     InvoiceNotFoundResponse:
 *       description: Respuesta cuando no se encuentra la factura.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: "Factura no encontrada."
 *               error:
 *                 type: string
 *                 example: "Invoice not found"
 *     InvoiceErrorResponse:
 *       description: Respuesta de error para cualquier fallo en la operación.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: "Error al procesar la factura"
 *               error:
 *                 type: string
 *                 example: "Error message"
 */

/**
 * @swagger
 * /invoice:
 *   post:
 *     summary: Crear una nueva factura
 *     tags: [Invoice]
 *     requestBody:
 *       description: Información de la factura con productos asociados al usuario.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID del usuario que genera la factura.
 *                 example: "63f3b8315b846cb8d3a3c2fd"
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     product:
 *                       type: string
 *                       description: ID del producto facturado.
 *                       example: "63f3b8315b846cb8d3a3c2fd"
 *                     quantity:
 *                       type: number
 *                       description: Cantidad del producto en la factura.
 *                       example: 2
 *     responses:
 *       201:
 *         description: Factura creada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Invoice'
 *       400:
 *         description: Error al procesar la cantidad o productos con stock insuficiente.
 *       404:
 *         description: Producto no encontrado o ID de usuario inválido.
 *       500:
 *         description: Error al crear la factura.
 */

/**
 * @swagger
 * /invoice:
 *   get:
 *     summary: Obtener todas las facturas registradas.
 *     tags: [Invoice]
 *     responses:
 *       200:
 *         description: Facturas obtenidas con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Invoice'
 *       404:
 *         description: No se encontraron facturas.
 *       500:
 *         description: Error al obtener las facturas.
 */

/**
 * @swagger
 * /invoice/user:
 *   get:
 *     summary: Obtener todas las facturas de un usuario.
 *     tags: [Invoice]
 *     responses:
 *       200:
 *         description: Facturas obtenidas con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Invoice'
 *       404:
 *         description: No se encontraron facturas para este usuario.
 *       500:
 *         description: Error al obtener las facturas del usuario.
 */

/**
 * @swagger
 * /invoice/update:
 *   put:
 *     summary: Actualizar el estado de una factura.
 *     tags: [Invoice]
 *     requestBody:
 *       description: Datos necesarios para actualizar el estado de la factura.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               invoiceId:
 *                 type: string
 *                 description: ID de la factura a actualizar.
 *                 example: "63f3b8315b846cb8d3a3c2fd"
 *               status:
 *                 type: string
 *                 description: Nuevo estado de la factura (puede ser "PENDING", "PAID", "CANCELLED").
 *                 example: "PAID"
 *     responses:
 *       200:
 *         description: Factura actualizada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Invoice'
 *       400:
 *         description: Estado inválido o no permitido.
 *       404:
 *         description: Factura no encontrada.
 *       500:
 *         description: Error al actualizar la factura.
 */

/**
 * @swagger
 * /invoice/cancel/{invoiceId}:
 *   delete:
 *     summary: Cancelar una factura existente.
 *     tags: [Invoice]
 *     parameters:
 *       - in: path
 *         name: invoiceId
 *         required: true
 *         description: ID de la factura que se desea cancelar.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Factura cancelada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Invoice'
 *       400:
 *         description: No se puede cancelar una factura ya pagada o previamente cancelada.
 *       404:
 *         description: Factura no encontrada.
 *       500:
 *         description: Error al cancelar la factura.
 */
