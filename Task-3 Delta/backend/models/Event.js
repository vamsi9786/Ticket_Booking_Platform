const mongoose = require('mongoose');

const showSchema = new mongoose.Schema({
    date:{
        type:String,
        required:true,
    },
    startTimes:[
        {
            time:{
                type:String,
                required:true,
            },
            seats:{
                type:Number,
                required:true,
            }
        }
    ],

},{_id:false});

const eventSchema = new mongoose.Schema({
    title: String,
    type: {type: String, enum:['movie','concert','train'],default:'movie'},
    date: {
        type:String,
        required: function() {
            return this.type !== 'movie';
        }
    },
    enddate:{
        type:String,
        required: function() {
            return this.type === 'train';
        },
    },
    time: {
        type:String,
        required:function(){
            return this.type !== 'movie';
        }
    },
    endtime: {
        type:String,
        required: function() {
            return this.type === 'train';
        },
    },
    
    poster: {type:String,required: function(){return this.type!=='train'}},

    showLength:{
        type:String,
        required: function() {
            return this.type === 'movie';
        },
    },

    shows:{
        type:[showSchema],
        required: function() {
            return this.type === 'movie';
        },
    },

    place: {
        type: String,
        required: function() {
            return this.type !== 'train';
        },
    },
    price: Number,
    seats: {
        type: Number,
        required: function() {
            return this.type !== 'movie';
        },
    },
    source: {
        type: String,
        required: function() {
            return this.type === 'train';
        },
    },
    destination: {
        type: String,
        required: function() {
            return this.type === 'train';
        },
    },
    vendor:{type: mongoose.Schema.Types.ObjectId, ref: 'User',required:true},
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);