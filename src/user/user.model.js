import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true
    },
    username: {
      type: String,
      required: [true, "El nombre de usuario es obligatorio"],
      unique: true,
      trim: true
    },
    email: {
      type: String,
      required: [true, "El email es obligatorio"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, "Ingrese un email válido"]
    },
    password: {
      type: String,
      required: [true, "La contraseña es obligatoria"]
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
    }
  },
  { timestamps: true } 
);

userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.__v;
  return userObject;
};

const User = mongoose.model("User", userSchema);
export default User;
