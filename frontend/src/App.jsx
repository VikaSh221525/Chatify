import React from 'react'
import Mainroutes from './routes/Mainroutes'

const App = () => {
  
  return (
    <div className='min-h-screen bg-slate-900 relative flex items-center justify-center p-4 overflow-hidden'>
      <div className='absolute inset-0' style={{
        backgroundImage: 'repeating-linear-gradient(#33415520 0 1px, transparent 1px 100%), repeating-linear-gradient(90deg, #33415520 0 1px, transparent 1px 100%)',
        backgroundSize: '14px 24px',
        zIndex: 1,
        opacity: 0.7
      }} />
      <div className='absolute top-0 -left-4 size-96 bg-pink-500 opacity-30 blur-[100px] '/>
      <div className='absolute bottom-0 -right-4 size-96 bg-cyan-500 opacity-30 blur-[100px] '/>
        <Mainroutes />
    </div>

  )
}

export default App