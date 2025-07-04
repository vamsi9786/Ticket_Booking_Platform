const router = require('express').Router();
const { protect , restrictTo } = require('../middleware/auth');
const {createBooking, getBookings, getBooking, deleteBooking, cancelBooking} = require('../controllers/eventbookingcontroller');

router.post('/', protect,restrictTo('user') ,createBooking);
router.get('/', protect, getBookings);
router.get('/:id', protect,restrictTo('user') , getBooking);
// router.delete('/:id', protect,restrictTo('user') , deleteBooking);
router.delete('/:id',protect,restrictTo('user'),cancelBooking);

module.exports = router;