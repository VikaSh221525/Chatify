import React, { useRef, useState } from 'react'
import useKeyboardSound from '../Hooks/useKeyboardSound'
import { useChatStore } from '../store/useChatStore';
import { ImageIcon, SendIcon, XIcon } from 'lucide-react';

const MessageInput = () => {
    const { isSoundEnabled, sendMessage } = useChatStore();
    const { playRandomSound } = useKeyboardSound();
    const [text, setText] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!text.trim() && !imagePreview) return;
        if (isSoundEnabled) playRandomSound();
        const messageData = {
            text,
            image: imagePreview
        }
        sendMessage(messageData);
        setText("");
        setImagePreview(null);
        fileInputRef.current.value = "";

    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image");
            return;
        }
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            }
            reader.readAsDataURL(file);
        }
    }

    const removeImagePreview = () => {
        setImagePreview(null);
        fileInputRef.current.value = "";
    }


    return (
        <div className='p-4 border-t border-slate-700/50'>
            {imagePreview && (
                <div className='max-w-3xl mx-auto mb-3 flex items-center'>
                    <div className='relative'>
                        <img src={imagePreview} alt="" className='w-20 h-20 rounded-lg object-cover border border-slate-700' />
                        <button onClick={removeImagePreview}
                            className='absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-slate-200 hover:bg-slate-700'
                        >
                            <XIcon className='w-4 h-4' />
                        </button>
                    </div>
                </div>
            )}
            <form onSubmit={handleSendMessage} className='max-w-3xl mx-auto flex space-x-4'>
                <input type="text" placeholder='Type your message...' value={text} onChange={(e) => {
                    setText(e.target.value);
                    if (isSoundEnabled) playRandomSound();
                }} className='flex-1 bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-slate-700' />
                <input type="file" 
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                className='hidden' 
                />
                <button
                    type='button'
                    onClick={() => fileInputRef.current?.click()}
                    className={`bg-slate-800/50 text-slate-400 hover:text-slate-200 rounded-lg px-4 transition-colors ${imagePreview ? "text-cyan-500" : ""}`}
                >
                    <ImageIcon className='size-5'/>
                </button>
                <button
                    type='submit'
                    className='bg-slate-800/50 text-slate-400 hover:text-slate-200 rounded-lg px-4 transition-colors'
                >
                    <SendIcon className='size-5'/>
                </button>
            </form>

        </div>
    )
}

export default MessageInput