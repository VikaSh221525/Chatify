import React from 'react'

const UsersLoadingSkeleton = () => {
    return (
        <div className='space-y-2'>
            {[1,2,3].map((item) => (
                <div key={item} className='bg-slate-800/50 p-4 rounded-lg animate-pulse'>
                    <div className='flex items-center space-x-3'>
                        <div className='w-12 h-12 rounded-full bg-slate-700'></div>
                        <div className='flex-1'>
                            <div className='w-3/4 h-4 rounded bg-slate-700 mb-2'></div>
                            <div className='w-1/2mt h-4 rounded bg-slate-700/70'></div>
                        </div>
                    </div>

                </div>
            ))}
        </div>
    )
}

export default UsersLoadingSkeleton