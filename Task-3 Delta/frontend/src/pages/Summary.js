import {  useLocation, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Summary() {
    const { id } = useParams();
    const { state } = useLocation();
    const navigate = useNavigate();
    const [event, setEvent] = useState([]);
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);
    const { user, setUser }=useAuth();

    useEffect(() => {
        if(!state){
            setError("No booking details provided.");
            return;
        }

        const fetchEvent = async () => {
            try {
                const response = await API.get(`/events/${id}`);
                setEvent(response.data);
            } catch (err) {
                setError(err.response?.data?.message ||"Failed to fetch event details.");
            }
        };

        fetchEvent();
    }, [id, state]);

    if(event.type==='movie' && (!state.showDate || !state.showTime)){
        return <div>Select Show Date & Time</div>
    }

    const confirmBooking = async () => {
        try {
            setLoading(true);
            const res=await API.post('/bookings', { 
            eventId: id,
            quantity: state.quantity,
            showDate: state.showDate,
            showTime: state.showTime,
            status: 'Successful',
        });
        alert('Booking Successful')
        setLoading(false);
        setUser(res.data.user)
        navigate('/bookings');} catch (err) {
            setError(err.response?.data?.message );
        }
    };

    const handleBack=(id)=>{
        navigate(`/events/${id}`);
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="bookingHistory">
            <h1 className="head" style={{width:'300px',position:'relative',left:'615px',top:'10px',marginTop:'0px',paddingLeft:'15px'}}>Booking Summary</h1>
            
            {event.type==='movie'&& (<div className="moviediv" style={{width:'350px',position:'relative',left:'565px'}}>
                <img src={`${process.env.REACT_APP_API_URL}/uploads/avatars/${event.poster}`} style={{borderRadius:'12px'}}/>
                <h2>{event.title}</h2>
                <p><strong>Show Date:</strong>{state.showDate}</p>
                <p><strong>Show Time:</strong>{state.showTime}</p>
                <p><strong>Place:</strong>{event.place}</p>
                <p><strong>Seats:</strong>{state.quantity}</p>
            </div>)}

            {event.type==='concert'&& (<div className="concertdiv" style={{width:'350px',position:'relative',left:'565px',height:'470px'}}>
                <img src={`${process.env.REACT_APP_API_URL}/uploads/avatars/${event.poster}`} style={{borderRadius:'12px'}} />
                <h2>{event.title}</h2>
                <p style={{position:'relative',left:'-12px'}}><strong>Concert Date:</strong>{event.date}</p>
                <p style={{position:'relative',left:'-32px'}}><strong>Concert Time:</strong>{event.time}</p>
                <p style={{position:'relative',left:'-55px'}}><strong>Place:</strong>{event.place}</p>
                <p style={{position:'relative',left:'-77px'}}><strong>Seats:</strong>{state.quantity}</p>
                <p style={{position:'relative',left:'-66px'}}><strong>Price:</strong>{event.price}</p>
            </div>)}

            {event.type==='train'&& (<div className="traindiv">
                <img src='/trainLogo2.png' style={{borderRadius:'8px',height:'150px'}}/>
                <h2>{event.title}</h2>
                <div>
                    <p><strong>Source:</strong>{event.source}</p>
                    <p><strong>Start Date:</strong>{event.date}</p>
                    <p><strong>Start Time:</strong>{event.time}</p>
                </div>

                <div>
                    <p><strong>Destination:</strong>{event.destination}</p>
                    <p><strong>End Date:</strong>{event.enddate}</p>
                    <p><strong>End Time:</strong>{event.endtime}</p>
                </div>
                
                <div>
                    <p><strong>Seats:</strong>{state.quantity}</p>
                    <p><strong>Price:</strong>{event.price}</p>
                </div>
            </div>)}
            
            <div>
                <button className="btn" style={{position:'relative',left:'680px'}} onClick={()=>handleBack(event._id)}>Go Back</button>
                <button className="btn" style={{position:'relative',left:'700px'}} onClick={confirmBooking}>Confirm</button>
            </div>
            {loading && <p className="head" style={{width:'300px',textAlign:'center',position:'relative',left:'620px'}}>Booking in Progress</p>}
        </div>
    );
};
