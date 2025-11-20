import { Outlet, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/authContext';

const PrivateRoute = () => {
    // Get authTokens from the context
    const { authTokens } = useContext(AuthContext);

    // If tokens exist, render the child route (Outlet), otherwise navigate to login
    return authTokens ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;