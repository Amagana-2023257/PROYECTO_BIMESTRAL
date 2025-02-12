import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express"

const swaggerOptions = {
    swaggerDefinition:{
        openapi: "3.0.0",
        info:{
            title: "Ventas System API",
            version:"1.0.0",
            description: "API para sistema de ventas",
            contact:{
                name: "Angel Magaña",
                email: "amagana-2023257@kinal.edu.gt"
            }
        },
        servers:[
            {
                url: "http://127.0.0.1:3000/ventas/v1"
            }
        ]
    },
    apis:[
        "./src/auth/*.js",
        "./src/user/*.js",
        "./src/category/*.js",
        "./src/product/*.js",
        "./src/cart/*.js",
        "./src/invoice/*.js",
        "./src/payment/*.js"
    ]
}

const swaggerDocs = swaggerJSDoc(swaggerOptions)

export { swaggerDocs, swaggerUi }