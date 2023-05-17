const express = require('express');
const router = express.Router();
const userController = require('../controller/userController')
const MW = require('../middleware/auth');





router.post("/createUser",userController.createUser)
router.post("/login",userController.loginUser)
router.put("/updateUser/:userId",userController.updateUser)






router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})


router.all("/*",(req,res)=>{
    return res.status(404).send({status:false,msg:" Please provide a correct url "})
})

module.exports=router;