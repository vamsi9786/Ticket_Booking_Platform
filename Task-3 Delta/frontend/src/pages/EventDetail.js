import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

export default function EventDetail() {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [selectedShow,setSelectedShow]=useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await API.get(`/events/${id}`);
                setEvent(response.data);
                setLoading(false);
                setError("");
            } catch (err) {
                setError(err.response?.data?.message ||"Failed to fetch event details. Please try again later.");
            }
        };

        fetchEvent();
    }, [id]);

    const handleShowSelect=(date,timeObj)=>{
        setSelectedShow({date,time:timeObj.time,seats:timeObj.seats})
        setQuantity(1);
        setError('');
    };



    const handleBook= () => {
        if(event.type==='movie'){
            if(!selectedShow){
                setError("Please select a Show...");
                // navigate(`/events/${id}`)
                return;
            }
            if(quantity>selectedShow.seats){
                setError("Not enough seats available.");
                return;
            }
            navigate(`/summary/${id}`, { state: { quantity, showDate:selectedShow.date, showTime:selectedShow.time } });
        }
        else{
            if (event.seats < quantity) {
                setError("Not enough seats available.");
                return;
            }
            navigate(`/summary/${id}`, { state: { quantity } });
        }
    };

    if (error) {
        return <p className="error">{error}</p>;
    }

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="evntdtail" >
        <div className={(event.type==='train')?'':"event-detail"}>
            {event.type==='train' && <h1 className="head" style={{position:'relative',width:'210px',left:'650px',marginTop:'0px',paddingLeft:'25px',top:'10px'}}>Event Detail</h1>}
            {event.type!=='train' && <h1 className="head" style={{position:'relative',width:'210px',left:'95px',marginTop:'0px',paddingLeft:'0px',top:'10px'}}>Event Detail</h1>}

            {event ? (<div className={event.type==='train'?'':'moviediv'}>
            {event.type!=="train"&&<h2>{event.title}</h2>}
            {event.type!=="train"&&<img src={`http://localhost:4000/uploads/avatars/${event.poster}`} style={{borderRadius:'12px'}} />}
            {event.type==="concert"&&<h3>Date: {event.date}</h3>}
            {event.type==="concert"&&<h3>Starts From: {event.time}</h3>}
            {event.type!=="train"&&<h3>Place: {event.place}</h3>}

            {/* {event.type==="train" && (<>
            <h2>{event.title}</h2>
            <h4>{event.source} to {event.destination}</h4>
            <h4>Source: {event.source}</h4>
            <h4>Start Date: {event.date}</h4>
             <h4>Start Time: {event.time}</h4>
             <h4>Destination: {event.destination}</h4>
             <h4>End Date: {event.enddate}</h4>
             <h4>End Time: {event.endtime}</h4></>)} */}
            
            {event.type==='train'&&
            <div className='traindiv'>
                <img src='/trainLogo2.png' style={{borderRadius:'8px',height:'150px'}}/>
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
                    <label><strong>Quantity:</strong></label>
                    <input className="inpt"
                        type="number"
                        min="1"
                        max={event.seats}
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))} 
                    />
                    <br/>
                    <button className='btn'onClick={handleBook}>Continue</button>
                </div>
            </div>}


            {event.type!=='train' &&<h3>Price: {event.price}</h3>}
            {event.type==='concert' && <h4>Seats Availabe: {event.seats}</h4>}

            {event.type==='movie' && (
            <div className="show-list">
                <h3 style={{margin:'10px'}}>Availabe Shows</h3>
                {event.shows.length===0 && <p>No Shows Available...</p>}
                    {event.shows.map((show,i)=>{
                        return (
                        <div key={i}>
                            <h4 style={{margin:'2px'}}>{show.date}</h4>
                            {show.startTimes.map((timeObj,j)=>{
                                const isSelected=selectedShow && selectedShow.date===show.date && selectedShow.time===timeObj.time;
                                return(
                                    <button key={j} className="btn" style={{height:'30px',backgroundColor:isSelected?'#dc635b':' rgba(255,255,255,0.1)',color:'whitesmoke'}} onClick={()=>handleShowSelect(show.date,timeObj)}>{timeObj.time} {timeObj.seats}</button>
                                )
                            })}
                            
                        </div>)
                    })}
            </div>)}

            {event.type!=='train'&&<><label style={{margin:'10px'}}><strong>Quantity:</strong></label>
            <input
                className="inpt"
                style={{margin:'10px'}}
                type="number"
                min="1"
                max={event.seats}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))} 
            />
            <br/>
            <button className='btn'onClick={handleBook}>Continue</button></>}
            </div>): (<p>Loading...</p>)}
        </div>
        </div>
    );
}