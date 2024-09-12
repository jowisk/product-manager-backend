import express from 'express'
import colors from 'colors'
import cors, { CorsOptions } from 'cors'
import morgan from 'morgan'
import swaggerUi from 'swagger-ui-express'
import swaggerSpec from './config/swagger'
import router from './router'
import db from './config/db'

export async function connectDB() {
    try {
        await db.authenticate()
        db.sync()
        // console.log(colors.blue('conexion exitosa a la BD'))
    } catch (err) {
        console.log(colors.red('Error al conectar a la DB'))
    }
}

connectDB()

const server = express()

const corsOptions : CorsOptions = {
    origin: function(origin, callback) {
        if(origin === process.env.FRONTEND_URL) {
            callback(null, true)
        } else {
            callback(new Error('Error de CORS'))
        }
    }
}
server.use(cors(corsOptions))

server.use(express.json())

server.use(morgan('dev'))

server.use('/api/products', router)

server.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

export default server