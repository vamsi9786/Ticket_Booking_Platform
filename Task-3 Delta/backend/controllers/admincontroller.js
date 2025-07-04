const User = require('../models/User');
const Event = require('../models/Event');
const Booking = require('../models/Booking');
const sendEmail=require('../utils/sendEmail');

exports.getAllUsers= async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const usertodel= req.params.id;
        const user = await User.findById(req.params.id);
        if(req.params.id==req.user._id){
            return res.status(400).json({message:'Cannot Delete Yourself...'})
        }
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userbook=await Booking.find({user: usertodel}).populate('event');

        for(let book of userbook){
            const vendor= await User.findById(book.event.vendor);
            const refamt=book.totalPrice;
            if(vendor){
                vendor.balance=(vendor.balance || 0)-refamt;
                await vendor.save();
            }

            user.balance= (user.balance || 0)+refamt;

            await sendEmail(user.email,'Your Booking has been Cancelled',`Your Booking \n ${book.event.title} \n Quantity:${book.quantity} \n Total Price:${book.totalPrice}\n Refund in 3-4 Business days `,'Valid till Event ends...');
            await Booking.findByIdAndDelete(book._id);
        }

        await sendEmail(user.email,'Account Banned','Due to Inappropriate Behaviour..Your Account has been Banned by our Admin','');
        await user.save();

        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'User deleted successfully' },user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

exports.getAllEvents = async(req,res)=>{
    try{
        const events= await Event.find();
        res.status(200).json(events);
    } catch(error){
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

exports.Bookings= async(req,res)=>{
    try{
        const allbookings= await Booking.find().populate('user event');
        res.status(200).json(allbookings);
    }catch(error){
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

exports.deleteEvent = async (req, res) => {
    try {
        const hasBookings= await Booking.findOne({event: req.params.id});
        if(hasBookings){
            return res.status(400).json({ message: 'Has Bookings..Cannot delete Event' });
        }
        const event = await Event.findByIdAndDelete(req.params.id).populate('vendor');
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        await sendEmail(event.vendor.email,'Your event has been deleted by admin',`Your Booking \n ${event.title} if any Bookings Refund in 3-4 Business days `,'');
        res.status(200).json({ message: 'Event deleted successfully' },event);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

exports.deleteBooking= async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        const event = await Event.findById(booking.event);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        if (event) {
            if(event.type==='movie'){
                const show=event.shows.find(s=>s.date===booking.showDate);
                if(show){
                    const timeSlot= show.startTimes.find(t=>t.time===booking.showTime);
                    if(timeSlot){
                        timeSlot.seats+=booking.quantity;
                        event.markModified('shows');
                    }
                }
            }else{
                event.seats+=booking.quantity;
            }
        }
        const user=await User.findById(booking.user);
        const vendor=await User.findById(event.vendor);

        const refundAmount = booking.totalPrice;
        user.balance += refundAmount;
        vendor.balance-=refundAmount;
        await user.save();
        await vendor.save();
        await event.save();

        await sendEmail(user.email,'Your Booking has been Cancelled',`Your Booking \n ${event.title} \n Quantity:${booking.quantity} \n Total Price:${booking.totalPrice}\n Refund in 3-4 Business days `,'Valid till Event ends...');

        await Booking.findByIdAndDelete(req.params.id,{status:'Cancelled'});
        res.status(200).json({ message: 'Booking deleted successfully' },booking);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}