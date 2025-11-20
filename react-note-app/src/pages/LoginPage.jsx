import React, { useContext } from 'react';
import AuthContext from '../context/authContext';

const LoginPage = () => {
    // Get the loginUser function from the context
    const { loginUser } = useContext(AuthContext);

    return (
        <div>
            <h2>Log In</h2>
            <form onSubmit={loginUser}>
                <input type="text" name="username" placeholder="Enter Username" required />
                <input type="password" name="password" placeholder="Enter Password" required />
                <button type="submit">Log In</button>
            </form>
        </div>
    );
};

export default LoginPage;