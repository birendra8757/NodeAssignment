const express = require('express');
const router = express.Router();
const userController = require('../controller/userController')
const MW = require('../middleware/auth');





router.post("/createUser",userController.createUser)// register user
router.post("/login",userController.loginUser) //login user by userName and password
router.put("/updateUser/:userId",MW.authenticate,userController.updateUser)//update user
router.delete("/deleteUser/:userId",MW.authenticate,userController.deleteUser)//delete user
router.post("/forgetPassword",userController.forgetPassword)//reset token
router.post("/resetPassword",userController.resetPassword)//set newpassword

router.get("/alluser",userController.getUser)//get all user



router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})


router.all("/*",(req,res)=>{
    return res.status(404).send({status:false,msg:" Please provide a correct url "})
})

module.exports=router;