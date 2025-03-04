import { Router } from "express";
import { 
  addProduct, 
  getAllProducts, 
  getProductById, 
  updateProduct, 
  searchProducts, 
  getTopSellingProducts, 
  updateProductStatus 
} from "./product.controller.js";
import { 
  addProductValidator, 
  updateProductValidator, 
  getProductByIdValidator, 
  searchProductsValidator 
} from "../middlewares/validate-product.js";
import { validateJWT } from "../middlewares/validate-jwt.js";
import { hasRoles } from "../middlewares/validate-roles.js";
import { uploadProductPicture } from "../middlewares/multer-uploads.js";

const router = Router();

// Rutas para CLIENT y ADMIN
router.get("/", validateJWT, hasRoles("ADMIN", "CLIENT"), getAllProducts);
router.get("/search", validateJWT, hasRoles("ADMIN", "CLIENT"), searchProductsValidator, searchProducts);
router.get("/top-selling", validateJWT, hasRoles("ADMIN", "CLIENT"), getTopSellingProducts);
router.get("/search/:id", validateJWT, hasRoles("ADMIN", "CLIENT"), getProductByIdValidator, getProductById);

// Rutas exclusivas para ADMIN
router.post("/addProduct", uploadProductPicture.single("image"), validateJWT, hasRoles("ADMIN"), addProductValidator, addProduct);
router.put("/updateProduct/:id", validateJWT, hasRoles("ADMIN"), updateProductValidator, updateProduct);
router.patch("/deleteProduct/:id", validateJWT, hasRoles("ADMIN"), updateProductStatus);

export default router;


/**
 * @swagger
 * /product/:
 *   get:
 *     summary: Obtener todos los productos
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Productos obtenidos con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       500:
 *         description: Error al obtener los productos.
 *
 * @swagger
 * /product/search:
 *   get:
 *     summary: Buscar productos por nombre
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         description: Término de búsqueda para el nombre del producto.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Productos encontrados.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       400:
 *         description: Término de búsqueda no especificado.
 *       500:
 *         description: Error al buscar productos.
 *
 * @swagger
 * /product/top-selling:
 *   get:
 *     summary: Obtener los productos más vendidos
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Productos más vendidos obtenidos con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       500:
 *         description: Error al obtener los productos más vendidos.
 *
 * @swagger
 * /product/search/{id}:
 *   get:
 *     summary: Obtener un producto por su ID
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del producto.
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
 *
 * @swagger
 * /product/addProduct:
 *   post:
 *     summary: Agregar un nuevo producto (ADMIN)
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Objeto con los detalles del producto y su imagen.
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del producto.
 *               description:
 *                 type: string
 *                 description: Descripción del producto.
 *               price:
 *                 type: number
 *                 description: Precio del producto.
 *               stock:
 *                 type: number
 *                 description: Stock disponible.
 *               category:
 *                 type: string
 *                 description: ID de la categoría.
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Imagen del producto.
 *             required:
 *               - name
 *               - price
 *               - stock
 *               - category
 *     responses:
 *       201:
 *         description: Producto creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       500:
 *         description: Error al crear el producto.
 *
 * @swagger
 * /product/updateProduct/{id}:
 *   put:
 *     summary: Actualizar un producto (ADMIN)
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del producto a actualizar.
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Objeto con los campos a actualizar. Si se envía una nueva imagen, se actualizará.
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: number
 *               category:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Producto actualizado exitosamente.
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
 *
 * @swagger
 * /product/deleteProduct/{id}:
 *   patch:
 *     summary: Actualizar el estado de un producto (activar/desactivar) (ADMIN)
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del producto cuyo estado se actualizará.
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Objeto con el nuevo estado del producto.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: boolean
 *                 description: Nuevo estado del producto.
 *     responses:
 *       200:
 *         description: Estado del producto actualizado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: ID de producto no válido.
 *       404:
 *         description: Producto no encontrado.
 *       500:
 *         description: Error al cambiar el estado del producto.
 */
