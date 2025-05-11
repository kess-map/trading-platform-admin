import { useEffect, useState } from 'react';
import axios from '../utils/axios';
import { MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProfileRequestsPage = () => {
  const [profileRequests, setProfileRequests] = useState([])
  const [dropdownOpen, setDropdownOpen] = useState(null)

  const fetchProfileRequests = async () => {
    const res = await axios.get(`/admin/profile-requests`);
    setProfileRequests(res.data.data);
  };

  useEffect(() => {
    fetchProfileRequests();
  }, []);

  const navigate = useNavigate()

   const handleAction = async(action, prof) => {
    if(action === 'view'){
        navigate(`/profile-requests/${prof._id}`)
    }
    setDropdownOpen(null);
  };

  return (
    <div className="p-4">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">Full Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Username</th>
              <th className="p-3">Date Requested</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {profileRequests.map(prof => (
              <tr key={prof._id} className="border-t hover:bg-gray-900 text-white">
                <td className="p-3">{prof.user.fullName}</td>
                <td className="p-3">{prof.user.email}</td>
                <td className="p-3">{prof.user.username}</td>
                <td className="p-3">{new Date(prof.createdAt).toLocaleDateString('en-GB')}</td>                
                <td className="p-3 text-right relative">
                  <button onClick={() => setDropdownOpen(dropdownOpen === prof._id ? null : prof._id)}>
                    <MoreVertical />
                  </button>
                  {dropdownOpen === prof._id && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow z-10 text-black">
                      <button onClick={() => handleAction('view', prof)} className="w-full px-4 py-2 hover:bg-gray-100 text-left">View</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProfileRequestsPage;