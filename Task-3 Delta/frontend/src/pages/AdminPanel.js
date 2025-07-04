import { useEffect, useState } from "react"; 
import API from "../services/api";

export default function AdminPanel() {
    const [users, setUsers] = useState([]);
    const [events, setEvents] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const [canuserloading, setcanuserLoading] = useState(null)
    const [caneveloading, setcaneveLoading] = useState(null);
    const [canbookloading, setcanbookLoading] = useState(null);

    const fetchAllData = async () => {
        try {
            const [u, e, b] = await Promise.all([
                API.get('/admin/users'),
                API.get('/admin/events'),
                API.get('/admin/bookings')
            ]);
            setUsers(u.data);
            setEvents(e.data);
            setBookings(b.data);
            setLoading(false);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message ||'Failed to fetch data.');
        }
    }

    useEffect(() => {
        fetchAllData();
    }, []);

    const handleDeleteUser = async (id) => {
        try {
            setcanuserLoading(true);
            await API.delete(`/admin/users/${id}`);
            setUsers(users.filter(user => user._id !== id));
            setError(null);
            setcanuserLoading(false);
            alert('User deleted successfully!');
            fetchAllData();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete user.');
        }
    };

    const handleDeleteEvent = async (id) => {
        try {
            setcaneveLoading(true);
            await API.delete(`/admin/events/${id}`);
            setEvents(events.filter(event => event._id !== id));
            setError(null);
            setcaneveLoading(false);
            alert('Event deleted successfully!');
            fetchAllData();
        } catch (err) {
            setError(err.response?.data?.message ||'Failed to delete event.');
        }
    }

    const handleDeleteBooking= async (id)=>{
        try{
            setcanbookLoading(true);
            await API.delete(`admin/bookings/${id}`);
            setBookings(bookings.filter(booking => booking._id !==id))
            setError(null);
            setcanbookLoading(false);
            alert("Booking Deleted Successfully");
            fetchAllData();
        }catch(e){
            setError(e.response?.data?.message ||"Failed to delete Booking")
        }
    }

    return (
        <div className="admin-panel-page">
            {loading && <img src='/loading.png' className='imgtoshow' style={{marginTop:'10px'}}/>}
            <h1 className="head" style={{width:'200px',position:'relative',left:'650px',marginTop:'0px',top:'10px'}}>Admin Panel</h1>
            {error && <p className="error">{error}</p>}

            <div className='event-card-page'>
                <h2 className="head" style={{width:'95px',position:'relative',left:'700px',textAlign:'center',paddingRight:'5px'}}>Events</h2>
                
                {events.length===0?<img src='/notFound.png' className='imgtoshow' style={{marginTop:'10px'}}/>:<>{events.map(event => (
                    <div key={event._id} className="event-card" style={{marginLeft:'25px'}}>
                        {event.type==='train'&&<div className='all'>
                            <div style={{fontSize:'1.3rem',display:'flex',justifyContent:'center',fontWeight:'bold'}}>TRAIN</div>
                            <img src='/trainLogo.png' style={{height:'100px',marginTop:'10px',borderRadius:'8px'}}/>
                            
                            <h3><strong>{event.title}</strong></h3>

                            <h4><strong>Source:</strong>{event.source}</h4>
                            <h4><strong>Start Date:</strong>{event.date}</h4>
                            <h4><strong>Start Time:</strong>{event.time}</h4>

                            <h4><strong>Destination:</strong>{event.destination}</h4>
                            <h4><strong>End Date:</strong>{event.enddate}</h4>
                            <h4><strong>End Time:</strong>{event.endtime}</h4>

                            
                            <h4><strong>Price:</strong>{event.price}</h4>
                            <h4><strong>Seats Availabe:</strong>{event.seats}</h4>
                            <button className='btn' onClick={() => handleDeleteEvent(event._id)}>Delete Event</button>
                            
                        </div>}

                        {event.type==='concert'&&<div className='all'>
                            <div style={{fontSize:'1.3rem',display:'flex',justifyContent:'center',fontWeight:'bold'}}>CONCERT</div>
                            <img src={`http://localhost:4000/uploads/avatars/${event.poster}`} style={{height:'200px',marginTop:'10px',borderRadius:'12px'}}/>
                            <h3><strong>{event.title}</strong></h3>
                            
                            <h4><strong>Date:</strong>{event.date}</h4>
                            <h4><strong>Time:</strong>{event.time}</h4>
                            <h4><strong>Place:</strong>{event.place}</h4>
                            <h4><strong>Price:</strong>{event.price}</h4>
                            <h4><strong>Seats Availabe:</strong>{event.seats}</h4>
                            <button className='btn' onClick={() => handleDeleteEvent(event._id)}>Delete Event</button>
                            
                        </div>}

                        {event.type==='movie'&&<div className='all'>
                            <div style={{fontSize:'1.3rem',display:'flex',justifyContent:'center',fontWeight:'bold'}}>MOVIE</div>
                            <img src={`http://localhost:4000/uploads/avatars/${event.poster}`} style={{
                                height:'300px',
                                objectFit: 'cover',
                                marginTop:'10px',borderRadius:'12px'
                            }} onError={(e)=>(e.target.src='/movieLogo.jpg')} alt="Poster" />
                            <h3><strong>{event.title}</strong></h3>
                            
                            <h4><strong>Place:</strong>{event.place}</h4>
                            <h4><strong>Price:</strong>{event.price}</h4>
                            <button className='btn' onClick={() => handleDeleteEvent(event._id)}>Delete Event</button>
                            
                        </div>}
                    </div>
                ))}
                {caneveloading && <p className="head" style={{width:'300px',textAlign:'center',position:'relative',left:'620px'}}>Event Cancellation in Progress</p>}
                </>}
            </div>
            <div className="event-card-page">
                <h2 className="head" style={{width:'95px',position:'relative',left:'710px',textAlign:'center',paddingRight:'5px'}}>Users</h2>
                {users.length===0?<img src='/notFound.png' className='imgtoshow' style={{marginTop:'10px'}}/>:<>{users.map(user => (
                    <div key={user._id} className="event-card">
                        <h4><strong>Username: </strong>{user.name}</h4>
                        <h4><strong>Email: </strong>{user.email}</h4>
                        <h4><strong>Role: </strong>{user.role}</h4>
                        <button className="btn" onClick={() => handleDeleteUser(user._id)}>Delete User</button>
                    </div>
                ))}</>}
                {canuserloading && <p className="head" style={{width:'300px',textAlign:'center',position:'relative',left:'620px'}}>User Deletion in Progress</p>}
            </div>
            
            <div className="event-card-page">
                <h2 className="head" style={{width:'105px',position:'relative',left:'715px',textAlign:'center',paddingRight:'5px',marginBottom:'0px'}}>Bookings</h2>
                {bookings.length===0?<img src='/notFound.png' className='imgtoshow' style={{marginTop:'10px'}}/>:<>{bookings.map(booking => (
                    <div key={booking._id} className="event-card">
                        <h4><strong>Username: </strong>{booking.user?.name}</h4>
                        <h4><strong>Event Title: </strong>{booking.event?.title}</h4>
                        <h4><strong>Quantity: </strong>{booking.quantity}</h4>
                        <h4><strong>Total Price: </strong>{booking.totalPrice}</h4>
                        <button className="btn" onClick={() => handleDeleteBooking(booking._id)}>Delete Booking</button>
                    </div>
                ))}</>}
                {canbookloading && <p className="head" style={{width:'300px',textAlign:'center',position:'relative',left:'620px'}}>Booking Cancellation in Progress</p>}
            </div>
        </div>
    );
}