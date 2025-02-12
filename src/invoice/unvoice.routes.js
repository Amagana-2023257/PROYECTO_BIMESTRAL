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
