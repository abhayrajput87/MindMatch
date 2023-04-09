import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js"

/* Register User */
//When we calling mongo database it should be asynchronous
//frontend->backend ->databse
export const register =async(req,res)=>{
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation

        }=req.body;
        console.log(req.body)
        const salt=await bcrypt.genSalt(); //Generating random salts using bcrypt
        const passwordHash = await bcrypt.hash(password,salt);
        const newUser=new User({
            firstName,
            lastName,
            email,
            password:passwordHash,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random()*10000),
            impressions: Math.floor(Math.random()*10000),

        })
        const savedUser = await newUser.save();
        red.status(201).json(savedUser); 
    } catch (error) {
        res.status(500).json({error: error.message});
        
    }
}

/*  Logging In*/
 export const login =async(req,res)=>{
    try {
        const {email,password}=req.body;
        const user= await User.findOne({email:email})
        if(!user) return res.status(400).json({msg:"user does not exist"});

        const isMatch= await bcrypt.compare(password,user.password);
        if(!isMatch) return res.status(400).json({msg:"Invalid Code"});
        
        const token =jwt.sign({id: user._id}, process.env.JWT_SECRE);
        delete user.password;
        res.status(200).json({token,user})
    } catch (err) {
        res.status(500).json({err: error.message})
    }
 }
