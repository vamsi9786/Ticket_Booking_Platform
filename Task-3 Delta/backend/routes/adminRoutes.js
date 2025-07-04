const router = require('express').Router();
const { protect, restrictTo } = require('../middleware/auth');
const { getAllUsers, deleteUser, deleteEvent, deleteBooking, getAllEvents, Bookings } = require('../controllers/admincontroller');
const User = require('../models/User');
const Event = require('../models/Event');
const Booking = require('../models/Booking');

router.get('/users', protect, restrictTo('admin'), getAllUsers);

router.get('/events',protect,restrictTo('admin',),getAllEvents);
router.get('/bookings',protect,restrictTo('admin',),Bookings);
router.delete('/users/:id', protect, restrictTo('admin'), deleteUser);
router.delete('/events/:id', protect, restrictTo('admin'), deleteEvent);
router.delete('/bookings/:id', protect, restrictTo('admin'), deleteBooking);

module.exports = router;