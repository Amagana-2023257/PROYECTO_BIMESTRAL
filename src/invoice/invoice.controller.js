import Invoice from "./invoice.model.js";
import Product from "../product/product.model.js";

export const createInvoice = async (req, res) => {
    try {
        const { userId, products } = req.body;

        const productDetails = await Promise.all(
            products.map(async (item) => {
                const product = await Product.findById(item.product);
                if (!product) {
                    return res.status(404).json({ message: `Producto con ID ${item.product} no encontrado.` });
                }

                if (product.stock < item.quantity) {
                    return res.status(400).json({ message: `Producto ${product.name} no tiene suficiente stock.` });
                }

                return {
                    product: product._id,
                    quantity: item.quantity,
                    price: product.price,
                };
            })
        );

        const total = productDetails.reduce((acc, item) => acc + item.price * item.quantity, 0);

        const newInvoice = new Invoice({
            user: userId,
            products: productDetails,
            total,
            status: "PENDING",
        });

        await newInvoice.save();

        for (const item of productDetails) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: -item.quantity },
            });
        }

        return res.status(201).json({ message: "Factura creada exitosamente", invoice: newInvoice });
    } catch (err) {
        return res.status(500).json({ message: "Error al crear la factura", error: err.message });
    }
};

export const getAllInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find().populate("user").populate("products.product");

        if (!invoices || invoices.length === 0) {
            return res.status(404).json({ message: "No hay facturas registradas." });
        }

        return res.status(200).json({ invoices });
    } catch (err) {
        return res.status(500).json({ message: "Error al obtener las facturas", error: err.message });
    }
};

export const getInvoicesByUser = async (req, res) => {
    try {
        const userId = req.usuario._id;

        const invoices = await Invoice.find({ user: userId }).populate("products.product");

        if (!invoices || invoices.length === 0) {
            return res.status(404).json({ message: "No hay facturas para este usuario." });
        }

        return res.status(200).json({ invoices });
    } catch (err) {
        return res.status(500).json({ message: "Error al obtener las facturas del usuario", error: err.message });
    }
};

export const updateInvoice = async (req, res) => {
    try {
        const { invoiceId, status } = req.body;

        if (!["PENDING", "PAID", "CANCELLED"].includes(status)) {
            return res.status(400).json({ message: "Estado inválido." });
        }

        const invoice = await Invoice.findById(invoiceId);

        if (!invoice) {
            return res.status(404).json({ message: "Factura no encontrada." });
        }

        invoice.status = status;
        invoice.updatedAt = Date.now();

        await invoice.save();

        return res.status(200).json({ message: "Factura actualizada exitosamente", invoice });
    } catch (err) {
        return res.status(500).json({ message: "Error al actualizar la factura", error: err.message });
    }
};


export const cancelInvoice = async (req, res) => {
    try {
        const { invoiceId } = req.params;

        const invoice = await Invoice.findById(invoiceId);

        if (!invoice) {
            return res.status(404).json({ message: "Invoice not found." });
        }

        if (invoice.status === "CANCELLED") {
            return res.status(400).json({ message: "Invoice has already been cancelled." });
        }
        if (invoice.status === "PAID") {
            return res.status(400).json({ message: "Cannot cancel a paid invoice." });
        }

        invoice.status = "CANCELLED";
        invoice.updatedAt = Date.now();

        for (const item of invoice.products) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: item.quantity },
            });
        }

        await invoice.save();

        return res.status(200).json({ message: "Invoice cancelled successfully.", invoice });
    } catch (err) {
        return res.status(500).json({ message: "Error cancelling the invoice", error: err.message });
    }
};


/**
 * @swagger
 * components:
 *   schemas:
 *     InvoiceProduct:
 *       type: object
 *       properties:
 *         product:
 *           type: string
 *           description: ID del producto de la factura.
 *           example: "63f3b8315b846cb8d3a3c2fd"
 *         quantity:
 *           type: number
 *           description: Cantidad de producto facturado.
 *           example: 3
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
 *           description: Total de la factura.
 *           example: 599.97
 *         status:
 *           type: string
 *           description: Estado de la factura. Puede ser "PENDING", "PAID" o "CANCELLED".
 *           example: "PENDING"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha en la que fue creada la factura.
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
 * 
 *   responses:
 *     InvoiceResponse:
 *       description: Respuesta con los detalles de la factura.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Invoice'
 *     InvoiceNotFoundResponse:
 *       description: Respuesta de error cuando no se encuentra la factura.
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
 *     summary: Crear una factura para un usuario
 *     tags: [Invoice]
 *     requestBody:
 *       description: Información de la factura con productos que el usuario compra.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID del usuario.
 *                 example: "63f3b8315b846cb8d3a3c2fd"
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     product:
 *                       type: string
 *                       description: ID del producto.
 *                       example: "63f3b8315b846cb8d3a3c2fd"
 *                     quantity:
 *                       type: number
 *                       description: Cantidad de producto.
 *                       example: 2
 *     responses:
 *       201:
 *         description: Factura creada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Invoice'
 *       400:
 *         description: Error en la cantidad o stock de los productos.
 *       404:
 *         description: Producto no encontrado.
 *       500:
 *         description: Error al crear la factura.
 */

/**
 * @swagger
 * /invoice:
 *   get:
 *     summary: Obtener todas las facturas registradas
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
 *     summary: Obtener las facturas de un usuario
 *     tags: [Invoice]
 *     responses:
 *       200:
 *         description: Facturas del usuario obtenidas con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Invoice'
 *       404:
 *         description: No se encontraron facturas para el usuario.
 *       500:
 *         description: Error al obtener las facturas del usuario.
 */

/**
 * @swagger
 * /invoice/update:
 *   put:
 *     summary: Actualizar el estado de una factura
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
 *                 description: Nuevo estado de la factura. Puede ser "PENDING", "PAID", o "CANCELLED".
 *                 example: "PAID"
 *     responses:
 *       200:
 *         description: Factura actualizada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Invoice'
 *       400:
 *         description: Estado inválido.
 *       404:
 *         description: Factura no encontrada.
 *       500:
 *         description: Error al actualizar la factura.
 */

/**
 * @swagger
 * /invoice/cancel/{invoiceId}:
 *   delete:
 *     summary: Cancelar una factura
 *     tags: [Invoice]
 *     parameters:
 *       - in: path
 *         name: invoiceId
 *         required: true
 *         description: ID de la factura a cancelar.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Factura cancelada con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Invoice'
 *       400:
 *         description: No se puede cancelar una factura pagada o ya cancelada.
 *       404:
 *         description: Factura no encontrada.
 *       500:
 *         description: Error al cancelar la factura.
 */
