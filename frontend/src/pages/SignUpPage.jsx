import React, { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, Loader2, LockIcon, MailIcon, MessageCircle, UserIcon } from 'lucide-react'
import {Link} from 'react-router'

const SignUpPage = () => {
    const { register, handleSubmit } = useForm();
    const { signup, isSigningUp} = useAuthStore();

    const handleSignup = (data) => {
        signup(data);
    }

    const [toggleVisibility, setToggleVisibility] = useState(false);
    return (
        <div className='w-full flex items-center justify-center p-4 z-10'>
            <div className='box relative w-full max-w-6xl'>
                <div className='w-full flex flex-col md:flex-row'>
                    {/* Form column - Left Side */}
                    <div className='md:w-1/2 p-8 flex items-center justify-center md:border-r md:border-slate-600/30'>
                        <div className='w-full max-w-md'>
                            <div className='text-center mb-8'>
                                <MessageCircle className='w-12 h-12 mx-auto text-slate-400 mb-4' />
                                <h2 className='text-2xl font-bold text-slate-200 mb-2'>Create an account</h2>
                                <p className='text-slate-400 mb-6'>Sign up to get started</p>
                            </div>
                            {/* form */}
                            <form onSubmit={handleSubmit(handleSignup)} className='space-y-6'>
                                {/* Full Name */}
                                <div>
                                    <label className='auth-label'>Full Name</label>
                                    <div className='relative'>
                                        <UserIcon className='auth-input-icon' />
                                        <input type="text" {...register("fullName")} className='auth-input' placeholder='Full Name' />
                                    </div>
                                </div>
                                {/* Email */}
                                <div>
                                    <label className='auth-label'>Email</label>
                                    <div className='relative'>
                                        <MailIcon className='auth-input-icon' />
                                        <input type="email" {...register("email")} className='auth-input' placeholder='Email' />
                                    </div>
                                </div>
                                {/* Password */}
                                <div>
                                    <label className='auth-label'>Password</label>
                                    <div className='relative'>
                                        <LockIcon className='auth-input-icon' />
                                        <button className='absolute top-1/2 right-2 transform -translate-y-1/2' onClick={() => setToggleVisibility(!toggleVisibility)} type='button'>
                                            {toggleVisibility ? (
                                                <Eye size={20} />
                                            ) : (
                                                <EyeOff size={20} />
                                            )}
                                        </button>
                                        <input type={toggleVisibility ? "text" : "password"} {...register("password")} className='auth-input' placeholder='Password' />
                                    </div>
                                </div>
                                {/* Submit Button */}
                                <button className='auth-btn' type='submit' disabled={isSigningUp}>
                                    {isSigningUp ? (
                                        <span>
                                            <Loader2 className='w-5 h-5 animate-spin mr-2 inline-block' />
                                            Signing Up...
                                        </span>
                                    ) : (
                                        <span>Create Account</span>
                                    )}
                                </button>
                            </form>
                            {/* Link */}
                            <div className='mt-6 text-center'>
                                <p>Already have an account? <Link className='text-cyan-500 hover:text-cyan-600 hover:underline' to={'/login'}>Login</Link></p>
                            </div>
                        </div>
                    </div>
                    {/*Illustration Right Side */}
                    <div className='hidden md:w-1/2 md:flex items-center justify-center p-6 bg-gradient-to-bl from-slate-800/20 to-transparent'>
                        <div>
                            <img src="/signup.png" className='w-full h-auto object-contain' alt="" />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default SignUpPage