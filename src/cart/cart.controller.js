import Cart from "./cart.model.js";
import Product from "../product/product.model.js";

export const createCart = async (req, res) => {
  try {
    const userId = req.usuario._id; 
    let cart = await Cart.findOne({ user: userId });
    if (cart) {
      return res.status(400).json({ message: "El carrito ya existe." });
    }

    cart = new Cart({
      user: userId,
      products: [],
      total: 0
    });

    await cart.save();
    return res.status(201).json({
      message: "Carrito creado con éxito.",
      cart
    });
  } catch (err) {
    console.error("Error en createCart:", err);
    return res.status(500).json({
      message: "Error al crear el carrito",
      error: err.message
    });
  }
};


export const getCart = async (req, res) => {
  try {
    const userId = req.usuario._id; 
    const cart = await Cart.findOne({ user: userId }).populate("products.product");

    if (!cart) {
      return res.status(404).json({ message: "Carrito no encontrado." });
    }

    return res.status(200).json({
      message: "Carrito obtenido con éxito.",
      cart
    });
  } catch (err) {
    console.error("Error en getCart:", err);
    return res.status(500).json({
      message: "Error al obtener el carrito",
      error: err.message
    });
  }
};


export const addProductToCart = async (req, res) => {
  try {
    const userId = req.usuario._id;
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado." });
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: "Carrito no encontrado." });
    }

    const productIndex = cart.products.findIndex(
      p => p.product.toString() === productId
    );

    if (productIndex > -1) {
      cart.products[productIndex].quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity, price: product.price });
    }
    cart.total = cart.products.reduce(
      (acc, item) => acc + item.quantity * item.price, 0
    );
    await cart.save();

    return res.status(200).json({
      message: "Producto agregado al carrito con éxito.",
      cart
    });
  } catch (err) {
    console.error("Error en addProductToCart:", err);
    return res.status(500).json({
      message: "Error al agregar producto al carrito",
      error: err.message
    });
  }
};

export const updateProductQuantity = async (req, res) => {
  try {
    const userId = req.usuario._id; 
    const { productId, quantity } = req.body;

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: "Carrito no encontrado." });
    }

    const productIndex = cart.products.findIndex(
      p => p.product.toString() === productId
    );
    if (productIndex === -1) {
      return res.status(404).json({ message: "Producto no encontrado en el carrito." });
    }

    cart.products[productIndex].quantity = quantity;
    // Recalcular total
    cart.total = cart.products.reduce(
      (acc, item) => acc + item.quantity * item.price, 0
    );
    await cart.save();

    return res.status(200).json({
      message: "Cantidad de producto actualizada.",
      cart
    });
  } catch (err) {
    console.error("Error en updateProductQuantity:", err);
    return res.status(500).json({
      message: "Error al actualizar la cantidad del producto",
      error: err.message
    });
  }
};

export const removeProductFromCart = async (req, res) => {
  try {
    const userId = req.usuario._id; 
    const { productId } = req.params;

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: "Carrito no encontrado." });
    }

    const productIndex = cart.products.findIndex(
      p => p.product.toString() === productId
    );
    if (productIndex === -1) {
      return res.status(404).json({ message: "Producto no encontrado en el carrito." });
    }

    cart.products.splice(productIndex, 1);
    cart.total = cart.products.reduce(
      (acc, item) => acc + item.quantity * item.price, 0
    );
    await cart.save();

    return res.status(200).json({
      message: "Producto eliminado del carrito.",
      cart
    });
  } catch (err) {
    console.error("Error en removeProductFromCart:", err);
    return res.status(500).json({
      message: "Error al eliminar producto del carrito",
      error: err.message
    });
  }
};

export const clearCart = async (req, res) => {
  try {
    const userId = req.usuario._id;
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: "Carrito no encontrado." });
    }
    cart.products = [];
    cart.total = 0;
    await cart.save();

    return res.status(200).json({
      message: "Carrito vacío con éxito.",
      cart
    });
  } catch (err) {
    console.error("Error en clearCart:", err);
    return res.status(500).json({
      message: "Error al vaciar el carrito",
      error: err.message
    });
  }
};
/**
 * @swagger
 * /cart:
 *   post:
 *     summary: Crear un carrito para el usuario autenticado
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
 *
 * @swagger
 * /cart:
 *   get:
 *     summary: Obtener el carrito del usuario autenticado
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
 *
 * @swagger
 * /cart/add:
 *   post:
 *     summary: Agregar un producto al carrito
 *     tags: [Cart]
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
 *         description: Cantidad de producto actualizada.
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
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto a eliminar.
 *     responses:
 *       200:
 *         description: Producto eliminado del carrito.
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
