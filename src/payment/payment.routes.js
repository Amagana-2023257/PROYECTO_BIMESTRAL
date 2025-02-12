import express from "express";
import { processPayment } from "./payment.controller.js";
import { hasRoles } from "../middlewares/validate-roles.js";
import { validateJWT } from "../middlewares/validate-jwt.js";

const router = express.Router();

router.post("/create", validateJWT, hasRoles("ADMIN", "CLIENT"), processPayment);

export default router;
