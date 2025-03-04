import User from "../user/user.model.js"

export const emailExists = async (email = "") => {
    const existe = await User.findOne({email})
    if(existe){
        throw new Error(`The email ${email} is already registered`)
    }
}

export const blockRole = (value) => {
    if (value) {
      throw new Error("No puedes setear el rol. El rol será asignado automáticamente como 'CLIENT', contacta con un Administrador.");
    }
    return true;
};  

export const usernameExists = async (username = "") => {
    const existe = await User.findOne({username})
    if(existe){
        throw new Error(`The username ${username} is already registered`)
    }
}

export const userExists = async (uid = " ") => {
    const existe = await User.findById(uid)
    if(!existe){
        throw new Error("No existe el usuario con el ID proporcionado")
    }
}

export const userExistsToken = async (value, { req }) => {
    const uidFromToken = req.usuario._id; 
    if (!uidFromToken) {
      throw new Error("ID de usuario no disponible en el token");
    }

    if (value && value !== uidFromToken.toString()) {
      throw new Error("No tiene permisos para actualizar este usuario");
    }

    const user = await User.findById(uidFromToken);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }
    return true;
}

export const blockToken = (value) => {
    if (value) {
      throw new Error("No puedes setear el rol. El rol será asignado automáticamente como 'CLIENT', contacta con un Administrador");
    }
    return true;
}

export const pictureExist = (value, { req }) => {
    if (!req.file) {
        throw new Error('Se requiere un archivo de imagen');
    }
    return true;
}


export const searchProduct = async (_id) => {
  const product = await Product.findById(_id);
  if (!product) {
    throw new Error("El producto no existe.");
  }
  return true;
};