const userModel = require('../model/userModel');
const jwt = require("jsonwebtoken");



const createUser = async (req, res) => {
    try {
        let { name, email,userName, password} = req.body

        if (Object.keys(req.body).length == 0) {
            return res.status(400).send({ status: false, msg: "for registration user data is required" })}
        if (!name) {
            return res.status(400).send({ status: false, msg: "Enter your Name" });}
        
        if (!email) {
            return res.status(400).send({ status: false, msg: "Enter your email " })
        }
        if (!(/^[a-z0-9_]{1,}@[a-z]{3,10}[.]{1}[a-z]{3}$/).test(email)) {
            return res.status(400).send({ status: false, msg: "Please Enter valid Email" })}
        let existEmail = await userModel.findOne({ email: email })
        if (existEmail) {
            return res.status(400).send({ status: false, msg: "User with this email is already registered" })
        }
        if (!userName) {
            return res.status(400).send({ status: false, msg: "Enter your userName " })
        }
        let existuserName= await userModel.findOne({ userName: userName })
        if (existuserName) {
            return res.status(400).send({ status: false, msg: "userName is already registered" })
        }
        if (!password) {
            return res.status(400).send({ status: false, msg: "Please enter Password for registartion" })
        }
        let savedData = await userModel.create(req.body);
        return res.status(201).send({ status: true, message: 'Success', data: savedData });
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
};




const loginUser = async function (req, res) {

    try {
        const UserName = req.body.userName;
        const Password = req.body.password;
        if (!UserName) {
            return res.status(400).send({ msg: "userName is not present" });}
        if (!Password) {
            return res.status(400).send({ msg: "Password is not present" });}
        let user = await userModel.findOne({ userName: UserName, password: Password });
        if (!user) {
            return res.status(404).send({ status: false, msg: "UserName or Password is not corerct" });}
        let token = jwt.sign({ userId: user._id }, "my-self-key")
        return res.status(200).send({ status: true, token: token });}
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message });
    }
};





const updateUser = async function (req, res) {
    try {
      let data = req.params.userId
      let update = req.body
  
      let { name, userName, email, password } = update
    
      if (Object.keys(update).length == 0) { return res.status(400).send({ status: false, msg: "incomplete request data provide more data" }) }
  
      if (name || userName || email  || password) {
        if (typeof (name || userName || email  || password) !== "string") {
          return res.status(400).send({ status: false, msg: "please provide only string data only" })
        }}
      let checkisDleted = await userModel.findOne({ _id: data, isDeleted: true })
      
      if (checkisDleted) return res.status(404).send({ status: false, msg: "user not found found" })
  
  
      let user = await userModel.findByIdAndUpdate({ _id: data },
        {
           $set: { name: name, userName:userName, email:email, password:password }
        }, { new: true })
      return res.status(200).send({ status: true, message:"successful" ,data:user })

    } catch (err) { res.status(500).send({ status: false, msg: err.message }) }
  }
  









module.exports = {createUser,loginUser,updateUser}