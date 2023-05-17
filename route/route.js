const express = require('express');
const router = express.Router();
const userController = require('../controller/userController')




router.post("/createUser",userController.createUser)

router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})


router.all("/*",(req,res)=>{
    return res.status(404).send({status:false,msg:" Please provide a correct url "})
})

module.exports=router;