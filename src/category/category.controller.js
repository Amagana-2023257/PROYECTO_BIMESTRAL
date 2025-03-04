import Category from "../category/category.model.js";
import Product from "../product/product.model.js";
import { isValidObjectId } from "mongoose";

const DEFAULT_CATEGORY_ID = "67c69b1de53630b2c6004b71";

export const addCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: "La categoría ya existe." });
    }
    const category = new Category({ name, description });
    await category.save();
    return res.status(201).json({
      message: "Categoría creada con éxito.",
      category,
    });
  } catch (err) {
    console.error("Error en addCategory:", err);
    return res.status(500).json({
      message: "Error al crear la categoría.",
      error: err.message,
    });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({ status: true });
    return res.status(200).json({
      message: "Categorías obtenidas con éxito.",
      categories,
    });
  } catch (err) {
    console.error("Error en getAllCategories:", err);
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
      return res.status(400).json({ message: "ID de categoría no válido." });
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
    console.error("Error en getCategoryById:", err);
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
      return res.status(400).json({ message: "ID de categoría no válido." });
    }
    const category = await Category.findById(id);
    if (!category || !category.status) {
      return res.status(404).json({
        message: "Categoría no encontrada o desactivada.",
      });
    }
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name, description, updatedAt: new Date() },
      { new: true }
    );
    return res.status(200).json({
      message: "Categoría actualizada con éxito.",
      category: updatedCategory,
    });
  } catch (err) {
    console.error("Error en updateCategory:", err);
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
      return res.status(400).json({ message: "ID de categoría no válido." });
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
    const defaultCategory = await Category.findById(DEFAULT_CATEGORY_ID);
    if (!defaultCategory) {
      return res.status(500).json({
        message:
          "Categoría predeterminada no encontrada. Asegúrese de crearla previamente.",
      });
    }
    await Product.updateMany(
      { category: id },
      { $set: { category: DEFAULT_CATEGORY_ID } }
    );
    return res.status(200).json({
      message: "Categoría desactivada y productos reasignados con éxito.",
      category: {
        name: category.name,
        description: category.description,
        status: category.status,
      },
    });
  } catch (err) {
    console.error("Error en deleteCategory:", err);
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
      return res.status(400).json({ message: "ID de categoría no válido." });
    }
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Categoría no encontrada." });
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
    console.error("Error en activateCategory:", err);
    return res.status(500).json({
      message: "Error al activar la categoría.",
      error: err.message,
    });
  }
};
/**
 * @swagger
 * /category/add:
 *   post:
 *     summary: Agregar una nueva categoría
 *     tags: [Categorías]
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
 *         description: La categoría ya existe.
 *       500:
 *         description: Error al crear la categoría.
 */

/**
 * @swagger
 * /category/:
 *   get:
 *     summary: Obtener todas las categorías activas
 *     tags: [Categorías]
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
 */

/**
 * @swagger
 * /category/{id}:
 *   get:
 *     summary: Obtener una categoría por su ID
 *     tags: [Categorías]
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
 */

/**
 * @swagger
 * /category/{id}:
 *   put:
 *     summary: Actualizar una categoría
 *     tags: [Categorías]
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
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Categoría actualizada con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: ID de categoría no válido.
 *       404:
 *         description: Categoría no encontrada o desactivada.
 *       500:
 *         description: Error al actualizar la categoría.
 */

/**
 * @swagger
 * /category/{id}:
 *   delete:
 *     summary: Desactivar una categoría y reasignar productos
 *     tags: [Categorías]
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
 *         description: ID de categoría no válido.
 *       404:
 *         description: Categoría no encontrada o ya desactivada.
 *       500:
 *         description: Error al desactivar la categoría o reasignar productos.
 */

/**
 * @swagger
 * /category/activate/{id}:
 *   patch:
 *     summary: Activar una categoría
 *     tags: [Categorías]
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
 *         description: ID de categoría no válido.
 *       404:
 *         description: Categoría no encontrada.
 *       500:
 *         description: Error al activar la categoría.
 */
