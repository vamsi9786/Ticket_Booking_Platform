import { useEffect, useState } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function BookingHistory() {
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [canloading, setcanLoading] = useState(null);
    const { user, setUser }=useAuth();

    const fetchBookings = async () => {
        try {
            const response = await API.get('/bookings');
            setBookings(response.data);
            setLoading(false);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message ||'Failed to fetch booking history.');
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    // if (loading) {
    //     return <div>Loading booking history...</div>;
    // }

    if (error) {
        return <div className="error">{error}</div>;
    }

    // if (!bookings.length) {
    //     return <div>No bookings found.</div>;
    // }

    const cancelBooking = async (id) => {
        try {
            setcanLoading(true);
            const res=await API.delete(`/bookings/${id}`);
            setcanLoading(false);
            setUser(res.data.user);
            fetchBookings(); 
            alert('Booking cancelled successfully!');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to Cancel Booking');
        }
    }


    return (
        <div className="bookingHistory">
            <h1 className='head' style={{width:'270px',position:'relative',left:'625px',top:'20px',marginTop:'0px',paddingLeft:'20px'}}>Booking History</h1>
            {!error && loading && <img src='/loading.png' style={{marginTop:'20px'}} className='imgtoshow'/>}
            {!error && !loading&& bookings.length===0 && <img src='/notFound.png' style={{marginTop:'20px'}} className='imgtoshow'/>}
            <div className="event-list">
                {bookings.map((booking) => (
                    <div key={booking._id} className='eventListall' >
                        {booking.event?.type==='movie'&&<>
                            <div style={{fontSize:'1.3rem',display:'flex',justifyContent:'center',fontWeight:'bold'}}>MOVIE</div>
                            <img src={`http://localhost:4000/uploads/avatars/${booking?.event.poster}`} style={{
                                height:'200px',
                                objectFit: 'cover',
                                borderRadius:'12px',
                                marginTop:'15px'
                            }} onError={(e)=>(e.target.src='/movieLogo.jpg')} alt="Poster"  />
                            </>}
                        
                        {booking.event?.type==='train'&&<>
                            <div style={{fontSize:'1.3rem',display:'flex',justifyContent:'center',fontWeight:'bold'}}>TRAIN</div>
                            <img src='/trainLogo2.png' style={{borderRadius:'8px',height:'150px'}}/>
                            </>}
                        
                        {booking.event?.type==='concert'&&<>
                            <div style={{fontSize:'1.3rem',display:'flex',justifyContent:'center',fontWeight:'bold'}}>CONCERT</div>
                            <img src={`http://localhost:4000/uploads/avatars/${booking?.event.poster}`} style={{height:'200px',borderRadius:'12px',marginTop:'15px'}}/>
                            </>}
                        
                        <h2>{booking.event?.title}</h2>
                        {(booking.event?.type==='movie')&&<p><strong>Date:</strong> {booking.showDate}</p>}
                        {(booking.event?.type==='concert')&&<p><strong>Date:</strong> {booking.event?.date} </p>}
                        {(booking.event?.type==='concert')&&<p><strong>Starts From</strong> {booking.event?.time} onwards</p>}

                        {(booking.event?.type==='train')&&<>
                            <p><strong>Source:</strong> {booking.event?.source}</p>
                            <p><strong>Start Date:</strong> {booking.event?.date}</p>
                            <p><strong>Start Time:</strong> {booking.event?.time}</p>
                            <p><strong>Destination:</strong> {booking.event?.destination}</p>
                            <p><strong>End Date:</strong> {booking.event?.enddate}</p>
                            <p><strong>End Time:</strong> {booking.event?.endtime}</p>
                        </>}

                        {(booking.event?.type!=='train')&&<p><strong>Location:</strong> {booking.event?.place}</p>}

                        <p><strong>Qty:</strong> {booking.quantity}</p>
                        <p><strong>Total Price:</strong> {booking.totalPrice}</p>
                        <p><strong>Booking Date:</strong> {new Date(booking.createdAt).toLocaleDateString()}</p>
                        <p><strong>Status:</strong> {booking.status}</p>
                        <button className='btn' onClick={()=>cancelBooking(booking._id)}>Cancel</button>
                    </div>
                ))}
            </div>
            {canloading && <p className="head" style={{width:'300px',textAlign:'center',position:'relative',left:'620px',margin:'0px'}}>Cancelling in Progress</p>}
        </div>
    );
}