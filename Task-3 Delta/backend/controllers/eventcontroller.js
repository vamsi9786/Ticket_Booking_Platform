const Event= require('../models/Event');

exports.getEvents = async (req, res) => {
    try {
        const filter={};
        if(req.query.type){
            filter.type=req.query.type;
        }
        const events = await Event.find(filter);
        // if (!events || events.length === 0) {
        //     return res.status(404).json({ message: 'No events found' });
        // }
        res.status(200).json(events);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

exports.getEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.status(200).json(event);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

exports.createEvent = async (req, res) => {
    try {

        const {
            title,
            type,
            date,
            enddate,
            time,
            endtime,
            showLength,
            place,
            price,
            seats,
            source,
            destination,
        }=req.body;

        const shows=req.body.shows ? JSON.parse(req.body.shows) : undefined;
        const poster= req.file? req.file.filename : null;

        const newEvent={
            title,
            type,
            vendor: req.user._id,
            price,
            poster,
        };

        if(type==='concert'){
            newEvent.date=date;
            newEvent.time=time;
            newEvent.seats=seats;
            newEvent.place=place;
        }else if(type==='train'){
            newEvent.date=date;
            newEvent.time=time;
            newEvent.enddate=enddate;
            newEvent.endtime=endtime;
            newEvent.source=source;
            newEvent.destination=destination;
            newEvent.seats=seats;
        } else if(type==='movie'){
            newEvent.place=place;
            newEvent.showLength=showLength;
            newEvent.shows=shows;
        }

       const event = await Event.create(newEvent);
        res.status(201).json(event);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

exports.updateEvent= async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.status(200).json(event);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

exports.deleteEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}