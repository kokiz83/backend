
const emailValidator = require('email-validator')

module.exports = (req, res, next)=>{
    const {email}= req.body
    if(emailValidator.validate(email)){
        console.log('email  valid')
        next()
    }else{
        return res
        .status(400)
        .json({error : "l'email et pas valide"})
    }
}
