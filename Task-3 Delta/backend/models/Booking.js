const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true,
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required:true,
    },
    quantity:{
        type:Number,
        required:true,
    },
    totalPrice: {
        type:Number,
        required:true,
    },
    
    showDate:{
        type:String,
        required: function() {
            return this.type === 'movie';
        },
    },
    showTime:{
        type:String,
        required: function() {
            return this.type === 'movie';
        },
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    // vendor:{
    //     type:mongoose.Schema.Types.ObjectId,
    //     ref:'user',
    //     required: true,
    // }
    status:{
        type: String,
        enum:['Successful','Cancelled','Pending'],
        default:'Pending',
    }
},{timestamps:true});

module.exports = mongoose.model('Booking', BookingSchema);