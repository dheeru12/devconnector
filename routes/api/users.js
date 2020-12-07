const express=require('express');
const router=express.Router();

//@route        GET api/users
//@description  test route for users
//@access       Public
router.get('/',(req,res)=>{
    res.send('user route')
});

module.exports=router;