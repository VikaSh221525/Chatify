import React from 'react'
import { useChatStore } from '../store/useChatStore';

const ActiveTabSwitch = () => {
    const { activeTab, setActiveTab } = useChatStore();
    return (
        <div className='tabs tabs-boxed bg-transparent p-2 m-2'>
            <button className={`tab ${activeTab === "chats" ? "tab-active" : ""}`} onClick={() => setActiveTab("chats")}>Chats</button>
            <button className={`tab ${activeTab === "contacts" ? "tab-active" : ""}`} onClick={() => setActiveTab("contacts")}>Contacts</button>
        </div>
    )
}

export default ActiveTabSwitch