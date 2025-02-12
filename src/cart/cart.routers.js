import { Router } from "express";
import { validateJWT } from "../middlewares/validate-jwt.js";
import {createCart,getCart,addProductToCart,updateProductQuantity,removeProductFromCart,clearCart} from "./cart.controller.js";
import {createCartValidator,getCartValidator,addProductToCartValidator,updateProductQuantityValidator,removeProductFromCartValidator,clearCartValidator} from "../middlewares/validate-cart.js";
import { hasRoles } from "../middlewares/validate-roles.js";

const router = Router();


router.post("/createCart",validateJWT, hasRoles("ADMIN", "CLIENT"),createCartValidator,createCart);

router.get("/",validateJWT,hasRoles("ADMIN", "CLIENT") , getCartValidator,getCart);

router.post("/add",validateJWT,hasRoles("ADMIN", "CLIENT"),addProductToCartValidator,addProductToCart);

router.put("/update",validateJWT,hasRoles("ADMIN", "CLIENT"),updateProductQuantityValidator,updateProductQuantity);

router.delete("/remove/:productId",validateJWT, hasRoles("ADMIN", "CLIENT"),removeProductFromCartValidator,removeProductFromCart);

router.delete("/clear",validateJWT,hasRoles("ADMIN", "CLIENT"),clearCartValidator,clearCart);

export default router;
