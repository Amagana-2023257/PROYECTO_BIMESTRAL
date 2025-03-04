import Product from "./product.model.js";
import { isValidObjectId } from "mongoose";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url"; 
import { dirname } from "path"; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const addProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category } = req.body;
    const image = req.file ? req.file.filename : null;

    const product = await Product.create({
      name,
      description,
      price,
      stock,
      category,
      image
    });

    return res.status(201).json({
      message: "Producto creado exitosamente",
      product: {
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        category: product.category,
        image: product.image
      }
    });
  } catch (err) {
    console.error("Error en addProduct:", err);
    return res.status(500).json({
      message: "Error al crear el producto",
      error: err.message
    });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("category");
    return res.status(200).json({
      message: "Productos obtenidos con éxito",
      products
    });
  } catch (err) {
    console.error("Error en getAllProducts:", err);
    return res.status(500).json({
      message: "Error al obtener los productos",
      error: err.message
    });
  }
};

export const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        message: "ID de producto no válido."
      });
    }
    const product = await Product.findById(id).populate("category");
    if (!product) {
      return res.status(404).json({
        message: "Producto no encontrado"
      });
    }
    return res.status(200).json({
      message: "Producto obtenido con éxito",
      product
    });
  } catch (err) {
    console.error("Error en getProductById:", err);
    return res.status(500).json({
      message: "Error al obtener el producto",
      error: err.message
    });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, stock, category } = req.body;
  try {
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        message: "ID de producto no válido."
      });
    }
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        message: "Producto no encontrado"
      });
    }
    // Manejo de imagen: se actualiza si se envía un nuevo archivo
    const image = req.file ? req.file.filename : product.image;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name: name || product.name,
        description: description || product.description,
        price: price || product.price,
        stock: stock || product.stock,
        category: category || product.category,
        image // Actualiza la imagen solo si se envía
      },
      { new: true }
    );

    return res.status(200).json({
      message: "Producto actualizado exitosamente",
      product: updatedProduct
    });
  } catch (err) {
    console.error("Error en updateProduct:", err);
    return res.status(500).json({
      message: "Error al actualizar el producto",
      error: err.message
    });
  }
};

export const searchProducts = async (req, res) => {
  const { query } = req.query;  
  try {
    if (!query) {
      return res.status(400).json({
        message: "Especifique un término de búsqueda"
      });
    }
    const products = await Product.find({
      name: { $regex: query, $options: "i" }
    });
    return res.status(200).json({
      message: "Productos encontrados",
      products
    });
  } catch (err) {
    console.error("Error en searchProducts:", err);
    return res.status(500).json({
      message: "Error al buscar productos",
      error: err.message
    });
  }
};

export const getTopSellingProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ sold: -1 }).limit(5);
    return res.status(200).json({
      message: "Productos más vendidos",
      products
    });
  } catch (err) {
    console.error("Error en getTopSellingProducts:", err);
    return res.status(500).json({
      message: "Error al obtener los productos más vendidos",
      error: err.message
    });
  }
};

export const updateProductStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        message: "ID de producto no válido."
      });
    }
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        message: "Producto no encontrado"
      });
    }
    product.status = status;
    await product.save();
    return res.status(200).json({
      message: `Producto ${status ? "activado" : "desactivado"} exitosamente`,
      product
    });
  } catch (err) {
    console.error("Error en updateProductStatus:", err);
    return res.status(500).json({
      message: "Error al cambiar el estado del producto",
      error: err.message
    });
  }
};

/**
 * @swagger
 * /product:
 *   post:
 *     summary: Crear un producto
 *     tags: [Product]
 *     requestBody:
 *       description: Objeto con los detalles del producto.
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
 *                 description: Imagen del producto (opcional).
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
 */

/**
 * @swagger
 * /product:
 *   get:
 *     summary: Obtener todos los productos
 *     tags: [Product]
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
 */

/**
 * @swagger
 * /product/{id}:
 *   get:
 *     summary: Obtener un producto por su ID
 *     tags: [Product]
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
 */

/**
 * @swagger
 * /product/{id}:
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
 *       description: Objeto con los campos a actualizar del producto. Si se envía una nueva imagen, se actualizará.
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
 */

/**
 * @swagger
 * /product/search:
 *   get:
 *     summary: Buscar productos por nombre
 *     tags: [Product]
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
 */

/**
 * @swagger
 * /product/top-selling:
 *   get:
 *     summary: Obtener los productos más vendidos
 *     tags: [Product]
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
 */

/**
 * @swagger
 * /product/{id}/status:
 *   patch:
 *     summary: Actualizar el estado de un producto (activar/desactivar)
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del producto a actualizar.
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
