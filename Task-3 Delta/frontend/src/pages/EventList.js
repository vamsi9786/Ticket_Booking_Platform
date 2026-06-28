import { useEffect, useState } from 'react';
import API from '../services/api';
import { Link ,useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function EventList() {
    const { user} = useAuth();
    const [events, setEvents] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [type,setType]=useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                API.get(`/events${type? `?type=${type}`:''}`).then(res => (setEvents(res.data ) || []));
                setLoading(false);
                setError('');
            } catch (err) {
                setError(err.response?.data?.message ||'Failed to fetch events. Please try again later.');
            } 
        };

        fetchEvents();
    }, [type]);
    
    if (loading) {
        return <div>Loading events...</div>;
    }

    return (
        <div className='events-listpage' style={{minHeight:user?'89.8vh':'91.3vh'}}>
            <div className='events-header'>
                <h1 style={{position:'relative',left:'710px',width:'105px'}} className='head'>Events</h1>
                <label htmlFor='filter'  style={{color:'whitesmoke',position:'relative',left:'550px',paddingBottom:'4px',fontWeight:'600'}}>Filter</label>
                <select className='slctbtn' style={{position:'relative',left:'-100px'}} onChange={(e)=>setType(e.target.value)}>
                    <option value=''>All</option>
                    <option value='movie'>Movie</option>
                    <option value='concert'>Concert</option>
                    <option value='train'>Train</option>
                </select>
            </div>

            {error && <p className="error">{error}</p>}

            <div className="event-list">
                {!error && events.length===0 && (<><img src='/notFound.png' style={{marginTop:'20px'}} className='imgtoshow'/><p>No Events Available...</p></>)}
                {events.map(event => (
                    <div key={event._id} className={(type==='')?"eventListall":"eventList"}>

                        {event.type==='train'&&<div className={(type==='train')?'traindiv':'all'}>
                            {type==='' &&<div style={{fontSize:'1.3rem',display:'flex',justifyContent:'center',fontWeight:'bold'}}>TRAIN</div>}
                            {type==='' && <img src='/trainLogo.png' style={{height:'100px',marginTop:'10px',borderRadius:'8px'}}/>}
                            {type==='train' && <img src='/trainLogo2.png' style={{borderRadius:'8px',height:'150px'}}/>}
                            <h3><strong>{event.title}</strong></h3>

                            <div className='srcdiv'><h4><strong>Source:</strong>{event.source}</h4>
                                <h4><strong>Start Date:</strong>{event.date}</h4>
                                <h4><strong>Start Time:</strong>{event.time}</h4></div>

                            <div className='destdiv'><h4><strong>Destination:</strong>{event.destination}</h4>
                            <h4><strong>End Date:</strong>{event.enddate}</h4>
                            <h4><strong>End Time:</strong>{event.endtime}</h4></div>

                            <div className='trainpricediv'>
                                <h4><strong>Price:</strong>{event.price}</h4>
                                <h4><strong>Seats Availabe:</strong>{event.seats}</h4>
                                {!user && <button className='btn' onClick={()=>navigate(`/events/${event._id}`)} >BOOK NOW</button>}
                                {user&& user.role==='user' && <button className='btn' onClick={()=>navigate(`/events/${event._id}`)} >BOOK NOW</button>}
                            </div>
                        </div>}

                        {event.type==='concert'&&<div className={(type==='concert')?'concertdiv':'all'}>
                            <div style={{fontSize:'1.3rem',display:'flex',justifyContent:'center',fontWeight:'bold'}}>CONCERT</div>
                            <img src={`${process.env.REACT_APP_API_URL}/uploads/avatars/${event.poster}`} style={{height:'200px',marginTop:'10px',borderRadius:'12px'}}/>
                            <h3><strong>{event.title}</strong></h3>
                            <div className='concertpricediv'>
                                <h4><strong>Date:</strong>{event.date}</h4>
                                <h4><strong>Time:</strong>{event.time}</h4>
                                <h4><strong>Place:</strong>{event.place}</h4>
                                <h4><strong>Price:</strong>{event.price}</h4>
                                <h4><strong>Seats Availabe:</strong>{event.seats}</h4>
                                {!user && <button className='btn' onClick={()=>navigate(`/events/${event._id}`)} >BOOK NOW</button>}
                                {user&& user.role==='user' && <button className='btn' onClick={()=>navigate(`/events/${event._id}`)} >BOOK NOW</button>}
                            </div>
                        </div>}

                        {event.type==='movie'&&<div className={(type==='movie')?'moviediv':'all'}>
                            <div style={{fontSize:'1.3rem',display:'flex',justifyContent:'center',fontWeight:'bold'}}>MOVIE</div>
                            <img src={`${process.env.REACT_APP_API_URL}/uploads/avatars/${event.poster}`} style={{
                                height:'300px',
                                objectFit: 'cover',
                                marginTop:'10px',borderRadius:'12px'
                            }} onError={(e)=>(e.target.src='/movieLogo.jpg')} alt="Poster"  />
                            <h3><strong>{event.title}</strong></h3>
                            <div className='moviepricediv'>
                                <h4><strong>Place:</strong>{event.place}</h4>
                                <h4><strong>Price:</strong>{event.price}</h4>
                                {!user && <button className='btn' onClick={()=>navigate(`/events/${event._id}`)} >BOOK NOW</button>}
                                {user&& user.role==='user' && <button className='btn' onClick={()=>navigate(`/events/${event._id}`)} >BOOK NOW</button>}
                            </div>
                        </div>}

                    </div>
                ))}
            </div>
        </div>
    );
}
