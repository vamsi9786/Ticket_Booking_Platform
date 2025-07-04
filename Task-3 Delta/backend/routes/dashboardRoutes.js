const router = require('express').Router();
const { getVendorDashboard ,deleteBooking, deleteEvent} = require('../controllers/dashboardcontroller');
const { protect, restrictTo } = require('../middleware/auth');

router.post('/events', protect, restrictTo('vendor','admin'), getVendorDashboard);
router.get('/events', protect, restrictTo('vendor','admin'), getVendorDashboard);
router.get('/bookings', protect, restrictTo('vendor','admin'), getVendorDashboard);
router.delete('/bookings/:id', protect, restrictTo('vendor','admin'), deleteBooking);
router.delete('/events/:id', protect, restrictTo('vendor','admin'), deleteEvent);

module.exports = router;