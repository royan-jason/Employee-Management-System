import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthService from '../../service/AuthService';

const PrivateRoute = ({ children }) => {
    return AuthService.isAuthenticated() ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
