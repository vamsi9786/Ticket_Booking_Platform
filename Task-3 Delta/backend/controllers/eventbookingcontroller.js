const Booking=require('../models/Booking');
const Event=require('../models/Event');
const User = require('../models/User');
const sendEmail=require('../utils/sendEmail');

exports.createBooking = async (req, res) => {
    const { eventId, quantity, showDate, showTime}= req.body;
    try {
        const event= await Event.findById(req.body.eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        const total= event.price * req.body.quantity;
        const user= await User.findById(req.user._id);
        if(user.balance < total) {
            return res.status(400).json({ message: 'Insufficient balance' });
        }

        let selectedShow;
        let timeSlot;

        if(event.type==='movie'){
            selectedShow= event.shows.find(s=>s.date=== showDate);
            if(!selectedShow){
                return res.status(400).json({ message: 'Invalid Show Date' });
            }

            timeSlot=selectedShow.startTimes.find(t=> t.time===showTime);
            if(!timeSlot){
                return res.status(400).json({ message: 'Invalid Show Time for Selected Date' });
            }
            if(timeSlot.seats<quantity){
                return res.status(400).json({ message: 'Not Enough Seats Available for the Show...' });
            }
            timeSlot.seats-=quantity;
        }else{
            if(event.seats<quantity){
                return res.status(400).json({ message: 'Not Enough Seats Available for the Event...' });
            }
            event.seats-=quantity;
        }


        const booking = await Booking.create({
            user: req.user._id,
            event: event._id,
            vendor:event.vendor,
            quantity: req.body.quantity,
            totalPrice: total,
            source: event.source,
            destination: event.destination,
            place: event.place,
            showDate,
            showTime,
            date: event.date,
            status:'Successful',
        });

        const vendor=await User.findById(event.vendor);

        user.balance -= total;
        vendor.balance+=total;
        
        await user.save();
        await vendor.save();
        await event.save();

        await sendEmail(user.email,'Your Booking',`Your Booking \n ${event.title} \n Quantity:${booking.quantity} \n Total Price:${booking.totalPrice}\n `,'Valid till Event ends...');
        
        res.status(201).json({ message: 'Booking created successfully', booking,user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

exports.getBooking = async (req, res) => {
    try {
        const bookings = await Booking.findById(req.params.id).populate('event');
        res.status(200).json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

exports.getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({user: req.user._id}).populate('event');
        // if (!bookings || bookings.length === 0) {
        //     return res.status(404).json({ message: 'No bookings found' });
        // }
        res.status(200).json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

exports.deleteBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        const user = await User.findById(req.user._id);
        if(booking.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You are not authorized to cancel this booking' });
        }

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        const event = await Event.findById(booking.event);
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
            await event.save();
        }
        const vendor=await User.findById(event.vendor);
        const refundAmount = booking.totalPrice;
        user.balance += refundAmount;
        vendor.balance-=refundAmount;
        await user.save();
        await vendor.save();
        
        await sendEmail(user.email,'Your Booking has been Cancelled',`Your Booking \n ${event.title} \n Quantity:${booking.quantity} \n Total Price:${booking.totalPrice}\n Refund in 3-4 Business days `,'Valid till Event ends...');
        await Booking.findByIdAndDelete(req.params.id,{status:'Cancelled'});

        // await booking.remove();
        res.status(200).json({ message: 'Booking Cancelled successfully' ,user});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

exports.cancelBooking = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const booking = await Booking.findOne({_id:req.params.id, user: req.user._id});

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found'});
        }

        const event = await Event.findById(booking.event);

        if(new Date(event.date) < new Date()) {
            return res.status(400).json({ message: 'Cannot cancel booking for past events' });
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
            await event.save();
        }

        const vendor=await User.findById(event.vendor);
        const refundAmount = booking.totalPrice;
        user.balance += refundAmount;
        vendor.balance-=refundAmount;
        await user.save();
        await vendor.save();
        await sendEmail(user.email,'Your Booking has been Cancelled',`Your Booking \n ${event.title} \n Quantity:${booking.quantity} \n Total Price:${booking.totalPrice}\n Refund in 3-4 Business days `,'');
        await Booking.findByIdAndDelete(booking._id,{status:'Cancelled'});
        res.status(200).json({ message: 'Booking Cancelled Successfully' ,user});

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Cancellation Failed..!' });
    }
}
