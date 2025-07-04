import { createContext, useContext, useEffect, useState } from "react";
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const[ loading, setLoading ]=useState(true);

    useEffect(()=>{
        const fetchProfile=async()=>{
            const token=localStorage.getItem('token');
            if(token){
                try{
                    const res=await API.get('/users/profile');
                    setUser(res.data);
                    localStorage.setItem('user',JSON.stringify(res.data))
                }catch(err){
                    console.error('Profile fetch Failed',err);
                    setUser(null);
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
            }
            setLoading(false);
        };
        fetchProfile();
    },[]);

    const login = (data) =>{
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
    }

    const register = (data) => {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return <AuthContext.Provider value={{ user, login,register, logout, setUser , loading }}>
        {children}
    </AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);