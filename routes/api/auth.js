const express=require('express');
const router=express.Router();

//@route        GET api/auth
//@description  test route for auth
//@access       Public
router.get('/',(req,res)=>{
    res.send('auth route')
});

module.exports=router;