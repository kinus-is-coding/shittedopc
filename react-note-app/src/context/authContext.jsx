import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Used to decode the username

// Set your DRF API base URL
// ⚠️ IMPORTANT: Change this if your Django server is on a different address
const baseUrl = 'http://127.0.0.1:8000/'; 

const AuthContext = createContext();

// Function to decode the JWT and extract the user info (username)
const decodeAndSetUser = (tokens, setUser) => {
    try {
        const decoded = jwtDecode(tokens.access);
        setUser({ 
            username: decoded.username // Assuming the username claim is in the token
        }); 
    } catch (error) {
        console.error("Failed to decode JWT:", error);
        setUser(null);
    }
};

export const AuthProvider = ({ children }) => {
    const [authTokens, setAuthTokens] = useState(() => 
        localStorage.getItem('authTokens') 
            ? JSON.parse(localStorage.getItem('authTokens')) 
            : null
    );
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); 

    const navigate = useNavigate();

    // The function to handle login
    const loginUser = async (e) => {
        e.preventDefault();
        const username = e.target.username.value;
        const password = e.target.password.value;

        try {
            const response = await axios.post(`${baseUrl}login/`, {
                username: username,
                password: password,
            });

            const data = response.data;
            
            setAuthTokens(data);
            localStorage.setItem('authTokens', JSON.stringify(data));
            
            decodeAndSetUser(data, setUser); // Decode and set the actual user
            
            navigate('/'); 

        } catch (error) {
            console.error('Login failed:', error.response ? error.response.data : error.message);
            alert('Something went wrong! Check your credentials.');
        }
    };

    // The function to handle logout
    const logoutUser = () => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem('authTokens');
        navigate('/login');
    };

    useEffect(() => {
        if (authTokens) {
            decodeAndSetUser(authTokens, setUser);
        }
        setLoading(false);
    }, [authTokens]);


    const contextData = {
        user: user,
        authTokens: authTokens,
        loginUser: loginUser,
        logoutUser: logoutUser,
    };

    return (
        <AuthContext.Provider value={contextData}>
            {loading ? null : children}
        </AuthContext.Provider>
    );
};

export default AuthContext;