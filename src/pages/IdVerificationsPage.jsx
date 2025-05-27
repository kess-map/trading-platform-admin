import { useEffect, useState } from 'react';
import axios from '../utils/axios';
import { MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProfileRequestsPage = () => {
  const [verificationRequests, setVerificationRequests] = useState([])
  const [dropdownOpen, setDropdownOpen] = useState(null)

  const fetchVerificationRequests = async () => {
    const res = await axios.get(`/admin/id-verification`);
    setVerificationRequests(res.data.data);
  };

  useEffect(() => {
    fetchVerificationRequests();
  }, []);

  const navigate = useNavigate()

   const handleAction = async(action, ver) => {
    if(action === 'view'){
        navigate(`/id-verifications/${ver._id}`)
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
              <th className="p-3">Selected Country</th>
              <th className="p-3">Verification Type</th>
              <th className="p-3">ID Number</th>
              <th className="p-3">Date Requested</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {verificationRequests.map(ver => (
              <tr key={ver._id} className="border-t hover:bg-gray-900 text-white">
                <td className="p-3">{ver.user.fullName}</td>
                <td className="p-3">{ver.user.email}</td>
                <td className="p-3">{ver.user.username}</td>
                <td className="p-3">{ver.country}</td>
                <td className="p-3">{ver.type}</td>
                <td className="p-3">{ver.idNumber}</td>
                <td className="p-3">{new Date(ver.createdAt).toLocaleDateString('en-GB')}</td>                
                <td className="p-3 text-right relative">
                  <button onClick={() => setDropdownOpen(dropdownOpen === ver._id ? null : ver._id)}>
                    <MoreVertical />
                  </button>
                  {dropdownOpen === ver._id && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow z-10 text-black">
                      <button onClick={() => handleAction('view', ver)} className="w-full px-4 py-2 hover:bg-gray-100 text-left">View</button>
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