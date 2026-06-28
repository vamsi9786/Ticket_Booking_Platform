import { useEffect, useState } from 'react';
import API from '../services/api';

export default function DashboardPage() {
    const [event, setEvent] = useState([]);
    const[booking,setBooking]=useState([]);
    const [newevent, setnewevent]=useState({type:'movie'});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [shows,setShows]=useState([]);
    const[currentDate,setCurrentDate]=useState('');
    const[currentTime,setCurrentTime]=useState('');
    const [currentSeats,setCurrentSeats]=useState('');
    const [poster,setPoster]=useState(null);

    const [caneveloading, setcaneveLoading] = useState(null);
    const [canbookloading, setcanbookLoading] = useState(null);

    const fetchMyEvents = async () => {
        try {
            const response = await API.get('/dashboard/events');
            setEvent(response.data.events || []);
            setLoading(false);
            if (response.data.length === 0) {
                setError('No events found.');
            } else {
                setError(null);
            }
        } catch (err) {
            setError(err.response?.data?.message ||'Failed to fetch events. Please try again later.');
        }
    }

    const fetchMyBookings= async ()=>{
        try {
            const response = await API.get('/dashboard/bookings');
            setBooking(response.data.bookings || []);
            setLoading(false);
            if (response.data.length === 0) {
                setError('No Bookings found.');
            } else {
                setError(null);
            }
        } catch (err) {
            setError(err.response?.data?.message ||'Failed to fetch Bookings. Please try again later.');
        }
    }

    const handleAddShowTime=()=>{
        if(!currentDate || !currentTime || !currentSeats) return;

        const seatNum= parseInt(currentSeats);
        const timeObj={time:currentTime,seats:seatNum};
        
        const existingDate= shows.find(s=>s.date===currentDate);
        if(existingDate){
            existingDate.startTimes.push(timeObj);
            setShows([...shows]);
        }
        else{
            setShows([...shows,{date:currentDate,startTimes:[timeObj]}])
        }
        setCurrentTime('');
        setCurrentDate('');
        setCurrentSeats('');
    }
    
    useEffect(() => {
        fetchMyEvents();
        fetchMyBookings();
    }, []);

    const handleDeleteBooking= async (id)=>{
        try{
            setcanbookLoading(true);
            await API.delete(`dashboard/bookings/${id}`);
            setBooking(booking.filter(booking => booking._id !==id))
            setError(null);
            alert("Booking Deleted Successfully");
            setcanbookLoading(false);
            fetchMyBookings();
        }catch(e){
            setError(e.response?.data?.message ||"Failed to delete Booking")
        }
    }

    const handleDeleteEvent = async (id) => {
        try {
            setcaneveLoading(true);
            await API.delete(`/dashboard/events/${id}`);
            setEvent(event.filter(event => event._id !== id));
            setError(null);
            setcaneveLoading(false);
            alert('Event deleted successfully!');
            fetchMyEvents();
        } catch (err) {
            setError(err.response?.data?.message ||'Failed to delete event.');
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data= new FormData();

        for(const key in newevent){
            data.append(key,newevent[key])
        }

        if(newevent.type==='movie'){
            data.append('shows',JSON.stringify(shows));
        }

        if(poster){
            data.append('poster',poster);
        }

        try{
            await API.post('/events', data);
            alert('Event created successfully!');
            setError(null);
            setnewevent({});
            setShows([]);
            const response= await API.get('/dashboard/events');
            setEvent(response.data.events || []);
        }catch(err){
            setError(err.response?.data?.message || 'Failed to create Event')
        }
    };

    // if (loading) {
    //     return <div>Loading...</div>;
    // }

    return (
        <div className="dashboard-page">
            <div className='form-cont'>
            <form className='vendor-form' onSubmit={handleSubmit}>
                <h1 style={{textAlign:'center',position:'relative',marginBottom:'5px'}}>Create Event</h1>
                <hr style={{height:'1px',backgroundColor:'#ffffff',border:'none',width:'300px',marginTop:'0px'}}/>
                <div>
                    <div style={{display:'flex',alignItems:'center',marginTop:'20px'}}>
                        <label style={{color:'whitesmoke',paddingBottom:'4px',fontWeight:'600',width:'100px',marginTop:'0px',position:'relative',left:'120px'}}>Type:</label>
                        <select style={{position:'relative',left:'80px'}}  value={newevent.type}onChange={e => setnewevent({ ...newevent, type: e.target.value })}>
                            <option value="movie">Movie</option>
                            <option value="concert">Concert</option>
                            <option value="train">Train</option>
                        </select>
                    </div>
                    {newevent.type!=='train' && (<>
                        <div style={{display:'flex',alignItems:'center',marginTop:'20px'}}>
                            <label style={{color:'whitesmoke',paddingBottom:'4px',width:'50px',marginTop:'0px',}}>Poster:</label>
                            <input style={{border:'none',background:'none',backdropFilter:'none'}} type='file' accept='image/*' onChange={(e)=>setPoster(e.target.files[0])} />
                        </div>

                        {poster &&<div>
                        <img className='poster'
                        src={URL.createObjectURL(poster)}
                        alt="Preview"
                        style={{height:'200px'}}
                        />
                        </div>}
                    </>)}
                    
                    <br/>

                    <label>Title:</label>
                    <input placeholder='Title' required onChange={e=> setnewevent({ ...newevent, title: e.target.value })} />

                    <label>Price:</label>
                    <input placeholder='Price' required onChange={e=> setnewevent({ ...newevent, price: e.target.value })} />

                    {newevent.type === 'train' && <label>Source:</label>}
                    {newevent.type === 'train' && <input placeholder='source' required onChange={e=> setnewevent({...newevent, source: e.target.value})} />}

                    {newevent.type ==='concert' && <label>Date:</label>}
                    {newevent.type ==='train' && <label>Start Date:</label>}
                    {newevent.type !=='movie' && <input placeholder='Date' required onChange={e=> setnewevent({ ...newevent, date: e.target.value })} />}

                    {newevent.type ==='concert' && <label>Time:</label>}
                    {newevent.type ==='train' && <label>Start Time:</label>}
                    {newevent.type !=='movie' &&<input placeholder='HH:MM'required onChange={e=>setnewevent({ ...newevent, time:e.target.value })}/>}

                    {newevent.type === 'train' && <label>Destination:</label>}
                    {newevent.type === 'train' && <input placeholder='destination' required onChange={e=> setnewevent({...newevent, destination: e.target.value})} />}

                    {newevent.type ==='train' && <label>End Date:</label>}
                    {newevent.type ==='train' && <input placeholder='End Date' required onChange={e=> setnewevent({ ...newevent, enddate: e.target.value })} />}

                    {newevent.type ==='train' && <label>End Time:</label>}
                    {newevent.type ==='train' &&<input placeholder='HH:MM' required onChange={e=>setnewevent({...newevent,endtime:e.target.value})}/>}


                    {newevent.type ==='movie' && <label>Show Length:</label>}
                    {newevent.type ==='movie' && <input placeholder='Length' required onChange={e=> setnewevent({ ...newevent, showLength: e.target.value })} />}

                    {newevent.type !=='train' && <label>Place:</label>}
                    {newevent.type !=='train' && <input placeholder='Place' required onChange={e=> setnewevent({ ...newevent, place: e.target.value })} />}


                    {newevent.type !== 'movie' && <label>Quantity:</label>}
                    {newevent.type !== 'movie' && <input required onChange={e=> setnewevent({ ...newevent, seats: e.target.value })} />}

                    {newevent.type==='movie' && (
                        <div>
                            <label>Show Date:</label>
                            <input
                                placeholder='DD-MM-YYYY'
                                value={currentDate}
                                onChange={e=>setCurrentDate(e.target.value)}
                                required
                            />

                            <label>Start Time:</label>
                            <input
                                placeholder='HH:MM'
                                value={currentTime}
                                onChange={e=>setCurrentTime(e.target.value)}
                                required
                            />

                            <label>Seats:</label>
                            <input
                                placeholder='Seats'
                                type='number'
                                value={currentSeats}
                                onChange={e=>setCurrentSeats(e.target.value)}
                                required
                            />

                            <button type='button' className='btn' style={{position:'relative',left:'150px'}} onClick={handleAddShowTime}>Add Show</button>

                            <div>
                                <h4>Added Shows:</h4>
                                <ul>
                                    {shows.map((s,idx)=>(
                                        <li key={idx}>
                                            <strong>{s.date}</strong>:{s.startTimes.map((t,i)=>(
                                                <span key={i}>
                                                    {t.time} ({t.seats}Seats)
                                                    {i!==s.startTimes.length-1 && ', '}
                                                </span>
                                            ))}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}

                </div>
                <button className='btn' style={{position:'relative',left:'145px'}} type="submit">Create Event</button>

                {error && <p className="error">{error}</p>}
            </form>
            </div>

            {loading?(<img src='/loading.png' className='imgtoshow'/>):(
                <div className='event-card-page'>
                    <h2 className='head' style={{position:'relative',left:'680px',width:'140px'}}>Your Events </h2>
                    {event.length===0 ? (
                        <img src='/notFound.png' className='imgtoshow'/>
                    ):(
                        <div className='event-card-list'>
                            
                                {event.map((event,i)=>(
                                    <div key={i} className='event-card'>
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
                                            <img src={`${process.env.REACT_APP_API_URL}/uploads/avatars/${event.poster}`} style={{height:'200px',marginTop:'10px',borderRadius:'12px'}}/>
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
                                            <img src={`${process.env.REACT_APP_API_URL}/uploads/avatars/${event.poster}`} style={{
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
                            
                        </div>
                    )}
                    {caneveloading && <p className="head" style={{width:'300px',textAlign:'center',position:'relative',left:'620px'}}>Event Cancellation in Progress</p>}
                </div>
            )}
            <div className="event-card-page" style={{paddingBottom:'0px'}}>
                <h2 className='head' style={{position:'relative',left:'710px',width:'110px'}}>Bookings</h2>
                {booking.length===0?(
                    <img src='/notFound.png' className='imgtoshow'/>
                ):(<div style={{paddingBottom:'0px'}}>{booking.map((b,id)=> (
                    <div key={id} className="event-card">
                        <h4><strong>Username: </strong>{b.user?.name}</h4>
                        <h4><strong>Event Title: </strong>{b.event?.title}</h4>
                        <h4><strong>Quantity: </strong>{b.quantity}</h4>
                        <h4><strong>Total Price: </strong>{b.totalPrice}</h4>
                        <button className='btn' onClick={() => handleDeleteBooking(b._id)}>Delete Booking</button>
                    </div>
                ))}</div>)}
                {canbookloading && <p className="head" style={{width:'300px',textAlign:'center',position:'relative',left:'620px'}}>Booking Cancellation in Progress</p>}
            </div>
        </div>
    );
}
