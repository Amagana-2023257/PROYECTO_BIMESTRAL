import { Router } from "express";
import { addCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory, activateCategory} from "./category.controller.js"; 
import { addCategoryValidator, getCategoryByIdValidator, updateCategoryValidator, deleteCategoryValidator, activateCategoryValidator} from "../middlewares/validate-category.js";
import { hasRoles } from "../middlewares/validate-roles.js";
import { validateJWT } from "../middlewares/validate-jwt.js";

const router = Router();

// Client 
router.get("/", validateJWT, hasRoles("ADMIN", "CLIENT"), getAllCategories);


// ADMIN
router.post("/addCategory",addCategoryValidator, validateJWT, hasRoles("ADMIN"), addCategory);
router.put( "/updateCategory/:id", validateJWT, hasRoles("ADMIN"), updateCategoryValidator,  updateCategory);
router.get("/getCategoryById/:id", validateJWT, hasRoles("ADMIN"), getCategoryByIdValidator, getCategoryById);
router.delete( "/deleteCategory/:id", validateJWT, hasRoles("ADMIN"),  deleteCategoryValidator,  deleteCategory);
router.patch( "/activateCategory/:id", validateJWT, hasRoles("ADMIN"), activateCategoryValidator,  activateCategory);

export default router;

