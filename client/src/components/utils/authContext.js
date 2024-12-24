import axios from 'axios';
import { createContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router';

export const AuthContext = createContext()
export const AuthContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(
        JSON.parse(localStorage.getItem("user")) || null
    );

    const login = async (inputs) => {
        const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/auth/login`, inputs, { withCredentials: true });
        const { token, ...other } = res.data;
        sessionStorage.setItem("token", token);
        setCurrentUser(other);
    };

    const updateExistingUser = (data) => {
        setCurrentUser(data);
    }

    const logout = async (inputs) => {
        await axios.post(`${process.env.REACT_APP_API_BASE_URL}/auth/logout`, { withCredentials: true });
        setCurrentUser(null);
    };

    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(currentUser));
    }, [currentUser]);

    return (
        <AuthContext.Provider value={{ currentUser, login, logout, updateExistingUser }}>
            {children}
        </AuthContext.Provider>
    );
}