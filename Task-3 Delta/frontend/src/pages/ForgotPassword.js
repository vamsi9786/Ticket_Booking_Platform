import { useState } from 'react';
import API from '../services/api';
import { useNavigate} from 'react-router-dom';

export default function ForgotPassword(){
    const [msg,setMsg]=useState('');
    const[sent,setSent]=useState(false);
    const [loading,setLoading]=useState(null);
    const navigate = useNavigate();
    const [form, setForm]=useState({email:'',otp:'',password:''});
    const [error, setError] = useState(null);
    const[otpmsg,setotpmsg]=useState(null);

    const handleOTPSubmit=async(e)=>{
        e.preventDefault();
        try{
            setLoading(true);
            const res=await API.post('/auth/forgot-password', form);
            setLoading(false);
            setSent(true);
            setotpmsg(res.data.message);
        }catch(err){
            setMsg(err.response?.data?.message|| 'Error Sending OTP');
        }

    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await API.post(`/auth/reset-password`, form);
            setMsg(response.data.message);
            navigate('/login');
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message ||'An error occurred while resetting the password.');
            setMsg(null);
        }
    };


    return (
        <div className='login-container' style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'30px',height:'auto',minHeight:'92.8vh'}}>
        <form onSubmit={handleOTPSubmit} className='login-form'>
            <h2>Forgot Password</h2>
            <label>Email:</label>
            <input value={form.email} onChange={(e)=>{setForm({...form,email:e.target.value})}} placeholder='Enter Your Email' required/>
            <button className='btn'>Send OTP</button>
            {otpmsg && <p className="error-message">{otpmsg}</p>}
            {loading && <p>Sending OTP...</p>}
        </form>
        {sent && 
            <form onSubmit={handleSubmit} className="login-form" style={{marginBottom:'40px'}}>
                <h2>Reset Password</h2>
                <label>OTP:</label>
                <input value={form.otp}
                    onChange={(e) => setForm({...form,otp:e.target.value})}
                    placeholder="Enter 6-digit OTP"
                    required />
                <label>New Password:</label>
                <input value={form.password}
                    onChange={(e) => setForm({...form,password:e.target.value})}
                    type="password"
                    placeholder="Enter new password"
                    required />
                <button className='btn' type="submit">Reset Password</button>
                {msg && <p className="success-message">{msg}</p>}
                {error && <p className="error-message">{error}</p>}
            </form>
        }
        </div>
    );
}