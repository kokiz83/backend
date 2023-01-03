/* On retrouve ici la logique métier en lien avec nos utilisateurs, 
appliqué aux routes POST pour les opérations d'inscription et de connexion*/

// importation models de la base de donnée user.js
const User = require("../models/user");
const bcrypt = require("bcrypt");// On utilise l'algorithme bcrypt pour hasher le mot de passe des utilisateurs
const jwt = require("jsonwebtoken");// On utilise le package jsonwebtoken pour attribuer un token à un utilisateur au moment ou il se connecte
const dotenv = require("dotenv");
dotenv.config();

//singnup
/* On sauvegarde un nouvel utilisateur
 et crypte son mot de passe avec un hash généré par bcrypt*/
exports.signup = (req, res, next) => {
    /* On appelle la méthode hash de bcrypt et on lui passe le mdp de l'utilisateur,
     le salte (10) ce sera le nombre de tours qu'on fait faire à l'algorithm*/
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });
     
      //On enregistre l'utilisateur dans la base de données
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) =>
          res.status(400).json({ message: "utilisateur incorécte" }).send()
        );// Si il existe déjà un utilisateur avec cette adresse email
    })

    .catch((error) => res.status(500).json({ error }).send(console.log(error)));
};
/*Le Middleware pour la connexion d'un utilisateur vérifie
 si l'utilisateur existe dans la base MongoDB lors du login
 si oui il vérifie son mot de passe,
 s'il est bon il renvoie un TOKEN contenant l'id de l'utilisateur, 
sinon il renvoie une erreur*/
exports.login = (req, res, next) => {
  const { email, password } = req.body;
 
  //chercher dans la base de donnée si lutilisateur est bien présent
  User.findOne({ email })
    // si le mail de  l'user n'est pas présent il n'existe pas
    .then((user) => {
    
      if (!user) {
        res.status(400).json({ error: "utilisateur existe pas!" });
      }
      // controler si le password et valide avec la methode compare de bcrypt
      bcrypt
        .compare(req.body.password, user.password)
        .then((controlPass) => {
       
          if (!controlPass) {
            return res.status(401).json({ error: "le password et incorrect" });
          }
          // si le password et valive ou correct
          res.status(200).json({
            userId: user._id,
            token: jwt.sign({ userId: user._id }, `${process.env.JWT_KEY_TOKEN}`, {
              expiresIn: "24h"
            })
          })
        })

        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};