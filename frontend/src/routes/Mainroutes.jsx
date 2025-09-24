import React, { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router'
import ChatPage from '../pages/ChatPage'
import LoginPage from '../pages/LoginPage'
import SignUpPage from '../pages/SignUpPage'
import { useAuthStore } from '../store/useAuthStore'
import PageLoader from '../components/PageLoader'

const Mainroutes = () => {
    const { checkAuth, isCheckingAuth, authUser } = useAuthStore();
    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    console.log({ authUser });

    if(isCheckingAuth){
        return <PageLoader/>
    }
    return (
        <Routes>
            <Route path="/" element={authUser ? <ChatPage /> : <Navigate to={'/login'} />} />
            <Route path="/login" element={ !authUser ? <LoginPage /> : <Navigate to={'/'} />} />
            <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to={'/login'} />} />
        </Routes>
    )
}

export default Mainroutes