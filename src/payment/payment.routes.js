import express from "express";
import { processPayment } from "./payment.controller.js";
import { hasRoles } from "../middlewares/validate-roles.js";
import { validateJWT } from "../middlewares/validate-jwt.js";

const router = express.Router();

router.post("/create", validateJWT, hasRoles("ADMIN", "CLIENT"), processPayment);

export default router;

/**
 * @swagger
 * /payment/create:
 *   post:
 *     summary: Procesar el pago y generar la factura en PDF
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
 *         description: Error en el procesamiento del pago (carrito vacío, stock insuficiente, etc.).
 *       404:
 *         description: Carrito o producto no encontrado.
 *       500:
 *         description: Error interno al procesar el pago.
 */
