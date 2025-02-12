import Category from "../category/category.model.js";
import { isValidObjectId } from "mongoose";

export const addCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({
                message: "La categoría ya existe.",
            });
        }

        const category = new Category({
            name,
            description,
        });

        await category.save();

        return res.status(201).json({
            message: "Categoría creada con éxito.",
            category,
        });
    } catch (err) {
        return res.status(500).json({
            message: "Error al crear la categoría.",
            error: err.message,
        });
    }
};

export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find({ status: true }); // Solo categorías activas
        return res.status(200).json({
            message: "Categorías obtenidas con éxito.",
            categories,
        });
    } catch (err) {
        return res.status(500).json({
            message: "Error al obtener las categorías.",
            error: err.message,
        });
    }
};

export const getCategoryById = async (req, res) => {
    const { id } = req.params;

    try {
        if (!isValidObjectId(id)) {
            return res.status(400).json({
                message: "ID de categoría no válido.",
            });
        }

        const category = await Category.findById(id);

        if (!category || !category.status) {
            return res.status(404).json({
                message: "Categoría no encontrada o desactivada.",
            });
        }

        return res.status(200).json({
            message: "Categoría obtenida con éxito.",
            category,
        });
    } catch (err) {
        return res.status(500).json({
            message: "Error al obtener la categoría.",
            error: err.message,
        });
    }
};

export const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;

    try {
        if (!isValidObjectId(id)) {
            return res.status(400).json({
                message: "ID de categoría no válido.",
            });
        }

        const category = await Category.findById(id);

        if (!category || !category.status) {
            return res.status(404).json({
                message: "Categoría no encontrada o desactivada.",
            });
        }

        const updatedCategory = await Category.findByIdAndUpdate(id, { name, description, updatedAt: new Date() }, { new: true });

        return res.status(200).json({
            message: "Categoría actualizada con éxito.",
            category: updatedCategory,
        });
    } catch (err) {
        return res.status(500).json({
            message: "Error al actualizar la categoría.",
            error: err.message,
        });
    }
};

export const deleteCategory = async (req, res) => {
    const { id } = req.params;

    try {
        if (!isValidObjectId(id)) {
            return res.status(400).json({
                message: "ID de categoría no válido.",
            });
        }

        const category = await Category.findById(id);

        if (!category || !category.status) {
            return res.status(404).json({
                message: "Categoría no encontrada o ya desactivada.",
            });
        }

        category.status = false;
        category.updatedAt = new Date(); 

        await category.save();

        return res.status(200).json({
            message: "Categoría desactivada con éxito.",
            category: {
                name: category.name,
                description: category.description,
                status: category.status,
            },
        });
    } catch (err) {
        return res.status(500).json({
            message: "Error al desactivar la categoría.",
            error: err.message,
        });
    }
};

export const activateCategory = async (req, res) => {
    const { id } = req.params;

    try {
        if (!isValidObjectId(id)) {
            return res.status(400).json({
                message: "ID de categoría no válido.",
            });
        }

        const category = await Category.findById(id);

        if (!category) {
            return res.status(404).json({
                message: "Categoría no encontrada.",
            });
        }

        category.status = true;
        category.updatedAt = new Date(); 

        await category.save();

        return res.status(200).json({
            message: "Categoría activada con éxito.",
            category: {
                name: category.name,
                description: category.description,
                status: category.status,
            },
        });
    } catch (err) {
        return res.status(500).json({
            message: "Error al activar la categoría.",
            error: err.message,
        });
    }
};


/**
 * @swagger
 * tags:
 *   name: Category
 *   description: Endpoint para la gestión de categorías.
 */

/**
 * @swagger
 * /category:
 *   post:
 *     summary: Crear una nueva categoría
 *     description: Permite crear una nueva categoría con nombre y descripción.
 *     tags: [Category]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
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
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Categoría creada con éxito."
 *                 category:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "Tecnología"
 *                     description:
 *                       type: string
 *                       example: "Categoría dedicada a productos tecnológicos."
 *       400:
 *         description: La categoría ya existe.
 *       500:
 *         description: Error al crear la categoría.
 */

/**
 * @swagger
 * /category:
 *   get:
 *     summary: Obtener todas las categorías
 *     description: Devuelve todas las categorías activas en el sistema.
 *     tags: [Category]
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
 *                   example: "Categorías obtenidas con éxito."
 *                 categories:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: "Tecnología"
 *                       description:
 *                         type: string
 *                         example: "Categoría dedicada a productos tecnológicos."
 *       500:
 *         description: Error al obtener las categorías.
 */

/**
 * @swagger
 * /category/{id}:
 *   get:
 *     summary: Obtener una categoría por ID
 *     description: Devuelve los detalles de una categoría específica por su ID.
 *     tags: [Category]
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
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Categoría obtenida con éxito."
 *                 category:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "Tecnología"
 *                     description:
 *                       type: string
 *                       example: "Categoría dedicada a productos tecnológicos."
 *       400:
 *         description: ID de categoría no válido.
 *       404:
 *         description: Categoría no encontrada o desactivada.
 *       500:
 *         description: Error al obtener la categoría.
 */

/**
 * @swagger
 * /category/{id}:
 *   put:
 *     summary: Actualizar una categoría por ID
 *     description: Permite actualizar el nombre y la descripción de una categoría existente.
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la categoría a actualizar.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre de la categoría.
 *               description:
 *                 type: string
 *                 description: Descripción de la categoría.
 *     responses:
 *       200:
 *         description: Categoría actualizada con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Categoría actualizada con éxito."
 *                 category:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "Tecnología"
 *                     description:
 *                       type: string
 *                       example: "Categoría dedicada a productos tecnológicos."
 *       400:
 *         description: ID de categoría no válido o datos incorrectos.
 *       404:
 *         description: Categoría no encontrada o desactivada.
 *       500:
 *         description: Error al actualizar la categoría.
 */

/**
 * @swagger
 * /category/{id}:
 *   delete:
 *     summary: Desactivar una categoría por ID
 *     description: Desactiva una categoría estableciendo su estado a falso.
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la categoría a desactivar.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Categoría desactivada con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Categoría desactivada con éxito."
 *                 category:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "Tecnología"
 *                     description:
 *                       type: string
 *                       example: "Categoría dedicada a productos tecnológicos."
 *                     status:
 *                       type: boolean
 *                       example: false
 *       400:
 *         description: ID de categoría no válido.
 *       404:
 *         description: Categoría no encontrada o ya desactivada.
 *       500:
 *         description: Error al desactivar la categoría.
 */

/**
 * @swagger
 * /category/{id}/activate:
 *   put:
 *     summary: Activar una categoría por ID
 *     description: Activa una categoría, cambiando su estado a verdadero.
 *     tags: [Category]
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
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Categoría activada con éxito."
 *                 category:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "Tecnología"
 *                     description:
 *                       type: string
 *                       example: "Categoría dedicada a productos tecnológicos."
 *                     status:
 *                       type: boolean
 *                       example: true
 *       400:
 *         description: ID de categoría no válido.
 *       404:
 *         description: Categoría no encontrada.
 *       500:
 *         description: Error al activar la categoría.
 */

