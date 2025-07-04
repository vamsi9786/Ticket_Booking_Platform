const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {type:String,required:true},
    email: { type: String, unique: true ,required:true},
    password: { type: String, required: true },
    role: { type: String, enum: ['user','vendor','admin'], default: 'user' },
    avatar: {type:String, default:''},
    balance: { type: Number,
        default:function(){
            if(this.role==='user') return 1000;
            else return 0;
        },
    },
    otp:String,
    otpExpiry:Date,
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);