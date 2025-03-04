import User from "../user/user.model.js";
import { isValidObjectId } from "mongoose";
import argon2 from "argon2";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Función auxiliar para validar ObjectId.
 */
const validateObjectId = (id) => isValidObjectId(id);

/**
 * Crea un usuario ADMIN.
 * Solo se usa desde rutas protegidas para agregar administradores.
 */
export const addUser = async (req, res) => {
  try {
    const { name, email, username, password } = req.body;
    const profilePicture = req.file ? req.file.filename : null;
    const encryptedPassword = await argon2.hash(password);

    const userData = {
      name,
      email,
      username,
      password: encryptedPassword,
      profilePicture,
      role: "ADMIN",
    };

    const user = await User.create(userData);

    return res.status(201).json({
      message: "Usuario (ADMIN) creado exitosamente.",
      user: { name: user.name, email: user.email, username: user.username },
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error en la creación del usuario.",
      error: err.message,
    });
  }
};

/**
 * Obtiene la lista de todos los usuarios.
 */
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

/**
 * Obtiene los detalles de un usuario específico por su ID.
 */
export const getUserDetails = async (req, res) => {
  const { id } = req.params;
  if (!validateObjectId(id)) {
    return res.status(400).json({ message: "ID de usuario no válido." });
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }
    return res.status(200).json({
      message: "Detalles del usuario obtenidos exitosamente.",
      user: {
        name: user.name,
        email: user.email,
        username: user.username,
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

/**
 * Permite a un usuario autenticado actualizar sus propios datos de perfil.
 */
export const updateUserDetails = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    const userId = req.usuario._id; 
    const profilePicture = req.file ? req.file.filename : null;

    if (!validateObjectId(userId)) {
      return res.status(400).json({ message: "ID de usuario no válido." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    const updatedFields = {};
    if (name) updatedFields.name = name;
    if (username) updatedFields.username = username;
    if (email) updatedFields.email = email;
    if (profilePicture) updatedFields.profilePicture = profilePicture;
    if (password) {
      updatedFields.password = await argon2.hash(password);
    }
    updatedFields.updatedAt = new Date();

    const updatedUser = await User.findByIdAndUpdate(userId, updatedFields, { new: true });

    return res.status(200).json({
      message: "Perfil de usuario actualizado exitosamente.",
      user: {
        name: updatedUser.name,
        username: updatedUser.username,
        email: updatedUser.email,
        profilePicture: updatedUser.profilePicture,
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error al actualizar el perfil del usuario.",
      error: err.message,
    });
  }
};

/**
 * Permite a un administrador actualizar la información de cualquier usuario (sin modificar el rol).
 */
export const updateUserDetailsById = async (req, res) => {
  const { id } = req.params;
  const { name, username, email, password } = req.body;

  if (!validateObjectId(id)) {
    return res.status(400).json({ message: "ID de usuario no válido." });
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    if (req.body.role) {
      return res.status(400).json({ message: "No se puede modificar el rol del usuario." });
    }

    const updatedFields = {};
    if (name) updatedFields.name = name;
    if (username) updatedFields.username = username;
    if (email) updatedFields.email = email;
    if (password) {
      updatedFields.password = await argon2.hash(password);
    }
    updatedFields.updatedAt = new Date();

    Object.assign(user, updatedFields);
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

/**
 * Desactiva (elimina) un usuario. Solo un ADMIN puede desactivar a otro usuario.
 */
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  if (!validateObjectId(id)) {
    return res.status(400).json({ message: "ID de usuario no válido." });
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    if (req.usuario.role !== "ADMIN") {
      return res.status(403).json({
        message: "No tiene permisos para desactivar este usuario.",
      });
    }

    user.status = false;
    user.updatedAt = new Date();
    await user.save();

    return res.status(200).json({
      message: "Usuario desactivado exitosamente.",
      user: { name: user.name, username: user.username, email: user.email, status: user.status },
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error al desactivar el usuario.",
      error: err.message,
    });
  }
};

/**
 * Permite a un usuario eliminar su propia cuenta.
 */
export const deleteUserByToken = async (req, res) => {
  const userId = req.usuario._id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    user.status = false;
    user.updatedAt = new Date();
    await user.save();

    return res.status(200).json({ message: "Cuenta eliminada exitosamente." });
  } catch (err) {
    return res.status(500).json({
      message: "Error al eliminar la cuenta del usuario.",
      error: err.message,
    });
  }
};

/**
 * Actualiza la foto de perfil de un usuario (autoadministrado).
 * Se elimina la foto antigua (si existe) de forma asíncrona.
 */
export const updatePhoto = async (req, res) => {
  try {
    const userId = req.usuario._id;
    const newProfilePicture = req.file ? req.file.filename : null;

    if (!newProfilePicture) {
      return res.status(400).json({
        message: "No se proporcionó una nueva foto.",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    if (user.profilePicture) {
      const oldPhotoPath = path.join(__dirname, "uploads", user.profilePicture);
      fs.unlink(oldPhotoPath, (err) => {
        if (err) console.error("Error al eliminar la foto antigua:", err);
      });
    }

    user.profilePicture = newProfilePicture;
    user.updatedAt = new Date();
    await user.save();

    return res.status(200).json({
      message: "Foto de perfil actualizada correctamente.",
      user: {
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error al actualizar la foto del usuario.",
      error: err.message,
    });
  }
};

/**
 * Actualiza la foto de perfil de un usuario desde una ruta administrativa (por ID).
 */
export const updatePhotoById = async (req, res) => {
  const { uid } = req.params;
  const newProfilePicture = req.file ? req.file.filename : null;

  if (!newProfilePicture) {
    return res.status(400).json({
      message: "No se proporcionó una nueva foto.",
    });
  }

  try {
    const user = await User.findById(uid);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    if (req.usuario.role !== "ADMIN") {
      return res.status(403).json({
        message: "No tiene permisos para modificar este usuario.",
      });
    }

    if (user.profilePicture) {
      const oldPhotoPath = path.join(__dirname, "uploads", user.profilePicture);
      fs.unlink(oldPhotoPath, (err) => {
        if (err) console.error("Error al eliminar la foto antigua:", err);
      });
    }

    user.profilePicture = newProfilePicture;
    user.updatedAt = new Date();
    await user.save();

    return res.status(200).json({
      message: "Foto de perfil actualizada correctamente.",
      user: {
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error al actualizar la foto del usuario.",
      error: err.message,
    });
  }
};

/**
 * Actualiza el rol de un usuario. Solo un ADMIN puede hacerlo.
 */
export const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!validateObjectId(id)) {
    return res.status(400).json({ message: "ID de usuario no válido." });
  }

  if (!role || !["ADMIN", "CLIENT"].includes(role)) {
    return res.status(400).json({ message: "El rol debe ser 'ADMIN' o 'CLIENT'." });
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    // Verificar permisos: Solo ADMIN puede cambiar el rol
    if (req.usuario.role !== "ADMIN") {
      return res.status(403).json({ message: "No tiene permisos para cambiar el rol de este usuario." });
    }

    user.role = role;
    user.updatedAt = new Date();
    await user.save();

    return res.status(200).json({
      message: "Rol de usuario actualizado exitosamente.",
      user: { name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error al actualizar el rol del usuario.",
      error: err.message,
    });
  }
};
