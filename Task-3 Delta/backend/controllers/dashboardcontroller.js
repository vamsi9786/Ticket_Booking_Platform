const Event = require('../models/Event');
const Booking = require('../models/Booking');
const User=require('../models/User');
const sendEmail=require('../utils/sendEmail');

exports.getVendorDashboard = async (req, res) => {
    try {
        const events = await Event.find({ vendor: req.user._id });
        const eventIds=events.map(e=>e._id);
        const bookings = await Booking.find({ event:{$in:eventIds}}).populate('user event');
        res.status(200).json({ events, bookings });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

exports.deleteBooking= async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id).populate('event user');
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
                    }
                }
            }else{
                event.seats+=booking.quantity;
            }
            await event.save();
        }

        if(booking.event.vendor.toString()!==req.user._id.toString()){
            return res.status(403).json({message:'Forbidden Not Your Event'});
        }

        const user=booking.user;
        const vendor=await User.findById(event.vendor);

        const refundAmount = booking.totalPrice;
        user.balance += refundAmount;
        vendor.balance-=refundAmount;
        await user.save();
        await vendor.save();

        await sendEmail(user.email,'Your Booking has been Cancelled',`Your Booking \n ${event.title} \n Quantity:${booking.quantity} \n Total Price:${booking.totalPrice}\n Refund in 3-4 Business days `,'Valid till Event ends...');
        await Booking.findByIdAndDelete(req.params.id,{status:'Cancelled'});
        res.status(200).json({ message: 'Booking deleted successfully' },booking,user,vendor);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

exports.deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        if(event.vendor.toString()!==req.user._id.toString()){
            return res.status(400).json({ message: 'Not Authorized' });
        }

        const hasBookings= await Booking.findOne({event: req.params.id });
        if(hasBookings){
            return res.status(400).json({ message: 'Has Bookings..Cannot delete Event' });
        }

        await Event.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'Event deleted successfully' },event);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}