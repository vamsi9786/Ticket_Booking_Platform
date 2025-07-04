import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [form,setForm] = useState({ email: '', password: '' });
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const { data } = await API.post('/auth/login', form);
            login(data);
            navigate('/');
        } catch (err) {
            if(err.response && err.response.data && err.response.data.message){
                setError(err.response.data.message);
            }
            else{
                setError('Login failed. Please check your credentials.');
            }
        }
    }

    return(
        <div className='login-container'>
            <form onSubmit={handleSubmit} className="login-form">
            <h2 style={{marginTop:'0px',position:'relative',left:'110px',color:'#ffffff',marginBottom:'5px'}}>Login</h2>
            <hr style={{height:'1px',backgroundColor:'#ffffff',border:'none',width:'300px',marginTop:'0px'}}/>
            {error && <p className="error">{error}</p>}

            <label>Email:</label>
            <input
                type="email"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                value={form.email}
                required
            />

            <label>Password:</label>
            <input
                type="password"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                value={form.password}
                required
            />
            <button className='btn' style={{marginTop:'20px'}} type="submit">Login</button>  
            <a className='for-link' href='/forgot-password'>Forgot Password</a>
            <p className='reg-link'>Don't have an account?<a href='/register'> Register</a></p>  
        </form>
         </div>
    );
};
