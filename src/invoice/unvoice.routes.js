import { Router } from "express";
import { validateJWT } from "../middlewares/validate-jwt.js";
import { hasRoles } from "../middlewares/validate-roles.js";
import { createInvoice, getAllInvoices, getInvoicesByUser, updateInvoice, cancelInvoice } from "./invoice.controller.js";

const router = Router();

// Crear una factura (solo cliente)
router.post("/create", validateJWT, createInvoice);

// Obtener todas las facturas (solo administrador)
router.get("/", validateJWT, hasRoles("ADMIN"), getAllInvoices);

// Obtener facturas por usuario (solo cliente)
router.get("/user", validateJWT, getInvoicesByUser);

// Actualizar una factura (solo administrador)
router.put("/update", validateJWT, hasRoles("ADMIN"), updateInvoice);

// Eliminar una factura (solo administrador)
router.delete("/delete/:invoiceId", validateJWT, hasRoles("ADMIN"), cancelInvoice);

export default router;


/**
 * @swagger
 * /invoice/create:
 *   post:
 *     summary: Crear una factura (solo cliente)
 *     tags: [Invoice]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Factura creada con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Invoice'
 *       400:
 *         description: Error en la creación de la factura.
 *       500:
 *         description: Error interno.
 *
 * @swagger
 * /invoice/:
 *   get:
 *     summary: Obtener todas las facturas (solo administrador)
 *     tags: [Invoice]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Facturas obtenidas con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Invoice'
 *       500:
 *         description: Error interno.
 *
 * @swagger
 * /invoice/user:
 *   get:
 *     summary: Obtener facturas por usuario (solo cliente)
 *     tags: [Invoice]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Facturas del usuario obtenidas con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Invoice'
 *       500:
 *         description: Error interno.
 *
 * @swagger
 * /invoice/update:
 *   put:
 *     summary: Actualizar una factura (solo administrador)
 *     tags: [Invoice]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Datos de la factura para actualizar.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Invoice'
 *     responses:
 *       200:
 *         description: Factura actualizada con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Invoice'
 *       400:
 *         description: Error en la actualización de la factura.
 *       500:
 *         description: Error interno.
 *
 * @swagger
 * /invoice/delete/{invoiceId}:
 *   delete:
 *     summary: Cancelar una factura (solo administrador)
 *     tags: [Invoice]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: invoiceId
 *         required: true
 *         description: ID de la factura a cancelar.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Factura cancelada con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Invoice'
 *       400:
 *         description: Error en la cancelación de la factura.
 *       500:
 *         description: Error interno.
 */
