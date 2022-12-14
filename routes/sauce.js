//importation express
const express = require('express')
const auth = require('../middleware/auth');
//importation de controllers/user.js
const sauceController = require('../controllers/sauce')
console.log(sauceController)
//la fonction Router
const router = express.Router()





router.get('/', sauceController.getAllSauces);
router.post('/', sauceController.createSauce);
/*router.get('/:id', auth, sauceController.getOneThing);
router.put('/:id', auth, sauceController.modifyThing);
router.delete('/:id', auth, sauceController.deleteThing);*/







//exportation du module
module.exports = router