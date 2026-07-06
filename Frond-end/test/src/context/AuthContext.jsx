import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            fetchUser();
        } else {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    const fetchUser = async () => {
        try {
            const response = await axios.get(`${API_URL}/user`);
            setUser(response.data);
        } catch (error) {
            logout();
        } finally {
            setLoading(false);
        }
    };

    const _setSession = (access_token, userData) => {
        localStorage.setItem('token', access_token);
        setToken(access_token);
        setUser(userData);
        axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
    };

    /** Email/password login */
    const login = async (email, password) => {
        const response = await axios.post(`${API_URL}/login`, { email, password });
        const { access_token, user } = response.data;
        _setSession(access_token, user);
        return response.data;
    };

    /**
     * Register — returns { email, otp_required: true }
     * Caller should redirect to /verify-otp
     */
    const register = async (userData) => {
        const response = await axios.post(`${API_URL}/register`, userData);
        return response.data;
    };


    /** Send OTP for email verification */
    const sendOtpVerification = async (email) => {
        const response = await axios.post(`${API_URL}/otp/send-verification`, { email });
        return response.data;
    };

    /** Verify email OTP — on success, returns token + user */
    const verifyEmailOtp = async (email, code) => {
        const response = await axios.post(`${API_URL}/otp/verify-email`, { email, code });
        const { access_token, user } = response.data;
        _setSession(access_token, user);
        return response.data;
    };

    /** Send forgot-password OTP */
    const sendPasswordReset = async (email) => {
        const response = await axios.post(`${API_URL}/otp/send-reset`, { email });
        return response.data;
    };

    /** Reset password with OTP */
    const resetPassword = async (email, code, password, password_confirmation) => {
        const response = await axios.post(`${API_URL}/otp/reset-password`, {
            email, code, password, password_confirmation,
        });
        return response.data;
    };

    /** Google login — send access_token to backend */
    const googleLogin = async (accessToken) => {
        const response = await axios.post(`${API_URL}/auth/google`, { access_token: accessToken });
        const { access_token, user } = response.data;
        _setSession(access_token, user);
        return response.data;
    };

    const logout = async () => {
        // Always clear local state first — even if token is already expired (401)
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        delete axios.defaults.headers.common['Authorization'];
        try {
            if (token) await axios.post(`${API_URL}/logout`);
        } catch {
            // Silently ignore 401/network errors — local state already cleared
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            token,
            isAdmin: user?.role === 'admin',
            isVerified: user?.email_verified,
            login,
            googleLogin,
            register,
            sendOtpVerification,
            verifyEmailOtp,
            sendPasswordReset,
            resetPassword,
            logout,
            setUser,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
