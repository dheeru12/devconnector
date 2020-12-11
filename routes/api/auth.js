const express=require('express');
const router=express.Router();
const auth = require('../../middleware/auth');
const bcrypt = require('bcryptjs');
const User = require('../../models/User');
const { check, validationResult }=require('express-validator');
const config= require('config');
const jwt = require('jsonwebtoken');
//@route        GET api/auth
//@description  test route for auth
//@access       Public
router.get('/',auth,async (req,res)=>{
    try {
        const user=await User.findById(req.user.id).select("-password");
        res.json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error");
    }
    
});


router.post('/',[
    check('email','please enter a valid email').isEmail(),
    check('password','Required password').exists()
],async (req,res) => {
    try {
        let {email,password}=req.body;

        const user=await User.findOne({email});

        if(!user){
            res.status(400).json({"errors":[{"msg":"Invalid credentials"}]});
        }
        
        //allows you to compare password and encrypted password from database
        let validuser=await bcrypt.compare(password,user.password);

        if(!validuser){
            res.status(400).json({"errors":[{"msg":"Invalid credentials"}]});
        }

        const payload = {
            user:{
                id : user.id
            }
        };

        jwt.sign(payload,
            config.get('jsonSecret'),
            {expiresIn:36000},
            (err,token)=>{
                if(err) throw err;
                res.json({token});
            });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('server error');
    }
    
    
});
module.exports=router;