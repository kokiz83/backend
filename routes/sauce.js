//importation express
const express = require('express')
//la fonction Router
const router = express.Router()
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config')
//importation de controllers/user.js
const sauceController = require('../controllers/sauce')
console.log(sauceController)

router.post('/', auth, multer, sauceController.createSauce);
router.get('/', auth, sauceController.getAllSauces);
router.get('/:id', auth, sauceController.getOnesauce);
router.put('/:id', auth, multer, sauceController.modifySauce);
router.delete('/:id', auth, sauceController.deletesauce);
router.post('/:id/like', auth, sauceController.likeSauce);

//exportation du module
module.exports = router 