import React, { useEffect } from 'react'
import { useChatStore } from '../store/useChatStore'
import { XIcon } from 'lucide-react'

const ChatHeader = () => {
    const { selectedUser, setSelectedUser } = useChatStore();

    useEffect(() => {
        const handleEscKey = (e) => {
            if(e.key === "Escape") {
                setSelectedUser(null);
            }
        }
        window.addEventListener("keydown", handleEscKey);

        // cleanUp Function
        return () => {
            window.removeEventListener("keydown", handleEscKey);
        }
    }, [setSelectedUser])
    return (
        <div className='flex items-center justify-between border-b border-slate-700/50 max-h-[84px] px-6 py-2 flex-14 '>
            <div className='flex items-center gap-3'>
                {/* Avatar */}
                <div className='avatar online'>
                    <div className='w-10 rounded-full'>
                        <img src={selectedUser?.profilePic || "/avatar.png"} alt="User Image" className='object-cover' />
                    </div>
                </div>
                {/* UserName & Online Text */}
                <div className='text-slate-200 font-medium text-base max-w-[180px] truncate'>
                    {selectedUser?.fullName}
                    {/* Online Text */}
                    <div className='text-xs text-slate-400'>Online</div>
                </div>
            </div>
            {/* close button */}
            <button className='text-slate-400 hover:text-slate-200 transition-colors cursor-pointer' onClick={() => setSelectedUser(null)}>
                <XIcon className='size-5' />
            </button>

        </div>
    )
}

export default ChatHeader