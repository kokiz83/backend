//importation express
const express = require('express')
const auth = require('../middleware/auth');

//la fonction Router
const router = express.Router()

//importation de controllers/user.js
const userController = require('../controllers/user')
console.log(userController)
//router.post("/singnup",dans le dossier controllers fichier à faire)
router.post("/signup",userController.signup)
router.post("/login",userController.login)






//exportation du module
module.exports = router