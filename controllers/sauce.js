const Sauce = require('../models/sauce')


exports.createSauce = (req, res, next) => {
  const sauceObject = req.body.Sauce
  console.log(sauceObject)
   const sauce = new Sauce({
    ...sauceObject
   // imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // on resout chaque segment de l'ur

})
sauce
.save()
    
    .then((sauce) => {
        res.status(201).json(sauce);
      })
    .catch((error)=> res.status(400).json({error: error}))
    }



exports.getAllSauces = (req, res, next) => {
Sauce.find()
.then((sauces) => {
    res.status(200).json({sauces});
  })
.catch((error)=> res.status(400).json({error}))
}
