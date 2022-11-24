const express = require('express')
require('dotenv').config()
const { dbConnection } = require('./database/config')

// Crear el servidor express
const app = express()

// Base de datos
dbConnection()

// Directorio público
app.use( express.static('public') )

// Lectura y parseo del body
app.use(express.json())

// Rutas
app.use('/api/auth', require('./routes/auth'))

// Escuchar las peticiones
const port = process.env.PORT
app.listen(port, () => {
    console.log(`Servidor corriendo en puerto ${ port }`)
})