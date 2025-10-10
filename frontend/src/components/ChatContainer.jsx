import React, { useEffect, useRef } from 'react'
import { useChatStore } from '../store/useChatStore'
import { useAuthStore } from '../store/useAuthStore'
import ChatHeader from './ChatHeader'
import NoChatHistoryPlaceholder from './NoChatHistoryPlaceholder'
import MessagesLoadingSkeleton from './MessagesLoadingSkeleton'
import MessageInput from './MessageInput'

const ChatContainer = () => {
    const {selectedUser, getMessagesByUserId, messages, isMessagesLoading, subscribeToMessages, unsubscribeFromMessage} =useChatStore()
    const {authUser} = useAuthStore();
    const scrollBottomRef = useRef(null);

    useEffect(() => {
        getMessagesByUserId(selectedUser._id)
        subscribeToMessages();
        return () => {
            unsubscribeFromMessage();
        }
    }, [selectedUser, getMessagesByUserId, subscribeToMessages, unsubscribeFromMessage])

    useEffect(() => {
        scrollBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages])

    return (
        <>
            <ChatHeader/>
            <div className='flex-1 px-6 overflow-auto py-8'>
                {messages.length > 0 && !isMessagesLoading ? (
                    <div className='max-w-3xl mx-auto space-y-6'>
                        {messages.map((msg) => (
                            <div key={msg._id} className={`chat ${msg.senderId === authUser._id ? "chat-end" : "chat-start"}`} >
                                <div className={`chat-bubble ${msg.senderId === authUser._id ? "chat-bubble-accent" : "chat-bubble-secondary"}`} >
                                    {msg.image && (
                                        <img src={msg.image} alt="shared" className='rounded-lg h-48 object-cover' />
                                    )}
                                    {msg.text && (
                                        <p className='mt-2'>{msg.text}</p>
                                    )}
                                    <p className='text-sm mt-1 opacity-75 flex items-center gap-1'>
                                        {new Date(msg.createdAt).toLocaleTimeString(undefined, {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            hour12: true,
                                        })}
                                    </p>
                                </div>
                                
                            </div>
                        ))}
                        <div ref={scrollBottomRef}/>
                    </div>
                ) : isMessagesLoading ? ( <MessagesLoadingSkeleton/> ) : (
                    <NoChatHistoryPlaceholder name={selectedUser.fullName} />
                )}
            </div>

            <MessageInput/>
            
        </>
    )
}

export default ChatContainer