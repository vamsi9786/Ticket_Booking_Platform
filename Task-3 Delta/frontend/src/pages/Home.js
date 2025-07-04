import React from "react";
import { Link , useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate('/login');
    };

    const handleRegister = () => {
        navigate('/register');
    };

    return (
        <div className="home-container">
            <div className="home-inside">
                <div className="home-con">
                    <h1 style={{marginBottom:'0px'}}>Welcome to Event Booking</h1>
                    <p>Your one-stop solution for booking events online.</p>
                    {!user && (
                        <button className="btn" style={{width:'250px',position:'relative',left:'110px',padding:'10px'}} onClick={handleLogin}>
                            Login to Book Events
                        </button>
                    )}

                    {!user && (
                        <button className="btn" style={{width:'250px',position:'relative',left:'110px',padding:'10px'}} onClick={handleRegister}>
                            Not a member? Register Now
                        </button>
                    )}

                    <div className="home-links">
                        <Link className="home-link" style={{position:'relative',left:'0px',top:'20px'}} to="/events">View Events</Link>
                    </div>

                    {user && (<div style={{position:'relative',top:'60px'}}>
                        <p style={{margin:'0px',padding:'0px'}}>Hassle-free ticketing</p>
                        <p style={{margin:'0px',padding:'0px'}}>{'🔥'} 1200+ events live • {'🧑‍🤝‍🧑'} 50k+ happy users </p>
                        <p style={{margin:'0px',padding:'0px'}}>🎟 Book your next <strong>🎬 movie • </strong> <strong>🎤 concert • </strong> <strong>💺train</strong> now!</p>
                        </div>
                    )}

                    {!user && (<div style={{position:'relative',top:'35px'}}>
                        <p style={{margin:'0px',padding:'0px'}}>Hassle-free ticketing</p>
                        <p style={{margin:'0px',padding:'0px'}}>{'🔥'} 1200+ events live • {'🧑‍🤝‍🧑'} 50k+ happy users </p>
                        <p style={{margin:'0px',padding:'0px'}}>🎟 Book your next <strong>🎬 movie • </strong> <strong>🎤 concert • </strong> <strong>💺train</strong> now!</p>
                        </div>
                    )}

                    {user && (
                        <blockquote style={{position:'relative',top:'70px'}}>
                            "Booking tickets has never been easier!
                            Love this app."
                            <footer> - A happy User</footer>
                        </blockquote>
                    )}

                    

                </div>
            </div>
        </div>
    );
}

export default Home;

