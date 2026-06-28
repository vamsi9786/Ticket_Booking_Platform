const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');


const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const adminRoutes = require('./routes/adminRoutes');


dotenv.config();

const app = express();
app.use(cors({origin: [ 'http://localhost:3000', 'https://ticket-booking-platform-frontend-jet.vercel.app'], credentials: true}));
//app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use('/uploads/avatars', express.static('uploads/avatars'));
app.use('/tickets', express.static('tickets'));

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log('connected to MongoDB & listening on port',process.env.PORT);
        });
    }).catch((error) => {
        console.log(error);
});


app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

    
