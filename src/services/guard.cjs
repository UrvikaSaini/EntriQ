const express=require('express');
const router=express.Router();
const db=require('../pages/resident/db.cjs');

router.get('/dashboard',async(req,res)=>{
    try{
        res.status(200).json({message:"Dashboard data fetched from database"});
    }catch(error){
        res.status(500).json({error:error.message});
    }
});
router.post('/verify-qr',async(req,res)=>{
    const {qr} = req.body;
    try{
        res.status(200).json({verified: true});
    }
    catch(error){
        res.status(500).json({error:error.message});
    }
})
module.exports=router;