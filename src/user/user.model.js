import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            match: [/\S+@\S+\.\S+/, "Please use a valid email address"]
        },
        password: {
            type: String,
            required: true
        },
        profilePicture: {
            type: String,
            default: null
        },
        role: {
            type: String,
            enum: ["ADMIN", "CLIENT"],
            default: "CLIENT"
        },
        status: {
            type: Boolean,
            default: true 
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        }
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;


/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - username
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           description: El nombre completo del usuario.
 *           example: "John Doe"
 *         username:
 *           type: string
 *           description: El nombre de usuario único.
 *           example: "johndoe123"
 *         email:
 *           type: string
 *           format: email
 *           description: El correo electrónico único del usuario.
 *           example: "john.doe@example.com"
 *         password:
 *           type: string
 *           description: La contraseña cifrada del usuario.
 *           example: "$argon2id$v=19$m=65536,t=2,p=1$Y2M...m2kQ"
 *         profilePicture:
 *           type: string
 *           description: URL de la imagen de perfil del usuario (opcional).
 *           example: "profile-picture-url.jpg"
 *         role:
 *           type: string
 *           enum: [ADMIN, CLIENT]
 *           description: El rol del usuario, por defecto es "CLIENT".
 *           example: "CLIENT"
 *         status:
 *           type: boolean
 *           description: El estado del usuario (activo o no).
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación del usuario.
 *           example: "2025-02-12T10:00:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de la última actualización de los datos del usuario.
 *           example: "2025-02-12T10:00:00Z"
 */