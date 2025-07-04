const router = require('express').Router();
const { protect } = require('../middleware/auth');
const upload=require('../middleware/upload');

const {getEvents,getEvent,createEvent,updateEvent,deleteEvent} = require('../controllers/eventcontroller');

router.get('/', getEvents);
router.get('/:id', getEvent);
router.post('/', protect,upload.single('poster'), createEvent);
router.delete('/:id', protect, deleteEvent);
router.put('/:id', protect, updateEvent);

module.exports = router;