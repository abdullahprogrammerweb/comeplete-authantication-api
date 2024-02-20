import User from "../models/User.js ";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";

// handle user registration
export const userRegistration = async (req, res) => {
  const { name, email, password, password_confirmation, tc } = req.body;

  const user = await User.findOne({ email: email });
  if (user) {
    res.send({
      status: "failed",
      message: "Email already exists",
    });
  } else {
    if (name && email && password && password_confirmation && tc) {
      if (password === password_confirmation) {
        try {
          const salt = await bcrypt.genSalt(10);
          const hashPassword = await bcrypt.hash(password, salt);
          const doc = new User({
            name: name,
            email: email,
            password: hashPassword,
            tc: tc,
          });
          await doc.save();
          const saved_user = await User.findOne({ email: email });

          // Generate jwt token
          const token = Jwt.sign(
            { userID: saved_user._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "5d" }
          );
          res.status(201).send({
            status: "Sucessfull",
            message: "Registration Sucessfully",
            token: token,
          });
        } catch (error) {
          res.send({
            status: "failed",
            message: "Unable to register please try again later",
          });
        }
      } else {
        res.send({
          status: "failed",
          message: "password and confirm password are not same",
        });
      }
    } else {
      res.send({
        status: "failed",
        message: "All fields are required",
      });
    }
  }
};

// handle login
export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email && password) {
      const user = await User.findOne({ email: email });
      if (user != null) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (user.email === email && isMatch) {
          const saved_user = await User.findOne({ email: email });
          const token = Jwt.sign(
            { userID: saved_user._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "5d" }
          );
          res.send({
            status: "sucessfully",
            message: "Login sucessfully",
            token: token,
          });
        } else {
          res.send({
            status: "failed",
            message: "Email and password is not valid",
          });
        }
      } else {
        res.send({
          status: "failed",
          message:
            "your email is not register please eregister email than login",
        });
      }
    } else {
      res.send({
        status: "failed",
        message: "All fields are required",
      });
    }
  } catch (error) {
    res.send({
      status: "failed",
      message: "Try again later",
    });
  }
};

// changed password fetures
export const handleChangedPassword = async (req ,res)=>{
    try {
        const {password , password_confirmation} = req.body
        if(password && password_confirmation){
                if(password !== password_confirmation){
                    res.send({
                        status: "failed",
                        message: "password and confirm password are not matched",
                      });
                }else{
                  const salt = await bcrypt.genSalt(10)
                  const newHashPassword = await bcrypt.hash(password,salt)
                  await User.findByIdAndUpdate(req.user._id,{$set:{password:newHashPassword}})
                  res.send({"status":"sucess","message":"Password changed sucessfully"})
                }
        }else{
            res.send({
                status: "failed",
                message: "All fields are required",
              });
        }
    } catch (error) {
        console.error(error);
    }
}


//  show login user data
export const loggedUser = async (req, res) => {
  try {
    await res.send({ "user": req.user })
}
   catch(error){
    res.send('erro occured while fetching data' ,  error)
  }
}

// send password reset  email 
export const sendResetPasswordEmail = async (req , res) =>{
  const {email} = req.body
  if(email){
    const isEmailExist = await User.findOne({email:email})
    if(isEmailExist){
const secret = isEmailExist.user_id + process.env.JWT_SECRET_KEY
const token =  Jwt.sign({userId : isEmailExist._id },secret,{expiresIn:'15m'})
const link = `https://127.0.0.1:3000/api/user/reset/${isEmailExist._id}/${token}`;
console.log(link);
    }else{
      res.send({
        status: "failed",
        message: "Email is not register",
      });
    }
  }else{
    res.send({
      status: "failed",
      message: "email field are required",
    });
  }
}

//  update reset password
export const updateAndResetPassword = async(req , res)=>{
  const {password , password_confirmation}  = req.body;
  const {token , id } = req.params
  const isUserExist = await User.findById(id)
  const new_Secret = isUserExist.user_id + process.env.JWT_SECRET_KEY
  try {
    Jwt.verify(token , new_Secret)
    if(password , password_confirmation){
        const salt = await bcrypt.genSalt(10)
        const newHashPassword = await bcrypt.hash(password , salt)

        await User.findByIdAndUpdate(isUserExist._id , {$set:{password:newHashPassword }})
        res.send({ "status": "success", "message": "Password Reset Successfully" })
    }else{
      res.send({
        status: "failed",
        message: "All field are required",
      });
  
    }
    
  } catch (error) {
  
    res.send({ "status": "failed", "message": "Invalid Token", error:error })
  }
}