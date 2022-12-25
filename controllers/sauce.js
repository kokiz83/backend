const Sauce = require('../models/sauce')
//importation fs
const fs = require('fs')
const sauce = require('../models/sauce')

 
// Crée un sauce
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce)
  console.log(sauceObject)

  delete sauceObject._id
  const sauce = new Sauce({
    ...sauceObject,
  imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // on resout chaque segment de l'urL

  })
  sauce
    .save() 
    .then(() => {
      res.status(201).json({ message: 'sauce crée et enregistré' });
    })
    .catch((error) => res.status(400).json({ error: error }))
}   
//  
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => {
      res.status(200).json(sauces); 
    })
    .catch((error) => res.status(400).json({ error }))
} 
//
exports.getOnesauce = (req, res, next) => {
  Sauce.findOne({ 
    _id: req.params.id,
  })
    .then((sauce) => {
      res.status(200).json(sauce);
    })
    .catch((error) => res.status(404).json({ error }))
}

//

exports.modifysauce = (req, res, next) => {
  console.log("req.body.userId")
  console.log(req.body.userId)
  console.log({_id : req.params.id})
  
  // Déclarer les constantes
  const sauceObject = req.file ? {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };
  

  // Vérifier si l'utilisateur a les autorisations nécessaires
  if (sauceObject.userId !== req.body.userId) {
    return res.status(203).json({ message: "Vous n'avez pas les autorisations pour modifier une sauce" });
  }
 
  // Si un fichier a été téléchargé, supprimer l'ancien fichier et mettre à jour la sauce
  if (req.file) {
    Sauce.findOne({ _id: req.params.id })   
      .then((sauce) => {
        // Récupérer le nom du fichier à partir de l'URL de l'image
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Sauce mise à jour!' }))
            .catch((error) => res.status(400).json({ error }));
        });
      })
      .catch((error) => res.status(500).json({ error }));
  } else {
    // Sinon, mettre à jour la sauce sans changer l'image
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Sauce mise à jour! sans changer l image' }))
      .catch((error) => res.status(400).json({ error }));
  }
};
////////////////////////////////////////////////////////////////////////////////////
   /* exports.modifysauce = (req, res, next) => { 
console.log("route put :req.parmas.id")
  
  console.log({_id : req.params.id})
  console.log("put : req.file")
  console.log(req.file)

  const sauceObject = req.file ?
  {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };
  if (sauceObject.userId === req.body.userId)
 { if (req.file) {
  Sauce
  .findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
          .then(() => { res.status(200).json({ message: 'Sauce mise à jour!' }); })
          .catch((error) => { res.status(400).json({ error }); });
      })  
    }) 
    .catch((error) => { res.status(500).json({ error }); });
  
  } else {
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce mise à jour!' }))
    .catch((error) => res.status(400).json({ error }));
  }
 }else{
  res.status(203).json({ message: 'Vous n\'avez pas les autorisations pour modifier une sauce'})
  .catch(error => res.status(400).json({ error }))
 }
  } */
  ///////////////////////////////////////////////////////////////////////////////
  /*if(req.file){
   sauce
   .findOne({_id : req.params.id})
   .then((sauce) => {
    //récupération du nom de la photo à suprimer dans la base de donnée
    const filename = sauce.imageUrl.split('/images/')[1];
    console.log(filename)
    //suppression de l'images dans le dossier images du serveur
    fs.unlink(`images/${filename}`, () => {
      Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => { res.status(200).json({ message: 'Sauce mise à jour!' }); })
        .catch((error) => { res.status(400).json({ error }); });
    })
   })
   .catch((error) => res.status(404).json({ error }))

  }else{
    console.log("false")
  }
  //l'objet qui va etre mise à jour dans la base de donner
  console.log(req.body)
  console.log(req.body.sauce)
  //deux cas possible 
  const sauceObject = req.file ? // l'opérateur ternaire 
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body }
    console.log(sauceObject)

//metre à jour la base de donnée
  sauce.updateOne({_id : req.params.id},{...sauceObject, _id : req.params.id})
  .then(() => res.status(200).json({
    message :"l'objet à été mise à jour",
    contenu: sauceObject
  }))
  .catch(error => res.status(404).json({error}))
  }*/
 

//////////////////////////////////////////////////////////////////

 /* const sauceObject = req.file
    ? {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename 
        }`,
    }
    : { ...req.body };
  Sauce.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: "Objet modifié !" })) // Si tout fonctionne, on renvoie un code 200
    .catch((error) => res.status(400).json({ error }));
};*/
//Supprimer une sauce
exports.deletesauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'sauce supprimé !' }))
          .catch(error => res.status(400).json({ error }));
      });
    }) 
    .catch(error => res.status(500).json({ error }));
}  
 
// Création like ou dislike (Post/:id/like)
exports.likeSauce = (req, res, next) => {
  // Si l'utilisateur aime la sauce
  if (req.body.like === 1) {
    // On ajoute 1 like et on l'envoie dans le tableau "usersLiked"
    Sauce.updateOne({ _id: req.params.id },
      {
        $inc: { likes: req.body.like++ },
        $push: { usersLiked: req.body.userId }
      })
      .then((sauce) => res.status(200).json({ message: 'Like ajouté !' }))
      .catch(error => res.status(400).json({ error }));
  } else if (req.body.like === -1) {
    // Si l'utilisateur n'aime pas la sauce
    // On ajoute 1 dislike et on l'envoie dans le tableau "usersDisliked"
    Sauce.updateOne({ _id: req.params.id },
      {
        $inc: { dislikes: (req.body.like++) * -1 },
        $push: { usersDisliked: req.body.userId }
      })
      .then((sauce) => res.status(200).json({ message: 'Dislike ajouté !' }))
      .catch(error => res.status(400).json({ error }));
  } else {
    // Si like === 0 l'utilisateur supprime son vote
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
        // Si le tableau "userLiked" contient l'ID de l'utilisateur
        if (sauce.usersLiked.includes(req.body.userId)) {
          // On enlève un like du tableau "userLiked" 
          Sauce.updateOne({ _id: req.params.id },
            {
              $pull: { usersLiked: req.body.userId },
              $inc: { likes: -1 }
            })
            .then((sauce) => { res.status(200).json({ message: 'Like supprimé !' }) })
            .catch(error => res.status(400).json({ error }))
        } else if (sauce.usersDisliked.includes(req.body.userId)) {
          // Si le tableau "userDisliked" contient l'ID de l'utilisateur
          // On enlève un dislike du tableau "userDisliked" 
          Sauce.updateOne({ _id: req.params.id },
            {
              $pull: { usersDisliked: req.body.userId },
              $inc: { dislikes: -1 }
            })
            .then((sauce) => { res.status(200).json({ message: 'Dislike supprimé !' }) })
            .catch(error => res.status(400).json({ error }))
        }
      })
      .catch(error => res.status(400).json({ error }));
  }
}