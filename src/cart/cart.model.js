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

/**
 * @swagger
 * /cart:
 *   post:
 *     summary: Crear un carrito para un usuario
 *     tags: [Cart]
 *     responses:
 *       201:
 *         description: Carrito creado con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       400:
 *         description: El carrito ya existe.
 *       500:
 *         description: Error al crear el carrito.
 */

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Obtener el carrito de un usuario
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: Carrito obtenido con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       404:
 *         description: Carrito no encontrado.
 *       500:
 *         description: Error al obtener el carrito.
 */

/**
 * @swagger
 * /cart/add-product:
 *   post:
 *     summary: Agregar un producto al carrito de un usuario
 *     tags: [Cart]
 *     requestBody:
 *       description: Información del producto a agregar al carrito.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 description: ID del producto a agregar.
 *                 example: "63f3b8315b846cb8d3a3c2fd"
 *               quantity:
 *                 type: number
 *                 description: Cantidad del producto a agregar.
 *                 example: 2
 *     responses:
 *       200:
 *         description: Producto agregado al carrito con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       400:
 *         description: Error al agregar producto al carrito.
 *       404:
 *         description: Producto o carrito no encontrado.
 *       500:
 *         description: Error al agregar el producto al carrito.
 */

/**
 * @swagger
 * /cart/update-product-quantity:
 *   put:
 *     summary: Actualizar la cantidad de un producto en el carrito
 *     tags: [Cart]
 *     requestBody:
 *       description: Nuevo número de unidades del producto en el carrito.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 description: ID del producto a actualizar.
 *                 example: "63f3b8315b846cb8d3a3c2fd"
 *               quantity:
 *                 type: number
 *                 description: Nueva cantidad del producto.
 *                 example: 4
 *     responses:
 *       200:
 *         description: Cantidad del producto actualizada con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       404:
 *         description: Producto no encontrado en el carrito.
 *       500:
 *         description: Error al actualizar la cantidad del producto.
 */

/**
 * @swagger
 * /cart/remove-product/{productId}:
 *   delete:
 *     summary: Eliminar un producto del carrito
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         description: ID del producto a eliminar del carrito.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Producto eliminado del carrito con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       404:
 *         description: Producto no encontrado en el carrito.
 *       500:
 *         description: Error al eliminar el producto del carrito.
 */

/**
 * @swagger
 * /cart/clear:
 *   delete:
 *     summary: Vaciar el carrito de un usuario
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: Carrito vacío con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       404:
 *         description: Carrito no encontrado.
 *       500:
 *         description: Error al vaciar el carrito.
 */
