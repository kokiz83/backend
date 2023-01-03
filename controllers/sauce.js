const Sauce = require('../models/sauce')
// Import de fs : module de système de fichiers Node.js permet de travailler avec le système de fichiers

const fs = require('fs')
// Crée un sauce
/**
 * Const sauceObject récupère les éléments du body puis on le transforme en JSON grâce à .parse
 * Suppression de l'_id et l'userId de la sauce
 * Ajout de l'image dans le dossier images lors de la création de la sauce
 * Ajout par défaut likes et dislikes à 0 lors de la création de la sauce
 * Envoi dans la BDD après création de la sauce
 */

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce)
delete sauceObject._id
delete sauceObject._userId
  
  const sauce = new Sauce({ 
    ...sauceObject,
    userId : req.auth.userId,
    likes : 0,
    dislikes: 0,
    usersLiked: [' '],
    usersDisliked:[' '],
imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // on resout chaque segment de l'urL
}) 
  sauce.save() 
    .then(() => {
      res.status(201).json({ message: 'sauce crée et enregistré' });
    })
    .catch((error) => res.status(400).json({ error }))
  }   
  //met a jour la sauce avec l'id fournis  capture image url de la sauce
  /**
 * Vérification de l'utilisateur pour permettre ou non la modification de la sauce
 * Si Non = msg d'erreur, si Oui = maj dans la BDD
 */
  exports.modifySauce = (req, res, next) => {
   
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
 
    delete sauceObject._userId;
    Sauce.findOne({_id: req.params.id})
        .then((sauce) => {
        
            if (sauce.userId != req.auth.userId) { 
                res.status(401).json({ message : 'Not authorized'});

            }
            else {
                Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
                .then(() => res.status(200).json({message : 'Objet modifié!'}))
                .catch(error => res.status(401).json({ error }));
            }
        }) 
        .catch((error) => {
            res.status(400).json({ error });  
        });
 };
  
 

//revoie un tableau de toute les sauces 
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => {
      res.status(200).json(sauces); 
    })
    .catch((error) => res.status(400).json({ error }))
} 
// renvoie la sauce avec l'id fourni
exports.getOnesauce = (req, res, next) => {
  Sauce.findOne({ 
    _id: req.params.id
  })
    .then((sauce) => {
      res.status(200).json(sauce);
    })
    .catch((error) => res.status(404).json({ error }))
} 

//Supprimer une sauce avec l'id fourni
/**
 * Vérification de l'utilisateur pour permettre ou non la suppression de la sauce
 * Si autorisé = Suppression de l'image grâce à .unlink du dossier image + suppression de la sauce dans la BDD
 */
exports.deletesauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id})
      .then(sauce => { 
          if (sauce.userId != req.auth.userId) {
              res.status(401).json({message: 'Not authorized'});
          } else {
              const filename = sauce.imageUrl.split('/images/')[1];
              fs.unlink(`images/${filename}`, () => {
                  Sauce.deleteOne({_id: req.params.id})
                      .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                      .catch(error => res.status(401).json({ error }));
              });
          }
      })
      .catch( error => {
          res.status(500).json({ error });
      });
}; 
// Création like ou dislike (Post/:id/like)
/*
 * Utilisation de la méthode .includes pour trouver un élement dans un tableau
 * Utilisation de $inc pour incrémenter une valeur à un élément ( ici aux likes/dislikes )
 * Utilisation de $push pour ajouter un élément au tableau
 * Utilisation de $pull pour retirer un élément du tableau
 * Utilisation de switch avec les différents cas possible : -1, 0, 1.
 */
exports.likeSauce = (req, res, next) => {
  // Si l'utilisateur aime la sauce
  if (req.body.like === 1) {
    // On ajoute 1 like et on l'envoie dans le tableau "usersLiked"
    Sauce.updateOne({ _id: req.params.id },
      {
        $inc: { likes: req.body.like++ },
        $push: { usersLiked: req.body.userId }
      })
      .then(() => res.status(200).json({ message: 'Merci ! Votre avis a été pris en compte' }))
      .catch(error => res.status(400).json({ error }));
  } else if (req.body.like === -1) {
    // Si l'utilisateur n'aime pas la sauce
    // On ajoute 1 dislike et on l'envoie dans le tableau "usersDisliked"
    Sauce.updateOne({ _id: req.params.id },
      {
        $inc: { dislikes: (req.body.like++) * -1 },
        $push: { usersDisliked: req.body.userId }
      })
      .then(() => res.status(200).json({ message: 'Merci ! Votre avis a été pris en compte !' }))
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
            .then(() => { res.status(200).json({ message: 'Like supprimé !' }) })
            .catch(error => res.status(400).json({ error }))
        } else if (sauce.usersDisliked.includes(req.body.userId)) {
          // Si le tableau "userDisliked" contient l'ID de l'utilisateur
          // On enlève un dislike du tableau "userDisliked" 
          Sauce.updateOne({ _id: req.params.id },
            {
              $pull: { usersDisliked: req.body.userId },
              $inc: { dislikes: -1 }
            })
            .then(() => { res.status(200).json({ message: 'Dislike supprimé !' }) })
            .catch(error => res.status(400).json({ error }))
        }
      })
      .catch(error => res.status(400).json({ error }));
  }
}