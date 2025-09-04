import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ForgotPasswordForm } from '../components/auth/index.js';

const ForgotPassword = () => {
    const navigate = useNavigate();

    const handleBackToLogin = () => {
        navigate('/login');
    };

    return (
        <ForgotPasswordForm onBackToLogin={handleBackToLogin} />
    );
};

export default ForgotPassword;