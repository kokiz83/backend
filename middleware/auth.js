const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')
const result = dotenv.config()
module.exports = (req, res, next) => {
   try {
       const token = req.headers.authorization.split(' ')[1];
      console.log(token)
       const decodedToken = jwt.verify(token, process.env.JWT_KEY_TOKEN);
       const userId = decodedToken.userId;
       if (req.body.userId && req.body.userId !== userId) {
           throw "Invalid user ID"
        }else{
            console.log(userId)
            
        next();
    }
   } 
catch(error) {
       res.status(401).json({ 
        error : "invalid" });
   }
};
