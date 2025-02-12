import Product from './product.model.js'; 
import { isValidObjectId } from "mongoose";
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url'; 
import { dirname } from 'path'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const addProduct = async (req, res) => {
    try {
        const { name, description, price, stock, category } = req.body;

        let image = req.file ? req.file.filename : null; 

        const product = await Product.create({
            name,
            description,
            price,
            stock,
            category,
            image, 
        });

        return res.status(201).json({
            message: "Producto creado exitosamente",
            product: {
                name: product.name,
                description: product.description,
                price: product.price,
                stock: product.stock,
                category: product.category,
                image: product.image, 
            },
        });
    } catch (err) {
        return res.status(500).json({
            message: "Error al crear el producto",
            error: err.message,
        });
    }
};

export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate("category");
        return res.status(200).json({
            message: "Productos obtenidos con éxito",
            products,
        });
    } catch (err) {
        return res.status(500).json({
            message: "Error al obtener los productos",
            error: err.message,
        });
    }
};

export const getProductById = async (req, res) => {
    const { id } = req.params;

    try {
        if (!isValidObjectId(id)) {
            return res.status(400).json({
                message: "ID de producto no válido.",
            });
        }

        const product = await Product.findById(id).populate("category");

        if (!product) {
            return res.status(404).json({
                message: "Producto no encontrado",
            });
        }

        return res.status(200).json({
            message: "Producto obtenido con éxito",
            product,
        });
    } catch (err) {
        return res.status(500).json({
            message: "Error al obtener el producto",
            error: err.message,
        });
    }
};

export const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, description, price, stock, category } = req.body;

    try {
        if (!isValidObjectId(id)) {
            return res.status(400).json({
                message: "ID de producto no válido.",
            });
        }

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                message: "Producto no encontrado",
            });
        }
        let images = req.files ? req.files.map(file => file.filename) : [];

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            {
                name: name || product.name,
                description: description || product.description,
                price: price || product.price,
                stock: stock || product.stock,
                category: category || product.category,
                images: images.length > 0 ? images : product.images,
            },
            { new: true }
        );

        return res.status(200).json({
            message: "Producto actualizado exitosamente",
            product: updatedProduct,
        });
    } catch (err) {
        return res.status(500).json({
            message: "Error al actualizar el producto",
            error: err.message,
        });
    }
};

export const searchProducts = async (req, res) => {
    const { query } = req.query;  

    try {
        if (!query) {
            return res.status(400).json({
                message: "Especifique un término de búsqueda",
            });
        }

        const products = await Product.find({
            name: { $regex: query, $options: "i" },  
        });

        return res.status(200).json({
            message: "Productos encontrados",
            products,
        });
    } catch (err) {
        return res.status(500).json({
            message: "Error al buscar productos",
            error: err.message,
        });
    }
};



export const getTopSellingProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ sold: -1 }).limit(5);

        return res.status(200).json({
            message: "Productos más vendidos",
            products,
        });
    } catch (err) {
        return res.status(500).json({
            message: "Error al obtener los productos más vendidos",
            error: err.message,
        });
    }
};

export const updateProductStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        if (!isValidObjectId(id)) {
            return res.status(400).json({
                message: "ID de producto no válido.",
            });
        }

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                message: "Producto no encontrado",
            });
        }

        product.status = status;

        await product.save();

        return res.status(200).json({
            message: `Producto ${status ? "activado" : "desactivado"} exitosamente`,
            product,
        });
    } catch (err) {
        return res.status(500).json({
            message: "Error al cambiar el estado del producto",
            error: err.message,
        });
    }
};


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
 *           description: Descripción del producto.
 *           example: "Un smartphone con pantalla AMOLED de 6.5 pulgadas."
 *         price:
 *           type: number
 *           description: Precio del producto.
 *           example: 299.99
 *         stock:
 *           type: number
 *           description: Cantidad de stock disponible del producto.
 *           example: 50
 *         category:
 *           type: string
 *           description: Categoría del producto.
 *           example: "Tecnología"
 *         image:
 *           type: string
 *           description: Imagen del producto.
 *           example: "smartphone-12345.jpg"
 *         status:
 *           type: boolean
 *           description: Estado del producto (activo o desactivado).
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
 * tags:
 *   name: Product
 *   description: Gestión de productos.
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
 * /products:
 *   post:
 *     summary: Crear un producto
 *     tags: [Product]
 *     requestBody:
 *       description: Datos del producto a crear
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
 *         description: ID del producto a actualizar
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Datos del producto a actualizar
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
 * /products/search:
 *   get:
 *     summary: Buscar productos
 *     tags: [Product]
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         description: Término de búsqueda para los productos.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Productos encontrados.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductListResponse'
 *       400:
 *         description: Especifique un término de búsqueda.
 *       500:
 *         description: Error al buscar productos.
 */

/**
 * @swagger
 * /products/top-selling:
 *   get:
 *     summary: Obtener los productos más vendidos
 *     tags: [Product]
 *     responses:
 *       200:
 *         description: Productos más vendidos obtenidos con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductListResponse'
 *       500:
 *         description: Error al obtener los productos más vendidos.
 */

/**
 * @swagger
 * /products/{id}/status:
 *   put:
 *     summary: Cambiar el estado de un producto (activado/desactivado)
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
 *         description: Estado del producto (true/false).
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
 *         description: Error al actualizar el estado del producto.
 */




