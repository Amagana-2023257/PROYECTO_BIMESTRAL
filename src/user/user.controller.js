import User from "../user/user.model.js";
import { isValidObjectId } from "mongoose";
import argon2 from "argon2";
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url'; 
import { dirname } from 'path'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


export const addUser = async (req, res) => {
    try {
        const data = req.body;
        let profilePicture = req.file ? req.file.filename : null;
        const encryptedPassword = await argon2.hash(data.password);
        data.password = encryptedPassword;
        data.profilePicture = profilePicture;
        
        data.role = "ADMIN"; 

        const user = await User.create(data);

        return res.status(201).json({
            message: "User has been created",
            name: user.name,
            email: user.email
        });
    } catch (err) {
        return res.status(500).json({
            message: "User registration failed",
            error: err.message
        });
    }
}

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        return res.status(200).json({
            message: "Usuarios obtenidos con éxito.",
            users,
        });
    } catch (err) {
        return res.status(500).json({
            message: "Error al obtener los usuarios.",
            error: err.message,
        });
    }
};

export const getUserDetails = async (req, res) => {

    const { id } = req.params;

    try {
        if (!isValidObjectId(id)) {
            return res.status(400).json({
                message: "ID de usuario no válido.",
            });
        }

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                message: "Usuario no encontrado.",
            });
        }

        return res.status(200).json({
            message: "Detalles del usuario.",
            user: {
                name: user.name,
                email: user.email,
                role: user.role,
                profilePicture: user.profilePicture,
                status: user.status,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
        });
    } catch (err) {
        return res.status(500).json({
            message: "Error al obtener los detalles del usuario.",
            error: err.message,
        });
    }
};


export const updateUserDetails = async (req, res) => {
    try {
        const { name, username, email, password } = req.body;
        const userIdFromToken = req.usuario._id; 

        let profilePicture = req.file ? req.file.filename : null;

        if (!isValidObjectId(userIdFromToken)) {
            return res.status(400).json({
                message: "ID de usuario no válido.",
            });
        }

        const user = await User.findById(userIdFromToken);
        if (!user) {
            return res.status(404).json({
                message: "Usuario no encontrado.",
            });
        }

        const updatedFields = {};

        if (name) updatedFields.name = name;
        if (username) updatedFields.username = username; 
        if (email) updatedFields.email = email;
        if (profilePicture) updatedFields.profilePicture = profilePicture; 

        if (password) {
            const encryptedPassword = await argon2.hash(password); 
            updatedFields.password = encryptedPassword;
        }

        const updatedUser = await User.findByIdAndUpdate(userIdFromToken, updatedFields, { new: true });

        return res.status(200).json({
            message: "Usuario actualizado exitosamente.",
            user: {
                name: updatedUser.name,
                username: updatedUser.username,
                email: updatedUser.email,
                profilePicture: updatedUser.profilePicture,
            },
        });
    } catch (err) {
        return res.status(500).json({
            message: "Error al actualizar el usuario.",
            error: err.message,
        });
    }
};





export const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        if (!isValidObjectId(id)) {
            return res.status(400).json({
                message: "ID de usuario no válido.",
            });
        }

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                message: "Usuario no encontrado.",
            });
        }

        if (req.usuario.role !== "ADMIN") {
            return res.status(403).json({
                message: "No tiene permisos para cambiar el estado de este usuario.",
            });
        }

        user.status = false;
        user.updatedAt = new Date(); 

        await user.save();

        return res.status(200).json({
            message: "Usuario desactivado exitosamente.",
            user: {
                name: user.name,
                username: user.username,
                email: user.email,
                status: user.status
            },
        });
    } catch (err) {
        return res.status(500).json({
            message: "Error al desactivar el usuario.",
            error: err.message,
        });
    }
};

export const updateUserRole = async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    try {
        if (!isValidObjectId(id)) {
            return res.status(400).json({
                message: "ID de usuario no válido.",
            });
        }

        if (!role || !["ADMIN", "CLIENT"].includes(role)) {
            return res.status(400).json({
                message: "El rol debe ser 'ADMIN' o 'CLIENT'.",
            });
        }

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                message: "Usuario no encontrado.",
            });
        }

        if (req.usuario.role !== "ADMIN") {
            return res.status(403).json({
                message: "No tiene permisos para cambiar el rol de este usuario.",
            });
        }

        user.role = role;
        await user.save();

        return res.status(200).json({
            message: "Rol de usuario actualizado exitosamente.",
            user: {
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        return res.status(500).json({
            message: "Error al actualizar el rol del usuario.",
            error: err.message,
        });
    }
};


export const deleteUserByToken = async (req, res) => {
    const userIdFromToken = req.usuario._id; 

    try {
        const user = await User.findById(userIdFromToken);

        if (!user) {
            return res.status(404).json({
                message: "Usuario no encontrado.",
            });
        }

        user.status = false;
        user.updatedAt = new Date(); 

        await user.save();

        return res.status(200).json({
            message: "Te as eliminado exitosamente.",
        });
    } catch (err) {
        return res.status(500).json({
            message: "Error al eliminar el usuario.",
            error: err.message,
        });
    }
};


export const updateUserDetailsById = async (req, res) => {
    const { id } = req.params; 
    const { name, username, email, password } = req.body;

    try {
        if (!isValidObjectId(id)) {
            return res.status(400).json({
                message: "ID de usuario no válido.",
            });
        }
        
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                message: "Usuario no encontrado.",
            });
        }

        if (req.usuario.role !== "ADMIN" && req.usuario._id !== user.id) {
            return res.status(403).json({
                message: "No tiene permisos para modificar este usuario.",
            });
        }

        const updatedFields = {};
        
        if (name) updatedFields.name = name;
        if (username) updatedFields.username = username;
        if (email) updatedFields.email = email;
        if (profilePicture) updatedFields.profilePicture = profilePicture;
        if (password) {
            updatedFields.password = await argon2.hash(password);
        }

        if (req.body.role) {
            return res.status(400).json({
                message: "No se puede modificar el rol del usuario.",
            });
        }

        Object.assign(user, updatedFields);

        user.updatedAt = new Date();
        await user.save(); 

        return res.status(200).json({
            message: "Usuario actualizado exitosamente.",
            user: {
                name: user.name,
                username: user.username,
                email: user.email,
                profilePicture: user.profilePicture,
            },
        });
    } catch (err) {
        return res.status(500).json({
            message: "Error al actualizar el usuario.",
            error: err.message,
        });
    }
};


export const updatePhotoById = async (req, res) => {
    try {
        const { uid } = req.params; 
        let newProfilePicture = req.file ? req.file.filename : null; 

        if (!newProfilePicture) {
            return res.status(400).json({
                success: false,
                message: "No se proporcionó una nueva foto."
            });
        }

        const user = await User.findById(uid);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado."
            });
        }

        if (req.usuario.role !== "ADMIN") {
            return res.status(403).json({
                success: false,
                message: "No tiene permisos para modificar este usuario."
            });
        }

        if (user.profilePicture) {
            const oldPhotoPath = path.join(__dirname, 'uploads', user.profilePicture);
            fs.unlink(oldPhotoPath, (err) => {
                if (err) {
                    console.error('Error al eliminar la foto antigua:', err);
                }
            });
        }

        user.profilePicture = newProfilePicture;
        user.updatedAt = new Date();
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Foto de perfil actualizada correctamente.",
            user: {
                name: user.name,
                email: user.email,
                profilePicture: user.profilePicture,
            }
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al actualizar la foto del usuario.",
            error: err.message
        });
    }
};

export const updatePhoto = async (req, res) => {
    try {
        const userIdFromToken = req.usuario._id;
        let newProfilePicture = req.file ? req.file.filename : null; 

        if (!newProfilePicture) {
            return res.status(400).json({
                success: false,
                message: "No se proporcionó una nueva foto."
            });
        }

        const user = await User.findById(userIdFromToken);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado."
            });
        }

        if (user.profilePicture) {
            const oldPhotoPath = path.join(__dirname, 'uploads', user.profilePicture);
            fs.unlink(oldPhotoPath, (err) => {
                if (err) {
                    console.error('Error al eliminar la foto antigua:', err);
                }
            });
        }

        user.profilePicture = newProfilePicture;
        user.updatedAt = new Date();
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Foto de perfil actualizada correctamente.",
            user: {
                name: user.name,
                email: user.email,
                profilePicture: user.profilePicture,
            }
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al actualizar la foto del usuario.",
            error: err.message
        });
    }
};


/**
 * @swagger
 * tags:
 *   name: user
 *   description: Endpoint para la gestión de usuarios.
 */

/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Registra un nuevo usuario como ADMIN
 *     description: Crea un nuevo usuario con nombre, correo electrónico, contraseña cifrada y foto de perfil opcional.
 *     tags: [user]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre completo del usuario.
 *               username:
 *                 type: string
 *                 description: Nombre de usuario.
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Correo electrónico del usuario.
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario.
 *               profilePicture:
 *                 type: string
 *                 description: Foto de perfil opcional.
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User has been created"
 *                 name:
 *                   type: string
 *                   example: "John Doe"
 *                 email:
 *                   type: string
 *                   example: "john.doe@example.com"
 *       500:
 *         description: Error al crear el usuario.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User registration failed"
 *                 error:
 *                   type: string
 *                   example: "Error details"
 */

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Obtiene todos los usuarios registrados
 *     description: Devuelve una lista de todos los usuarios registrados en el sistema.
 *     tags: [user]
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuarios obtenidos con éxito."
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: "John Doe"
 *                       email:
 *                         type: string
 *                         example: "john.doe@example.com"
 *       500:
 *         description: Error al obtener los usuarios.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error al obtener los usuarios."
 *                 error:
 *                   type: string
 *                   example: "Error details"
 */

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Obtiene los detalles de un usuario específico
 *     description: Devuelve los detalles del usuario según su ID.
 *     tags: [user]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalles del usuario obtenidos exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Detalles del usuario."
 *                 user:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "John Doe"
 *                     email:
 *                       type: string
 *                       example: "john.doe@example.com"
 *                     role:
 *                       type: string
 *                       example: "ADMIN"
 *                     profilePicture:
 *                       type: string
 *                       example: "profile.jpg"
 *       400:
 *         description: ID no válido.
 *       404:
 *         description: Usuario no encontrado.
 *       500:
 *         description: Error al obtener los detalles del usuario.
 */

/**
 * @swagger
 * /user/{id}:
 *   put:
 *     summary: Actualiza los detalles de un usuario específico
 *     description: Permite actualizar el nombre, correo electrónico, nombre de usuario, contraseña y foto de perfil de un usuario específico.
 *     tags: [user]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario a actualizar.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del usuario.
 *               username:
 *                 type: string
 *                 description: Nombre de usuario.
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Correo electrónico del usuario.
 *               password:
 *                 type: string
 *                 description: Nueva contraseña del usuario.
 *               profilePicture:
 *                 type: string
 *                 description: Nueva foto de perfil.
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuario actualizado exitosamente."
 *                 user:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "John Doe"
 *                     email:
 *                       type: string
 *                       example: "john.doe@example.com"
 *       400:
 *         description: ID no válido o datos inválidos.
 *       404:
 *         description: Usuario no encontrado.
 *       500:
 *         description: Error al actualizar el usuario.
 */

/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     summary: Elimina un usuario específico
 *     description: Elimina a un usuario dado su ID.
 *     tags: [user]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario a eliminar.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario desactivado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuario desactivado exitosamente."
 *       400:
 *         description: ID no válido.
 *       404:
 *         description: Usuario no encontrado.
 *       500:
 *         description: Error al eliminar el usuario.
 */

/**
 * @swagger
 * /user/{id}/role:
 *   put:
 *     summary: Actualiza el rol de un usuario específico
 *     description: Cambia el rol de un usuario a 'ADMIN' o 'CLIENT'.
 *     tags: [user]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario cuyo rol se va a actualizar.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 enum: ["ADMIN", "CLIENT"]
 *                 description: Rol a asignar al usuario.
 *     responses:
 *       200:
 *         description: Rol de usuario actualizado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Rol de usuario actualizado exitosamente."
 *                 user:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "John Doe"
 *                     email:
 *                       type: string
 *                       example: "john.doe@example.com"
 *                     role:
 *                       type: string
 *                       example: "ADMIN"
 *       400:
 *         description: Rol inválido.
 *       404:
 *         description: Usuario no encontrado.
 *       403:
 *         description: No tiene permisos para cambiar el rol de este usuario.
 *       500:
 *         description: Error al actualizar el rol.
 */

/**
 * @swagger
 * /user/photo/{id}:
 *   put:
 *     summary: Actualiza la foto de perfil de un usuario
 *     description: Permite actualizar la foto de perfil de un usuario.
 *     tags: [user]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario a actualizar.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *                 description: Nueva foto de perfil.
 *     responses:
 *       200:
 *         description: Foto de perfil actualizada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Foto de perfil actualizada correctamente."
 *                 user:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "John Doe"
 *                     email:
 *                       type: string
 *                       example: "john.doe@example.com"
 *                     profilePicture:
 *                       type: string
 *                       example: "newProfile.jpg"
 *       400:
 *         description: No se proporcionó una nueva foto.
 *       404:
 *         description: Usuario no encontrado.
 *       500:
 *         description: Error al actualizar la foto del usuario.
 */
