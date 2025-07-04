const User=require('../models/User');
const bcrypt = require('bcryptjs');
const Booking= require('../models/Booking');

exports.getProfile= async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

exports.updateProfile = async (req, res) => {
    try {
        const user= await User.findById(req.user._id);
        if(!user){
            return res.status(404).json({ message: 'User not found' });
        }

        if(req.body.name){
            user.name= req.body.name;
        }

        if(req.file){
            user.avatar=`/uploads/avatars/${req.file.filename}`;
        }

        await user.save();
        res.status(200).json({message:'Profile Updated Successfully',user});

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

exports.changePassword = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('+password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isMatch = await bcrypt.compare(req.body.oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Old password is incorrect' });
        }

        user.password = req.body.newPassword;
        await user.save();
        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

exports.deleteAccount = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userbook=await Booking.find({user: user._id}).populate('event');
        
        for(let book of userbook){
            if(new Date(book.event.date)>new Date()){
                const vendor= await User.findById(book.event.vendor);
                const refamt=book.totalPrice;
                if(vendor){
                    vendor.balance=(vendor.balance || 0)-refamt;
                    await vendor.save();
                }

                user.balance= (user.balance || 0)+refamt;

                await Booking.findByIdAndDelete(book._id);
            }
        }

        await user.save();

        await User.findByIdAndDelete(req.user._id);
        res.status(200).json({ message: 'Account deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}