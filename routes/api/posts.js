const express=require('express');
const router=express.Router();

//@route        GET api/posts
//@description  test route for posts
//@access       Public
router.get('/',(req,res)=>{
    res.send('posts route')
});

module.exports=router;