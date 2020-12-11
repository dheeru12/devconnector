const express=require('express');
const router=express.Router();
const { check, validationResult }=require('express-validator');
const User = require('../../models/User');
const gravatar = require('gravatar');
const bcrypt= require('bcryptjs');
const jwt=require('jsonwebtoken');
const config=require('config');

//@route        POST api/users
//@description  register route for users
//@access       Public
router.post('/',[
    check('name','name is required').not().isEmpty(),
    check('email','Please enter a valid email').isEmail(),
    check('password','please enter a password with minimun 6 characters').isLength({min:6})
],async (req,res)=>{
    //console.log(req.body);
    const errors=validationResult(req);
    
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array()});
    }

    const {name,email,password} = req.body;
    try{
        // check if user already exists
        let user = await User.findOne({email});

        if(user){
            return res.status(400).json({ errors : [{ "msg":"user already exists"}]});
        }

        const avatar= gravatar.url(email,{
            s:'200',
            r:'pg',
            d:'mm'
        });
        //create a user
        user=new User({name,email,password,avatar});

        //Generating random bytes (the salt) and combining it with the password before hashing creates unique hashes across each user’s password
        //encrypting the password
        
        const salt = await bcrypt.genSalt(10);

        user.password=await bcrypt.hash(password,salt);

        //save user object to database
        await user.save();

        //return jsonwebtoken
        const payload = {
            user:{
                id:user.id
            }
        };

        jwt.sign(payload,
            config.get('jsonSecret'),
            {expiresIn:360000},
            (err,token)=>{
                if(err) throw err;
                res.json({token});
            });
    }catch(err){
        console.log(err.message);
        res.send("server error");
    }

    
});

module.exports=router;