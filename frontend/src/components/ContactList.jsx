import React, { useEffect } from 'react'
import { useChatStore } from '../store/useChatStore'
import UsersLoadingSkeleton from './UsersLoadingSkeleton';

const ContactList = () => {
    const { getAllContacts, allContacts, isUsersLoading, setSelectedUser } = useChatStore();

    useEffect(() => {
        getAllContacts();
    }, [getAllContacts]);

    if (isUsersLoading) return <UsersLoadingSkeleton/>

    return (
        <>
            {allContacts.map((contact) => (
                <div key={contact._id}
                    className='bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors'
                    onClick={() => setSelectedUser(contact)}
                >
                    <div className='flex items-center gap-4'>
                        {/* fix this online status and make it work with socket */}
                        <div className={`avatar online`}>
                            <div className='size-12 rounded-full'>
                                <img src={contact?.profilePic || "/avatar.png"} alt="" />
                            </div>
                        </div>
                        <h4 className='text-slate-200 font-medium truncate'> {contact?.fullName} </h4>
                    </div>

                </div>
            ))}
        </>
    )
}

export default ContactList