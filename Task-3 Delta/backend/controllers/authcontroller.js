const User=require('../models/User');
const jwt = require('jsonwebtoken');
const validator= require('validator');
const crypto = require('crypto');
const bcrypt= require('bcrypt')
const sendEmail=require('../utils/sendEmail');

const genToken= id => jwt.sign({ id }, process.env.JWT_SECRET, {expiresIn: '7d'});

exports.register = async (req, res) => {
    try{
        const { name, email, password, role } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        if(!validator.isStrongPassword(password)){
            return res.status(400).json({ message: 'Password is not strong enough'});
        }

        const exists= await User.findOne({email});
        if (exists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({name, email, password, role});
        const token = genToken(user._id);
        res.status(201).json({token,user});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        const user = await User.findOne({ email });

        if(!user){
            return res.status(401).json({ message: 'User Not Found' });
        }

        if (!(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = genToken(user._id);
        res.status(200).json({ token, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

exports.logout = (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out successfully' });
}

exports.forgotPassword = async (req, res) => {
    const { email }=req.body;
    try{
    const user= await User.findOne({email});
    if(!user){
        return res.status(404).json({message:'User Not Found'});
    }
    const otp= Math.floor(123456+(Math.random()*876543)).toString();

    user.otp=otp;
    user.otpExpiry=Date.now()+10*60*1000;
    await user.save();

    await sendEmail(user.email,'Your OTP Code',`Your OTP is ${otp}`,'Valid for 10 Mins only...');

    res.json({message:'OTP sent Successfully'});}
    catch(err){
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

exports.changePassword= async (req,res) =>{
    const { oldPassword , newPassword }= req.body;

    try{
        const user= await User.findById(req.user._id);
        if(!user){
            return res.status(404).json({message:'User not Found'});
        }

        const isMatch= await bcrypt.compare(oldPassword,user.password);
        if(!isMatch){
            return res.status(400).json({message:'Incorrect Password'});
        }

        user.password= await bcrypt.hash(newPassword,10);
        await user.save();

        res.json({message:'Password Changed Successfully'});
    } catch(err){
        console.error(err);
        res.status(500).json({ message: err.message });
    }
}

exports.resetPassword = async (req, res) => {
    try {
        const { email, otp, password }=req.body;
        const user=await User.findOne({email,otp});

        if(!user || user.otpExpiry<Date.now()){
            return res.status(400).json({message:'Invalid or Expired OTP'});
        }

        user.password=password;
        user.otp=undefined;
        user.otpExpiry=undefined;
        await user.save();

        res.status(200).json({message:'Password Reset Successful'});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}