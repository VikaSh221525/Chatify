import React, { useRef, useState } from 'react'
import { useChatStore } from '../store/useChatStore'
import { useAuthStore } from '../store/useAuthStore'
import { FolderPen, LogOutIcon, Volume2Icon, VolumeOffIcon } from 'lucide-react'
import { toast } from 'react-hot-toast';

const mouseClickSound = new Audio("/sounds/mouse-click.mp3");

const ProfileHeader = () => {
    const { authUser, logout, updateProfile } = useAuthStore();
    const { isSoundEnabled, toggleSound } = useChatStore();
    const [selectedImg, setSelectedImg] = useState(null);

    const fileInputRef = useRef(null);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if(!file) return;

        // Creates a FileReader object to read the file
        const reader = new FileReader();
        // converts the file to a base64-encoded data URL
        reader.readAsDataURL(file);

        reader.onloadend = async () => {
            const base64Image = reader.result;
            setSelectedImg(base64Image);

            // Show loading toast and update profile
            await toast.promise(
                updateProfile({profilePic: base64Image}),
                {
                    loading: 'Updating profile picture...',
                    success: 'Profile picture updated successfully!',
                    error: (err) => `Failed to update profile: ${err.response?.data?.message || 'Unknown error'}`
                }
            );
        }
    }

    return (
        <div className='p-6 border-b border-slate-700/50 '>
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                    {/* Avatar */}
                    <div className='avatar online'>
                        <button className='size-14 rounded-full overflow-hidden relative group' onClick={() => fileInputRef.current.click()}>
                            <img src={selectedImg || authUser?.profilePic || "/avatar.png"} alt="User Image" className='size-full object-cover' />

                            <div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity'>
                                <FolderPen className='size-6 text-white/80' />
                            </div>
                        </button>

                        <input type="file" accept='image/*' ref={fileInputRef} onChange={handleImageUpload} className='hidden' />
                    </div>
                    {/* UserName & Online Text */}
                    <div className='text-slate-200 font-medium text-base max-w-[180px] truncate'>
                        {authUser?.fullName}
                        {/* Online Text */}
                        <div className='text-xs text-slate-400'>Online</div>
                    </div>
                </div>
                {/* Buttons */}
                <div className='flex gap-4 items-center'>
                    {/* Logout btn */}
                    <button className='text-slate-400 hover:text-slate-200 transition-colors' onClick={logout}>
                        <LogOutIcon className='size-5' />
                    </button>
                    {/* Sound btn */}
                    <button className='text-slate-400 hover:text-slate-200 transition-colors' onClick={
                        () => {
                            mouseClickSound.currentTime = 0;
                            mouseClickSound.play().catch((error) => console.log("Audio play failed: ", error));
                            toggleSound();
                        }
                    }>
                        {isSoundEnabled ? (
                            <Volume2Icon/>
                        ) : (
                            <VolumeOffIcon/>
                        )}
                    </button>
                </div>
            </div>

        </div>
    )
}

export default ProfileHeader