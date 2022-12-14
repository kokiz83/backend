// importer le package http pour avoir les outils pour crée le server
const http = require('http')
const dotenv = require('dotenv')
const result = dotenv.config()

//importer l'app.js
const app = require('./app')
app.set("PORT",process.env.PORT)
const server = http.createServer(app)
server.listen(process.env.PORT)




