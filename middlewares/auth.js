const jwt= require('jsonwebtoken');

function authenticateToken(req,res,next){
    const authHeader= req.headers["authorization"];
    const token= authHeader && authHeader.split("")[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, "Snippet_SecretKEY", (err, user)=>{
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });

}

function generateAccessToken(userName){
    return jwt.sign({data: userName}, "Snippet_SecretKEY",{
        expiresIn:"48h"
    });

}

module.exports = {
    authenticateToken,
    generateAccessToken,
}