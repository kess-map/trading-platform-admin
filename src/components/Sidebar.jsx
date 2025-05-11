import {Link} from 'react-router-dom'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axios';
import {useAdminStore} from '../store/adminStore'

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate()
  const {logout} = useAdminStore()
  const handleLogout = async()=>{
    try {
      logout()
      toast.success('Logged out successfully')
      navigate('/login')
    } catch (error) {
      console.log(error)
      toast.error('Failed to logout')
    }
  }
  return (
    <div
      className={`fixed top-0 left-0 h-screen w-64 bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl border border-gray-800 text-white p-5 transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out sm:translate-x-0 sm:relative z-10`}
    >
      <div className="flex justify-between items-center">
        <button
          className="sm:hidden text-white"
          onClick={toggleSidebar}
        >
          ✖
        </button>
      </div>

      <div className="flex flex-col justify-between h-full">
        <ul className="mt-1 space-y-2">
          <li><Link to={'/'} className="block px-4 py-4 hover:bg-gray-700 rounded">Dashboard</Link></li>
          <li><Link to={'/users'} className="block px-4 py-4 hover:bg-gray-700 rounded">Users</Link></li>
          <li><Link to={'/buy-requests'} className="block px-4 py-4 hover:bg-gray-700 rounded">Buy Requests</Link></li>
          <li><Link to={'/sell-requests'} className="block px-4 py-4 hover:bg-gray-700 rounded">Sell Requests</Link></li>
          <li><Link to={'/matched-requests'} className="block px-4 py-4 hover:bg-gray-700 rounded">Matched Requests</Link></li>
          <li><Link to={'/investments'} className="block px-4 py-4 hover:bg-gray-700 rounded">Investments</Link></li>
          <li><Link to={'/profile-requests'} className="block px-4 py-4 hover:bg-gray-700 rounded">Profile Requests</Link></li>
          <li><Link to={'/id-verifications'} className="block px-4 py-4 hover:bg-gray-700 rounded">ID Verification</Link></li>
          <li><Link to={'/live-sessions'} className="block px-4 py-4 hover:bg-gray-700 rounded">Live Sessions</Link></li>
        </ul>
        <ul className="mb-1 space-y-2">
          <li onClick={handleLogout} className="block px-4 py-4 hover:bg-gray-700 rounded">Logout</li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
