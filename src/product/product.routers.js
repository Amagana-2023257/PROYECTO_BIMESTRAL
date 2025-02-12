import { Router } from "express";
import { addProduct, getAllProducts, getProductById, updateProduct, searchProducts, getTopSellingProducts, updateProductStatus } from "./product.controller.js";
import { addProductValidator, updateProductValidator, getProductByIdValidator , searchProductsValidator } from "../middlewares/validate-product.js";
import { validateJWT } from "../middlewares/validate-jwt.js";
import { hasRoles } from "../middlewares/validate-roles.js";
import { uploadProfilePicture } from "../middlewares/multer-uploads.js"

const router = Router();

// Client
router.get("/", validateJWT, hasRoles("ADMIN", "CLIENT"), getAllProducts);
router.get("/search", validateJWT, hasRoles("ADMIN", "CLIENT"), searchProductsValidator, searchProducts);
router.get("/top-selling", validateJWT, hasRoles("ADMIN", "CLIENT"), getTopSellingProducts);
router.get("/search/:id", validateJWT, hasRoles("ADMIN", "CLIENT"), getProductByIdValidator, getProductById);

// ADMIN
router.post("/addProduct", uploadProfilePicture.single("image"), validateJWT, hasRoles("ADMIN"), addProductValidator, addProduct);
router.put("/updateProduct/:id", validateJWT, hasRoles("ADMIN"), updateProductValidator, updateProduct);
router.patch("/deleteProduct/:id", validateJWT, hasRoles("ADMIN"), updateProductStatus);

export default router;
