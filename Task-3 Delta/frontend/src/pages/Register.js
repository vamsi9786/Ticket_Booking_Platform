import { useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Register() {
    const [form, setForm] = useState({ name:'',email: '', password: '',role: 'user' });
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await API.post('/auth/register', form);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message ||'Registration failed. Please try again.');
        }
    };

    return (
        <div className='login-container'>
        <form onSubmit={handleSubmit} className="login-form">
            <h2 style={{marginTop:'0px',position:'relative',left:'100px',marginBottom:'5px'}}>Register</h2>
            <hr style={{height:'1px',backgroundColor:'#ffffff',border:'none',width:'300px',marginTop:'0px'}}/>
            <label>Name:</label>
            <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
            />
            <label>Email:</label>
            <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
            />
            <label>Password:</label>
            <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
            />
            <div style={{position:'relative',left:'0px'}}><label>Role:</label>
            <select style={{position:'relative',left:'70px'}}onChange={e => setForm({ ...form, role: e.target.value })}>
                <option value="user">User</option>
                <option value="vendor">Vendor</option>
                <option value="admin">Admin</option>
            </select></div>

            <button className='btn' style={{paddingTop:'7px',paddingBottom:'7px'}} type="submit">Register</button>
            {error && <p className="error">{error}</p>}
        </form>
        </div>
    );
};