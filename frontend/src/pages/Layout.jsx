import React from 'react'
import Navbar from './Navbar'

const Layout = ({ children }) => {
  

  return (
    <div className='min-h-screen bg-base-100 z-50'>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-6 max-lg:px-0">
        {children}
      </main>
    </div>
  )
}

export default Layout
