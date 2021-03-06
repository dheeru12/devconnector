const jwt= require('jsonwebtoken');
const config=require('config');

module.exports=function(req,res,next){
    //get token from header
    const token=req.header('x-auth-token');

    //check if its a valid token
    if(!token){
        return res.status(401).json({msg:"no token, authorization denied"});
    }

    //decode the token
    try {
        const decoded=jwt.verify(token,config.get('jsonSecret'));
        req.user=decoded.user;
        next();
    } catch (error) {
        res.status(401).json({msg:"not a valid token"});
    }
    
}