// on a besion de:

const express = require('express')
const mongoose = require('./db/db')
// Lancer l'appliquation Express
const app = express()
//La sécurité nécessite
const helmet = require('helmet')
const morgan = require('morgan')
require('dotenv').config()
 // middleware express-rate-limit pour limiter le nombre de requêtes effectuées
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 100,
});
// Routes
const userRoutes = require('./routes/user')
const sauceRoutes = require('./routes/sauce.js')

const cors = require('cors')
const path = require('path');//maiddlerwar

app
.use(morgan("dev"))
.use(cors())
.use(express.json())
.use(helmet())
.use(limiter) 

app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use("/images", express.static(path.join(__dirname,"images")))
//app.use("/api/auth", la suite dans le dossier routes)
app.use("/api/auth",userRoutes)
app.use("/api/sauces",sauceRoutes)

//exponrtation de app
module.exports = app