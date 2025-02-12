# PROYECTO_BIMESTRAL

# API de Gestión de Ventas

Este proyecto es una **API REST** creada con **Express** y **MongoDB** para gestionar operaciones de ventas. Está configurada con herramientas adicionales para mejorar la seguridad, el rendimiento y la documentación de la API.

## Requisitos

Antes de comenzar, asegúrate de tener instalado:

- [Node.js](https://nodejs.org) (versión 14 o superior)
- [MongoDB](https://www.mongodb.com) (debería estar en ejecución localmente o utilizar una URI de MongoDB Atlas)

## Instalación

Sigue los siguientes pasos para configurar y ejecutar el proyecto localmente:

### 1. Clonar el repositorio

```bash
git clone https://github.com/Amagana-2023257/PROYECTO_BIMESTRAL.git


### 3. Instalar dependencias

```bash
npm install


### 4.  Configuración de variables de entorno

```bash
PORT=3000
MONGO_URI=mongodb://localhost:27017/ventas-2023257
JWT_SECRET=test


### 5. Ejecutar el proyecto

```bash
npm run dev


### 6. Estructura del Proyecto

```bash
├── configs/
│   ├── mongo.js         # Configuración de la base de datos MongoDB
│   └── swagger.js       # Documentación Swagger para la API
├── index.js             # Punto de entrada principal del servidor
├── package.json         # Dependencias y scripts del proyecto
├── src/
│   └── middlewares/
│       └── rate-limit-validator.js # Middleware de validación de límites de solicitudes
└── .env                 # Variables de entorno


### Descripción del Código
1. Express Setup (index.js)
En el archivo index.js, se realiza la configuración principal del servidor Express:

middlewares(app): Aquí se agregan los middlewares utilizados en la aplicación, incluyendo:

Express: Para parsear el cuerpo de las solicitudes HTTP (express.urlencoded y express.json).
CORS: Para permitir solicitudes desde diferentes orígenes.
Helmet: Para mejorar la seguridad de la aplicación.
Morgan: Para registrar las solicitudes HTTP.
apiLimiter: Middleware personalizado para limitar el número de solicitudes a la API y evitar abusos.
routes(app): Aquí se configura la ruta para la documentación de la API usando Swagger. La documentación de la API estará disponible en la ruta /api-docs.

conectarDB(): Esta función se encarga de conectar la aplicación a la base de datos MongoDB usando Mongoose. Se manejan varios eventos para monitorizar el estado de la conexión.

###  2. Conexión a MongoDB (mongo.js)

En este archivo, se configura la conexión a la base de datos MongoDB utilizando Mongoose. Se establecen varios eventos para manejar los estados de la conexión:

on("connecting"): Cuando la conexión está en proceso.
on("connected"): Cuando se ha establecido la conexión.
on("disconnected"): Cuando se pierde la conexión.
on("reconnected"): Cuando se vuelve a conectar después de una desconexión.
on("error"): En caso de error en la conexión.
3. Documentación Swagger (swagger.js)
La documentación de la API está generada con Swagger y es accesible en http://localhost:3000/api-docs. En este archivo, se configura la documentación utilizando el paquete swagger-jsdoc y swagger-ui-express.

### 4. Dependencias del Proyecto

Las dependencias principales de este proyecto están listadas en el archivo package.json:

express: Framework web para Node.js.
mongoose: ORM para MongoDB.
cors: Middleware para permitir solicitudes CORS.
helmet: Middleware para mejorar la seguridad.
morgan: Middleware para registrar las solicitudes HTTP.
express-rate-limit: Middleware para limitar las solicitudes.
dotenv: Cargar variables de entorno desde un archivo .env.
swagger-ui-express: Mostrar la documentación de la API usando Swagger.
swagger-jsdoc: Generar documentación Swagger desde comentarios en el código.
5. Scripts de Node.js
En el archivo package.json, se incluyen los siguientes scripts para facilitar la ejecución del proyecto:

start: Inicia el servidor de producción.
dev: Inicia el servidor en modo de desarrollo con --watch, lo que permite la recarga automática al realizar cambios en los archivos.
Contribuciones
Si deseas contribuir a este proyecto, por favor sigue los siguientes pasos:


Licencia
Este proyecto está bajo la licencia ISC. Consulta el archivo LICENSE para más detalles.