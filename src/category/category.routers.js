import { Router } from "express";
import { addCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory, activateCategory} from "./category.controller.js"; 
import { addCategoryValidator, getCategoryByIdValidator, updateCategoryValidator, deleteCategoryValidator, activateCategoryValidator} from "../middlewares/validate-category.js";
import { hasRoles } from "../middlewares/validate-roles.js";
import { validateJWT } from "../middlewares/validate-jwt.js";

const router = Router();

// Client 
router.get("/", validateJWT, hasRoles("ADMIN", "CLIENT"), getAllCategories);


// ADMIN
router.post("/addCategory", addCategoryValidator, validateJWT, hasRoles("ADMIN"), addCategory);
router.put( "/updateCategory/:id", validateJWT, hasRoles("ADMIN"), updateCategoryValidator,  updateCategory);
router.get("/getCategoryById/:id", validateJWT, hasRoles("ADMIN"), getCategoryByIdValidator, getCategoryById);
router.delete( "/deleteCategory/:id", validateJWT, hasRoles("ADMIN"),  deleteCategoryValidator,  deleteCategory);
router.patch( "/activateCategory/:id", validateJWT, hasRoles("ADMIN"), activateCategoryValidator,  activateCategory);

export default router;

/**
 * @swagger
 * /category/:
 *   get:
 *     summary: Obtener todas las categorías activas
 *     tags: [Categorías]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Categorías obtenidas con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 categories:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 *       500:
 *         description: Error al obtener las categorías.
 *
 * @swagger
 * /category/addCategory:
 *   post:
 *     summary: Agregar una nueva categoría (ADMIN)
 *     tags: [Categorías]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Objeto con los campos name y description
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre de la categoría.
 *               description:
 *                 type: string
 *                 description: Descripción de la categoría.
 *     responses:
 *       201:
 *         description: Categoría creada con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: La categoría ya existe o error de validación.
 *       500:
 *         description: Error al crear la categoría.
 *
 * @swagger
 * /category/updateCategory/{id}:
 *   put:
 *     summary: Actualizar una categoría (ADMIN)
 *     tags: [Categorías]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la categoría a actualizar.
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Objeto con los campos name y description para actualizar la categoría.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nuevo nombre de la categoría.
 *               description:
 *                 type: string
 *                 description: Nueva descripción de la categoría.
 *     responses:
 *       200:
 *         description: Categoría actualizada con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: Error de validación o ID no válido.
 *       404:
 *         description: Categoría no encontrada o desactivada.
 *       500:
 *         description: Error al actualizar la categoría.
 *
 * @swagger
 * /category/getCategoryById/{id}:
 *   get:
 *     summary: Obtener una categoría por su ID (ADMIN)
 *     tags: [Categorías]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la categoría.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Categoría obtenida con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: ID de categoría no válido.
 *       404:
 *         description: Categoría no encontrada o desactivada.
 *       500:
 *         description: Error al obtener la categoría.
 *
 * @swagger
 * /category/deleteCategory/{id}:
 *   delete:
 *     summary: Desactivar una categoría y reasignar productos (ADMIN)
 *     tags: [Categorías]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la categoría a desactivar.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Categoría desactivada y productos reasignados con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 category:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     status:
 *                       type: boolean
 *       400:
 *         description: Error de validación o ID no válido.
 *       404:
 *         description: Categoría no encontrada o ya desactivada.
 *       500:
 *         description: Error al desactivar la categoría o reasignar productos.
 *
 * @swagger
 * /category/activateCategory/{id}:
 *   patch:
 *     summary: Activar una categoría (ADMIN)
 *     tags: [Categorías]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la categoría a activar.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Categoría activada con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: Error de validación o ID no válido.
 *       404:
 *         description: Categoría no encontrada.
 *       500:
 *         description: Error al activar la categoría.
 */
