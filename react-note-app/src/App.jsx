import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import Headers from './components/Headers';
import PrivateRoute from './utilities/PrivateRouter';
import { AuthProvider } from './context/authContext'; // Import the Provider

function App() {
    return (
        <Router>
            {/* Wrap the entire application in the AuthProvider */}
            <AuthProvider>
                <Headers />
                
                <Routes>
                    {/* The PrivateRoute will check for auth before showing its children */}
                    <Route element={<PrivateRoute />}>
                        <Route path="/" element={<HomePage />} />
                        {/* Add other protected routes here (e.g., /settings) */}
                    </Route>

                    {/* Public Routes */}
                    <Route path="/login" element={<LoginPage />} />
                    {/* Add other public routes here (e.g., /register) */}
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;