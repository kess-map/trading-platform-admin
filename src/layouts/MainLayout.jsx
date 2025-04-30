import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'

const mainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  return (
    <div className="flex h-screen">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar}/>

      <div className="flex flex-col flex-1 w-full">
        <Navbar toggleSidebar={toggleSidebar}/>

        <main className="flex-grow p-4 overflow-y-scroll no-scrollbar">
          <Outlet /> 
        </main>
      </div>
    </div>
  )
}

export default mainLayout