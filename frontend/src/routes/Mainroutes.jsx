import React from 'react'
import { Route, Routes } from 'react-router'
import ChatPage from '../pages/ChatPage'
import LoginPage from '../pages/LoginPage'
import SignUpPage from '../pages/SignUpPage'

const Mainroutes = () => {
    return (
        <Routes>
            <Route path="/" element={<ChatPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
        </Routes>
    )
}

export default Mainroutes