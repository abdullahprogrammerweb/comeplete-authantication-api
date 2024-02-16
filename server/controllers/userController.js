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
            const saved_user = await User.findOne({email:email})

            // Generate jwt token
            const token = Jwt.sign({userID:saved_user._id},process.env.JWT_SECRET_KEY,{expiresIn:"5d"})
            res.status(201).send({
                status: "Sucessfull",
                message: "Registration Sucessfully",
                token:token,
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
        const {email, password}= req.body;
        if(email && password){
                const user = await User.findOne({email:email})
                if(user != null){
                        const isMatch= await bcrypt.compare(password,user.password)
                        if((user.email === email) && isMatch){
                            const saved_user = await User.findOne({email:email})
                            const token = Jwt.sign({userID:saved_user._id},process.env.JWT_SECRET_KEY,{expiresIn:'5d'})
                            res.send({
                                status:"sucessfully",
                                message:"Login sucessfully",
                                token:token
                            })
                        }else{
                            res.send({
                                status: "failed",
                                message: "Email and password is not valid",
                            });
                        }
                }else{
                    res.send({
                        status: "failed",
                        message: "your email is not register please eregister email than login",
                    });
                }
        }else{
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

    
