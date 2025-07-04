import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';


export default function ProfilePage() {
    const { user ,setUser } = useAuth();
    const [isEditing,setIsEditing]=useState(false);
    const navigate= useNavigate();
    const [form, setForm]= useState({name:''})
    const [avatarFile,setAvatarFile]=useState(null);
    const [message,setMessage]=useState('');
    const [showpassfrom,setshowpassform]=useState(false);
    const [passdata,setpassdata]=useState({oldPassword:'',newPassword:''});
    const [passmsg,setpassmsg]=useState('');

    useEffect(()=>{
        if(user){
            setForm({name:user.name})
        }
    },[user])

    const handleProfSave= async()=>{
        const formData= new FormData();
        formData.append('name',form.name);
        if(avatarFile) formData.append('avatar',avatarFile);

        try{
            const res=await API.put('/users/updateprofile',formData);
            setUser(res.data.user);
            setIsEditing(false);
            setMessage('Profile Updated Successfully');
        }catch(error){
            console.error(error);
            setMessage(error.response?.data?.message ||'Update Failed');
        }
    };

    const handleFileChange= (e)=>{
        const file= e.target.files[0];
        if(file){
            setAvatarFile(file);
        }
    };

    const handlePassChang= async ()=>{
        try{
            const res= await API.put('/users/change-password',passdata);
            setpassmsg("Password Changed Successfully");
            setpassdata({oldPassword:'',newPassword:''});
            setshowpassform(false);
        } catch(err){
            setpassmsg(err.response?.data?.message ||"Password Change Failed");
        }
    };

    const handleAccDel= async()=>{
        try {
            alert("Deleting Account...");
            await API.delete(`/users/deleteaccount`);
            localStorage.removeItem('user');
            navigate('/login');
            setUser(null);
        } catch (err) {
            setMessage(err.response?.data?.message || 'Failed to delete user.');
        }
    }

    if (!user) {
        return <div>Please log in to view your profile.</div>;
    }

    return (
        <div className="profile-page">
            <h1 style={{position:'relative',left:'685px',width:'300px',color: 'whitesmoke',marginTop:'0px',paddingTop:'10px'}}>Profile Page</h1>

            {isEditing?
                (<div className='useredit'>
                    <form className='prof-form'>
                    {avatarFile && <img style={{position:'relative',left:'130px'}} src={URL.createObjectURL(avatarFile)} onError={(e)=>(e.target.src=`http://localhost:4000${user.avatar}`)} alt="User Avatar" className="avatar" />}
                    {!avatarFile && <img style={{position:'relative',left:'130px'}} src={`http://localhost:4000${user.avatar}`}  alt="User Avatar" className="avatar" />}
                    
                    <br/>
                    <label style={{position:'relative',left:'20px',marginTop:'20px'}}><strong>Profile Pic</strong></label>
                    <input className='file-upload' style={{position:'relative',left:'50px',marginTop:'20px',border:'none',background:'none',backdropFilter:'none'}} type="file" onChange={handleFileChange}/>
                    <br/>
                    <label style={{position:'relative',left:'20px',marginTop:'20px',marginBottom:'20px'}}><strong>Name</strong></label>
                    <input style={{position:'relative',left:'50px',marginTop:'20px',marginBottom:'20px'}} value={form.name} onChange={(e)=> setForm({...form,name:e.target.value})}/>
                    <br/>
                    <button className='btn' style={{position:'relative',left:'80px'}} onClick={()=> setIsEditing(false)}>Cancel</button>
                    <button className='btn' style={{position:'relative',left:'100px'}} onClick={handleProfSave} >Save</button>
                    </form>
                </div>)
                :(<div className='userprof'>
                    <form className='prof-form'>
                    <h2 style={{position:'relative',left:'80px'}}>User Information</h2>
                    <img src={`http://localhost:4000${user.avatar}`} style={{position:'relative',left:'130px'}} onError={(e)=>(e.target.src='https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg')} alt="User Avatar" className="avatar" />
                    
                    <p style={{position:'relative',left:'100px'}}><strong>Name:</strong> {user.name}</p>
                    <p style={{position:'relative',left:'100px'}}><strong>Email:</strong> {user.email}</p>
                    <p style={{position:'relative',left:'100px'}}><strong>Role:</strong> {user.role}</p>
                {(user.role!=="admin") && <p style={{position:'relative',left:'100px'}}><strong>Balance:</strong> {user.balance}</p>}
                <button className='btn' style={{position:'relative',left:'135px',marginTop:'20px'}} onClick={()=> setIsEditing(true)}>Edit</button></form></div>)}

            
            {showpassfrom && (
                <div className='useredit'>
                    <form className='prof-form'>
                    <h3>Change Password</h3>
                    <p>
                        <label>Old Password</label>
                        <input
                            type="password"
                            value={passdata.oldPassword}
                            onChange={(e)=> setpassdata({...passdata,oldPassword:e.target.value})}/>
                    </p>
                    <p>
                        <label>New Password</label>
                        <input
                            style={{position:'relative',left:'12px'}}
                            type="password"
                            value={passdata.newPassword}
                            onChange={(e)=> setpassdata({...passdata,newPassword:e.target.value})}/>
                    </p>

                    <button className='btn'style={{position:'relative',left:'55px',marginTop:'20px'}} onClick={()=>setshowpassform(!showpassfrom)}>Cancel</button>
                    <button className='btn' style={{position:'relative',left:'85px',marginTop:'20px'}} onClick={handlePassChang}>Change Password</button>
                    {passmsg && <p>{passmsg}</p>}
                    </form>
                </div>
            )
            }

            <div className='useredit' style={{marginBottom:'0px'}}>
                {!showpassfrom && <button className='btn' style={{position:'relative',left:'90px',marginTop:'10px'}} onClick={()=>setshowpassform(!showpassfrom)}>
                Change Password
                </button>}
                <br/>
                {user.role==='user' && <button className='btn' style={{position:'relative',left:'100px',marginTop:'10px'}} onClick={()=>{navigate('/bookings')}}>Booking History</button>}
                <br/>
                <button className='btn' style={{position:'relative',left:'100px',marginTop:'10px'}} onClick={handleAccDel}>Delete Account</button> 
            </div>

            {message && <p>{message}</p>}
        </div>
    );
};