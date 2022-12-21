//importation express
const express = require('express')
const auth = require('../middleware/auth');

//la fonction Router
const router = express.Router()

const email = require("../middleware/email")
const password = require('../middleware/password')

//importation de controllers/user.js
const userController = require('../controllers/user')
console.log(userController)
//router.post("/singnup",dans le dossier controllers fichier à faire)
router.post("/signup",email, password, userController.signup)
router.post("/login",userController.login)






//exportation du module
module.exports = router