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

/**
 * @swagger
 * components:
 *   responses:
 *     ProductResponse:
 *       description: Respuesta que incluye los detalles de un producto.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 */

/**
 * @swagger
 * components:
 *   responses:
 *     ProductListResponse:
 *       description: Respuesta que incluye una lista de productos.
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/Product'
 */

/**
 * @swagger
 * components:
 *   responses:
 *     InvalidProductIDResponse:
 *       description: Respuesta de error cuando se proporciona un ID de producto no válido.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: "ID de producto no válido."
 *               error:
 *                 type: string
 *                 example: "Invalid ObjectId"
 */

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Crear un nuevo producto
 *     tags: [Product]
 *     requestBody:
 *       description: Datos del producto a crear.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Producto creado con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       500:
 *         description: Error al crear el producto.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InvalidProductIDResponse'
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Obtener todos los productos
 *     tags: [Product]
 *     responses:
 *       200:
 *         description: Productos obtenidos con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductListResponse'
 *       500:
 *         description: Error al obtener los productos.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InvalidProductIDResponse'
 */

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Obtener un producto por su ID
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del producto
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Producto obtenido con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: ID de producto no válido.
 *       404:
 *         description: Producto no encontrado.
 *       500:
 *         description: Error al obtener el producto.
 */

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Actualizar un producto
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del producto a actualizar.
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Datos para actualizar el producto.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Producto actualizado con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: ID de producto no válido.
 *       404:
 *         description: Producto no encontrado.
 *       500:
 *         description: Error al actualizar el producto.
 */

/**
 * @swagger
 * /products/{id}/status:
 *   put:
 *     summary: Cambiar el estado de un producto (activo/inactivo)
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del producto a actualizar.
 *         schema:
 *           type: string
 *       - in: body
 *         name: status
 *         description: Estado del producto (true para activo, false para inactivo).
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Estado del producto actualizado con éxito.
 *       400:
 *         description: ID de producto no válido.
 *       404:
 *         description: Producto no encontrado.
 *       500:
 *         description: Error al cambiar el estado del producto.
 */
