import Cart from "../cart/cart.model.js";
import Invoice from "../invoice/invoice.model.js";
import Product from "../product/product.model.js";
import PDFDocument from "pdfkit"; 

export const processPayment = async (req, res) => {
  try {
    const userId = req.usuario._id;
    let cart = await Cart.findOne({ user: userId }).populate("products.product");

    if (!cart) {
      return res.status(404).json({ message: "Cart not found." });
    }
    if (cart.products.length === 0) {
      return res.status(400).json({ message: "Cart is empty. Cannot process payment." });
    }

    const productDetails = await Promise.all(
      cart.products.map(async (item) => {
        const product = await Product.findById(item.product);
        if (!product) {
          return res.status(404).json({ message: `Product with ID ${item.product} not found.` });
        }
        if (product.stock < item.quantity) {
          return res.status(400).json({ message: `Product ${product.name} does not have enough stock.` });
        }
        return {
          product: product._id,
          quantity: item.quantity,
          price: product.price,
        };
      })
    );

    const total = productDetails.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const newInvoice = new Invoice({
      user: userId,
      products: productDetails,
      total,
      status: "PAID",
    });
    await newInvoice.save();

    for (const item of productDetails) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    cart.products = [];
    cart.total = 0;
    await cart.save();

    const doc = new PDFDocument({ margin: 50 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=invoice_${newInvoice._id}.pdf`);
    doc.pipe(res);

    doc.fontSize(20).text("FACTURA", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Factura ID: ${newInvoice._id}`);
    doc.text(`Fecha: ${newInvoice.createdAt.toLocaleString()}`);
    doc.text(`Usuario ID: ${userId}`);
    doc.moveDown();

    doc.fontSize(14).text("Productos", { underline: true });
    doc.moveDown();
    newInvoice.products.forEach((item, index) => {
      const lineTotal = (item.price * item.quantity).toFixed(2);
      doc.fontSize(12).text(
        `${index + 1}. Producto ID: ${item.product} | Cantidad: ${item.quantity} | Precio unitario: $${item.price} | Total: $${lineTotal}`
      );
      doc.moveDown(0.5);
    });

    doc.moveDown();
    doc.fontSize(14).text(`Total: $${newInvoice.total.toFixed(2)}`, { align: "right" });

    doc.moveDown(2);
    doc.fontSize(10).text("Gracias por su compra.", { align: "center" });

    doc.end();
    
  } catch (err) {
    console.error("Error processing payment:", err);
    return res.status(500).json({
      message: "Error processing payment.",
      error: err.message,
    });
  }
};


/**
 * @swagger
 * /payment/process:
 *   post:
 *     summary: Procesar el pago y generar una factura en PDF
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Pago procesado con éxito y factura generada en formato PDF.
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Error en el procesamiento del pago (por ejemplo, carrito vacío o stock insuficiente).
 *       404:
 *         description: Carrito o producto no encontrado.
 *       500:
 *         description: Error interno al procesar el pago.
 */
