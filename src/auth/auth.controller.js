import { hash, verify } from "argon2";
import User from "../user/user.model.js";
import { generateJWT } from "../helpers/generate-jwt.js";

/**
 * Registra un usuario asignándole el rol de CLIENT.
 * Se cifra la contraseña y se guarda opcionalmente la foto de perfil.
 */
export const register = async (req, res) => {
  try {
    const { name, email, username, password } = req.body;
    const profilePicture = req.file ? req.file.filename : null;

    const encryptedPassword = await hash(password);

    const userData = {
      name,
      email,
      username,
      password: encryptedPassword,
      profilePicture,
      role: "CLIENT",
    };

    const user = await User.create(userData);

    return res.status(201).json({
      message: "Usuario creado exitosamente.",
      user: { name: user.name, email: user.email, username: user.username },
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error en el registro del usuario.",
      error: err.message,
    });
  }
};

/**
 * Inicia sesión buscando por email o username, verificando la contraseña y generando un token JWT.
 */
export const login = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    const user = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (!user) {
      return res.status(400).json({
        message: "Credenciales inválidas: usuario o correo no encontrado.",
      });
    }

    const validPassword = await verify(user.password, password);
    if (!validPassword) {
      return res.status(400).json({
        message: "Credenciales inválidas: contraseña incorrecta.",
      });
    }

    const token = await generateJWT(user.id);
    return res.status(200).json({
      message: "Inicio de sesión exitoso.",
      userDetails: {
        token,
        profilePicture: user.profilePicture,
        role: user.role,
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error en el inicio de sesión.",
      error: err.message,
    });
  }
};
