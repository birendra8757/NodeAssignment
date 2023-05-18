const userModel = require('../model/userModel');
const jwt = require("jsonwebtoken");
const bcrypt =require("bcrypt")


////****************create API***************** */
const createUser = async (req, res) => {
  try {
    let { name, email, userName, password } = req.body

    if (Object.keys(req.body).length == 0) {
      return res.status(400).send({ status: false, msg: "for registration user data is required" })
    }
    if (!name) {
      return res.status(400).send({ status: false, msg: "Enter your Name" });
    }

    if (!email) {
      return res.status(400).send({ status: false, msg: "Enter your email " })
    }
    if (!(/^[a-z0-9_]{1,}@[a-z]{3,10}[.]{1}[a-z]{3}$/).test(email)) {
      return res.status(400).send({ status: false, msg: "Please Enter valid Email" })
    }
    let existEmail = await userModel.findOne({ email: email })
    if (existEmail) {
      return res.status(400).send({ status: false, msg: "User with this email is already registered" })
    }
    if (!userName) {
      return res.status(400).send({ status: false, msg: "Enter your userName " })
    }
    let existuserName = await userModel.findOne({ userName: userName })
    if (existuserName) {
      return res.status(400).send({ status: false, msg: "userName is already registered" })
    }
    if (!password) {
      return res.status(400).send({ status: false, msg: "Please enter Password for registartion" })
    }
    
      let hash= await bcrypt.hash(req.body.password, 10)
      const user = new userModel({
        email: email,
        password: hash,
        userName:userName,
        name:name
      })
      let savedData = await userModel.create(user);
       res.status(201).send({ status: true, message: 'Success', data: savedData });
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};

//**************Login Api */

const loginUser = async function (req, res) {

  try {
    const UserName = req.body.userName;
    const Password = req.body.password;
    if (!UserName) {
      return res.status(400).send({ msg: "userName is not present" });
    }
    if (!Password) {
      return res.status(400).send({ msg: "Password is not present" });
    }
    let user = await userModel.findOne({ userName: UserName});

    if (!user) {
      return res.status(404).send({ status: false, msg: "UserName or Password is not corerct" });
    }
    let hashPassword= await bcrypt.compare(Password,user.password)
if(!hashPassword){
  return res.status(500).send({ msg: "UserName or Password is not corerct" });
}
    let token = await jwt.sign({ userId: user._id }, "my-self-key")
    return res.status(200).send({ status: true, token: token });
  }
  catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};



///***************update Api */

const updateUser = async function (req, res) {
  try {
    let data = req.params.userId
    let update = req.body
    
    let { name, userName, email, password } = update
    if (Object.keys(update).length == 0) { return res.status(400).send({ status: false, msg: "incomplete request data provide more data" }) }

    if (name || userName || email || password) {
      if (typeof (name || userName || email || password) !== "string") {
        return res.status(400).send({ status: false, msg: "please provide only string data only" })
      }}
    let checkisDleted = await userModel.findOne({ _id: data, isDeleted: true })

    if (checkisDleted) return res.status(404).send({ status: false, msg: "user not found found" })
    let hash= await bcrypt.hash(req.body.password, 10)

    let user = await userModel.findByIdAndUpdate({ _id: data},

      {
        $set: { name: name, userName: userName, email: email, password: hash }
      }, { new: true })
    return res.status(200).send({ status: true, message: "successful", data: user })

  } catch (err) { res.status(500).send({ status: false, msg: err.message }) }
}



///**************delete Api************** */
const deleteUser = async function (req, res) {

  try {
    let userId = req.params.userId

    let userdata = await userModel.findById(userId)

    if (!userdata) {
      return res.status(404).send({ msg: "No user exists with this uaerId" })
    }

    if (userdata.isDeleted === true) {
      return res.status(404).send({ msg: "user is already deleted" })
    }

    let deleteUser = await userModel.findOneAndUpdate({ _id: userId },
      { $set: { isDeleted: true, deletedAt: Date.now() } }, { new: true })
    return res.status(200).send({ status: true, msg: "user is sucessfully deleted" })
  }
  catch (err) {
    return res.status(500).send({ status: false, msg: err.message })
  }
}







//********** */ Forgot password API  regenerete token **********
const forgetPassword = async function (req, res) {
  try {
    const { userName } = req.body;
    let user = await userModel.findOne({userName:userName})
    if (user) {
      // Generate a reset token (expires in 15 minutes)
      const resetToken = jwt.sign({ id: user.id }, "my-secretKey", { expiresIn: '15m' });
      res.json({ resetToken });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message })
  }
}

// *********Reset password API ***********
const resetPassword = async function (req, res) {
  try {
    const { resetToken, newPassword } = req.body;
    if (!resetToken || !newPassword) {
      res.status(400).json({ error: 'Reset token and new password are required' });
      
    }
    jwt.verify(resetToken,  "my-secretKey", async (err, decoded) => {
   
      if (err) {
        return res.status(403).json({ error: 'Invalid reset token' });
      }
      const userId = decoded.id;
      
    let user = await userModel.findOne({_id:userId})
   
      if (user) {
        
      let hash= await bcrypt.hash(newPassword, 10)
        let data =await userModel.findByIdAndUpdate({_id:userId},{$set:{password:hash}},{new:true})
        return res.status(200).send({status:true, message: 'Password reset successfully',ress:data});
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    });
        
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message })

      
  }
  
}



//******get all user Api */

const getUser = async (req, res) => {
  try {
      const alluser = await userModel.find({ isDeleted:false })

     return res.status(200).send({ status: true, data: alluser })
  } catch (error) {
      return res.status(500).send({ status: false, message: error.message })
  }
}






module.exports = { createUser, loginUser, updateUser, deleteUser , forgetPassword,resetPassword,getUser }