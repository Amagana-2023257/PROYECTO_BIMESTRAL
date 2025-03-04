import { Router } from "express";
import { createCart,getCart,addProductToCart,updateProductQuantity,removeProductFromCart,clearCart } from "./cart.controller.js";
import { validateJWT } from "../middlewares/validate-jwt.js";
import { hasRoles } from "../middlewares/validate-roles.js";
import { createCartValidator,getCartValidator,addProductToCartValidator,updateProductQuantityValidator,removeProductFromCartValidator,clearCartValidator } from "../middlewares/validate-cart.js";

const router = Router();

router.post("/createCart", validateJWT, hasRoles("ADMIN", "CLIENT"), createCartValidator, createCart);
router.get("/", validateJWT, hasRoles("ADMIN", "CLIENT"), getCartValidator, getCart);
router.post("/add", validateJWT, hasRoles("ADMIN", "CLIENT"), addProductToCartValidator, addProductToCart);
router.put("/update", validateJWT, hasRoles("ADMIN", "CLIENT"), updateProductQuantityValidator, updateProductQuantity);
router.delete("/remove/:productId", validateJWT, hasRoles("ADMIN", "CLIENT"), removeProductFromCartValidator, removeProductFromCart);
router.delete("/clear", validateJWT, hasRoles("ADMIN", "CLIENT"), clearCartValidator, clearCart);

export default router;
/**
 * @swagger
 * /cart/createCart:
 *   post:
 *     summary: Crear un carrito para el usuario autenticado
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
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
 *
 * @swagger
 * /cart:
 *   get:
 *     summary: Obtener el carrito del usuario autenticado
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
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
 *
 * @swagger
 * /cart/add:
 *   post:
 *     summary: Agregar un producto al carrito
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Objeto con el productId y quantity
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *                 description: ID del producto a agregar.
 *               quantity:
 *                 type: number
 *                 description: Cantidad del producto a agregar.
 *     responses:
 *       200:
 *         description: Producto agregado al carrito con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       404:
 *         description: Producto o carrito no encontrado.
 *       500:
 *         description: Error al agregar producto al carrito.
 *
 * @swagger
 * /cart/update:
 *   put:
 *     summary: Actualizar la cantidad de un producto en el carrito
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Objeto con el productId y la nueva cantidad (quantity)
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *                 description: ID del producto a actualizar.
 *               quantity:
 *                 type: number
 *                 description: Nueva cantidad del producto.
 *     responses:
 *       200:
 *         description: Cantidad de producto actualizada con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       404:
 *         description: Producto no encontrado en el carrito.
 *       500:
 *         description: Error al actualizar la cantidad del producto.
 *
 * @swagger
 * /cart/remove/{productId}:
 *   delete:
 *     summary: Eliminar un producto del carrito
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
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
 *
 * @swagger
 * /cart/clear:
 *   delete:
 *     summary: Vaciar el carrito del usuario autenticado
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
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
