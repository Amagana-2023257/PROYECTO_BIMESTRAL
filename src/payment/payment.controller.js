import Cart from "../cart/cart.model.js";
import Invoice from "../invoice/invoice.model.js";
import Product from "../product/product.model.js";

export const processPayment = async (req, res) => {
    try {
        const userId = req.usuario._id; 
        let cart = await Cart.findOne({ user: userId }).populate("products.product");

        if (!cart) {
            return res.status(404).json({ message: "Cart not found." });
        }

        if (cart.products.length === 0) {
            return res.status(400).json({ message: "Cart is empty. Cannot process payment." });
        }

        const productDetails = await Promise.all(
            cart.products.map(async (item) => {
                const product = await Product.findById(item.product);
                if (!product) {
                    return res.status(404).json({ message: `Product with ID ${item.product} not found.` });
                }

                if (product.stock < item.quantity) {
                    return res.status(400).json({ message: `Product ${product.name} does not have enough stock.` });
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
            status: "PAID",
        });

        await newInvoice.save();

        for (const item of productDetails) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: -item.quantity },
            });
        }

        cart.products = [];
        cart.total = 0;
        await cart.save();

        return res.status(201).json({
            message: "Payment processed successfully and invoice created.",
            invoice: newInvoice,
        });
    } catch (err) {
        return res.status(500).json({
            message: "Error processing payment.",
            error: err.message,
        });
    }
};


/**
 * @swagger
 * components:
 *   schemas:
 *     PaymentProduct:
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
 *             $ref: '#/components/schemas/PaymentProduct'
 *         total:
 *           type: number
 *           description: Total de la factura calculado como la suma del precio de los productos y sus cantidades.
 *           example: 399.98
 *         status:
 *           type: string
 *           description: Estado de la factura (debe ser "PAID" tras el pago).
 *           example: "PAID"
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
 *     PaymentSuccessResponse:
 *       description: Respuesta cuando el pago y la creación de la factura son exitosos.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Invoice'
 *     CartNotFoundResponse:
 *       description: Respuesta cuando el carrito no se encuentra.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: "Cart not found."
 *     CartEmptyResponse:
 *       description: Respuesta cuando el carrito está vacío.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: "Cart is empty. Cannot process payment."
 *     ProductNotFoundResponse:
 *       description: Respuesta cuando no se encuentra el producto en el carrito.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: "Product with ID <productId> not found."
 *     ProductStockErrorResponse:
 *       description: Respuesta cuando no hay suficiente stock de un producto.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: "Product <productName> does not have enough stock."
 *     PaymentErrorResponse:
 *       description: Respuesta cuando ocurre un error durante el proceso de pago.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: "Error processing payment."
 *               error:
 *                 type: string
 *                 example: "Error message"
 */

/**
 * @swagger
 * /payment:
 *   post:
 *     summary: Procesar un pago y crear una factura.
 *     tags: [Payment]
 *     responses:
 *       201:
 *         description: Pago procesado exitosamente y factura creada.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Invoice'
 *       400:
 *         description: Error si el carrito está vacío o si no hay suficiente stock para los productos.
 *       404:
 *         description: Error si el carrito o algún producto no se encuentra.
 *       500:
 *         description: Error interno al procesar el pago.
 */
