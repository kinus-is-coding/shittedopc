import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/authContext';

const Headers = () => {
    const { user, logoutUser } = useContext(AuthContext);

    return (
        <header>
            <nav>
                <Link to="/">Home</Link>
                <span> | </span>
                {user ? (
                    // Show Logout button if user is logged in
                    <button onClick={logoutUser}>Logout</button>
                ) : (
                    // Show Login link if user is NOT logged in
                    <Link to="/login">Login</Link>
                )}
            </nav>
            {user && <span>Logged in as: **{user.username}**</span>}
            <hr />
        </header>
    );
};

export default Headers;