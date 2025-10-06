import React from 'react'
import { useAuthStore } from '../store/useAuthStore';
import { useChatStore } from '../store/useChatStore';
import ActiveTabSwitch from '../components/ActiveTabSwitch';
import ChatList from '../components/ChatList';
import ContactList from '../components/ContactList';
import ProfileHeader from '../components/ProfileHeader';
import ChatContainer from '../components/ChatContainer';
import NoConversationPlaceHolder from '../components/NoConversationPlaceHolder';

const ChatPage = () => {
    const { logout } = useAuthStore();
    const { activeTab, selectedUser } = useChatStore();

    return (
        <div className='box relative w-full max-w-6xl h-[600px] flex z-10'>
            {/* Left side */}
            <div className='w-80 bg-slate-800/50 backdrop-blur-sm flex flex-col'>
                <ProfileHeader />
                <ActiveTabSwitch />
                <div className='flex-1 overflow-y-auto p-4 space-y-4'>
                    {activeTab === "chats" ? (
                        <ChatList />
                    ) : (
                        <ContactList />
                    )}
                </div>
            </div>

            {/* Right Side */}
            <div className='flex-1 flex flex-col backdrop-blur-sm'>
                {selectedUser ? <ChatContainer/> : <NoConversationPlaceHolder/>}

            </div>

        </div>
    )
}

export default ChatPage