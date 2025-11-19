import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/authContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import PrivateRoute from './utilities/PrivateRouter';
import Headers from './components/Headers';

const App = () => {
  const isAuth = !!localStorage.getItem('token'); // example auth check

  return (
    <AuthProvider> {/* Wrap everything with AuthProvider */}
      <Router>
        <Headers />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <PrivateRoute isAuth={isAuth}>
                <HomePage />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
