import React from 'react';
import { Link , useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error('Failed to log out:', error);
        }
    };

    return (
        <nav className="navbar">
            <div className="container-fluid">
                <Link to='/'><img className='navbar-brand' src='/BookingAppLogo.png'/></Link>

                <div className="NavComp" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        {user ? (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" style={{position:'relative',left:'-30px'}} to="/">Home</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" style={{position:'relative',left:'-30px'}} to="/events">Events</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" style={{position:'relative',left:'-30px'}} to="/profile">Profile</Link>
                                </li>
                                {user.role === 'admin' && (
                                    <li className="nav-item">
                                        <Link className="nav-link" style={{position:'relative',left:'-30px'}} to="/admin">Admin Panel</Link>
                                    </li>
                                )}
                                {user.role === 'vendor' && (
                                    <li className="nav-item">
                                        <Link className="nav-link" style={{position:'relative',left:'-30px'}} to="/dashboard">Dashboard</Link>
                                    </li>
                                )}
                                {user.role === 'user' &&
                                    (<li className="nav-item">
                                    <Link className="nav-link" style={{position:'relative',left:'-30px'}} to="/bookings">Bookings</Link>
                                </li>)}
                                <li className="nav-item">
                                    <Link className="nav-link" style={{position:'relative',left:'-30px'}} onClick={handleLogout}>Logout</Link>
                                </li>
                                <Link to='/profile' style={{position:'relative',left:'-30px'}}>
                                <img
                                    src={`${process.env.REACT_APP_API_URL}${user.avatar}`} 
                                    onError={(e)=>(e.target.src='https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg')}
                                    style={{height:'50px',width:'50px',borderRadius:'50%',border:'1px solid rgba(0,0,0,0.175)'}}
                                /></Link>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" style={{position:'relative',top:'-4px',left:'90px'}} to="/">Home</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" style={{position:'relative',top:'-4px',left:'100px'}} to="/events">Events</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" style={{position:'relative',top:'-4px',left:'110px'}} to="/login">Login</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" style={{position:'relative',top:'-4px',left:'120px'}} to="/register">Register</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
                <hr/>
            </div>
        </nav>
    )
};

export default Navbar;
