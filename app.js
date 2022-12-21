const express = require('express')
const mongoose =require('./db/db')
const app = express()
const helmet = require('helmet')
const morgan = require('morgan')
const userRoutes = require('./routes/user')
const sauceRoutes = require('./routes/sauce.js')
const cors = require('cors')
const path = require('path');//maiddlerwar
require('dotenv').config({path: process.cwd() + '/.env'})

app
.use(morgan("dev"))
.use(cors())
.use(express.json())
.use(helmet())

app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});
// Définition des paramètres du limiteur de requête

/*const limiter =  rateLimit({
  windowMs: 15 * 60 * 1000,       // = 15 minutes
  max: 100 // Chaque IP est limitée à 100 requêtes toutes les 15min
})*/


//app.use("/api/auth", la suite dans le dossier routes)
app.use("/images", express.static(path.join(__dirname,"images")))
app.use("/api/auth",userRoutes)
app.use("/api/sauces",sauceRoutes)




//exponrtation de app
module.exports = app