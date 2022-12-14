
//pour suprimer tout les donnée dans mongodb
// User.deleteMany({}).then()=>console.log("all remowved")

// importation models de la base de donnée user.js
const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
// importation de crypto pour chiffrer le mail
//const crypto = require('crypto-js')
//chiffrer l'email avant de l'envoyer dans la base de donnée
//const emailCrypto = crypto.HmacSHA256(req.body.email, "CLE-SECRETE").toString()



//singnup
exports.signup = (req, res, next) => {
    //hasher le mot de passe avant de l'envoyer dans la base de donner
    //salt = 10 = combien de fois sera exécuté l'algoritme 
    bcrypt.hash(req.body.password, 10)
        //ce qui va etre enregistrer dans mongodb
        .then((hash) => {
            const user = new User({
                email: req.body.email,
                password: hash
            })
            user
                .save()
                .then(() => res.status(201).json({ message: "utilisateur crée et sauvegarder" }))
                .catch((error) => res.status(409).json({ message: "utilisateur pas enregistré" }).send())
        })

        .catch((error) => res.status(500).json({ error }).send(console.log(error)))
}


exports.login = (req, res, next) => {
    const { email, password } = req.body
    console.log({ email, password })

    //chercher dans la base de donnée si lutilisateur est bien présent
    User.findOne({ email })
        // si le mail de  l'user n'est pas présent il n'existe pas 
        .then((user) => {
            console.log(user)
            if (!user) {
                res.status(400).json({ error: "utilisateur existe pas!" })
            }
            // controler si le password et valide avec la methode compare de bcrypt
            bcrypt
            .compare(req.body.password, user.password)
            .then((controlPass) => {
                    console.log(controlPass)
                    if (!controlPass) {
                        return res.status(401).json({ error: "le password et incorrect" })
                    }
                    // si le password et valive ou correct
                    res.status(200).json({
                        userId : user._id,
                        token :jwt.sign(
                            {userId: user._id},
                            "JWT_KEY_TOKEN",
                            {expiresIn:"24h"}
                        )
                     })
                })

             .catch((error) => res.status(500).json({ error }))

        })
        .catch((error) => res.status(500).json({ error }))
}

