const express = require('express')
const morgan = require('morgan')
const Sauce = require('./models/sauce')
const app = express()
const mongoose = require('./db/db.js')
const userRoutes = require('./routes/user')
const sauceRoutes = require('./routes/sauce.js')
app.use(morgan("dev"))
const cors = require('cors')
//maiddlerwar
app
.use(cors())
.use(express.json())

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});



//app.use("/api/auth", la suite dans le dossier routes)
app.use("/api/auth",userRoutes)
app.use("/api/sauces",sauceRoutes)

/*app.post('/api/auth/signup',(req, res) =>{
  console.log("signup request:",req.body)
res.send({message:"utilisature enregitrer"})
})
app.post('/api/auth/login',(req, res) =>{
  console.log("login request:",req.body)
res.send({message:"utilisature enregitrer"})
})*/


//exponrtation de app
module.exports = app