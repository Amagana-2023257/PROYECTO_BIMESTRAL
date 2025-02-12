import { Router } from "express";
import {getAllUsers,getUserDetails,updateUserDetails,deleteUser,updateUserRole, deleteUserByToken, updateUserDetailsById, updatePhotoById, updatePhoto, addUser} from "./user.controller.js";
import {getUserByIdValidator,updateUserValidator,deleteUserValidator, updateUserRoleValidator, deleteUserByTokenValidator, updateUserDetailsByIdValidator, updatePhotoByIdValidator, UpdatePhotoValidator, addUserValidator} from "../middlewares/user-validators.js";
import { hasRoles } from "../middlewares/validate-roles.js";
import { validateJWT } from "../middlewares/validate-jwt.js";
import { uploadProfilePicture } from "../middlewares/multer-uploads.js"


const router = Router();

// CLIENT

router.put("/update", validateJWT, hasRoles("ADMIN", "CLIENT"), updateUserValidator, updateUserDetails);
router.delete("/delete", validateJWT, hasRoles("ADMIN", "CLIENT"), deleteUserByTokenValidator,  deleteUserByToken);
router.patch("/updatePhoto",uploadProfilePicture.single("profilePicture"), validateJWT, hasRoles("ADMIN", "CLIENT"), UpdatePhotoValidator, updatePhoto)

//Admin 
router.post("/addUser",uploadProfilePicture.single("profilePicture") ,validateJWT, hasRoles("ADMIN"), addUserValidator, addUser)
router.get("/", validateJWT, hasRoles("ADMIN"), getAllUsers); 
router.get("/:id", validateJWT, hasRoles("ADMIN"), getUserByIdValidator, getUserDetails);
router.delete("/deleteUser/:id", validateJWT, hasRoles("ADMIN"), deleteUserValidator,  deleteUser);
router.patch("/updateRole/:id", validateJWT, hasRoles("ADMIN"), updateUserRoleValidator, updateUserRole);
router.put("/updateUser/:id", validateJWT, hasRoles("ADMIN"), updateUserDetailsByIdValidator, updateUserDetailsById);
router.patch("/updatePhoto/:uid",uploadProfilePicture.single("profilePicture"),  updatePhotoByIdValidator,validateJWT, hasRoles("ADMIN"), updatePhotoById)

export default router;
