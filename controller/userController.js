const userModel = require('../model/userModel');



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
}

module.exports = {createUser}