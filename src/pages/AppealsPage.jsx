import { useEffect, useState } from 'react';
import axios from '../utils/axios';
import toast from 'react-hot-toast';
import { MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AppealsPage = () => {
  const [tab, setTab] = useState('all');
  const [appeals, setAppeals] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const navigate = useNavigate();

  const fetchAppeals = async () => {
    try {
      const res = await axios.get(`/appeals?status=${tab}`);
      setAppeals(res.data.data);
    } catch (error) {
      toast.error('Failed to fetch appeals');
    }
  };

  useEffect(() => {
    fetchAppeals();
    setDropdownOpen(null);
  }, [tab]);

  return (
    <div className="p-4 text-white">
      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        {['all', 'pending', 'resolved', 'rejected'].map((status) => (
          <button
            key={status}
            onClick={() => setTab(status)}
            className={`px-4 py-2 rounded capitalize ${
              tab === status ? 'bg-green-600 text-white' : 'bg-gray-300 text-black'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Table */}
      <table className="min-w-full text-sm text-white">
        <thead>
          <tr className="bg-gray-800 text-left">
            <th className="p-3">Appealed By</th>
            <th className="p-3">Against</th>
            <th className="p-3">Reason</th>
            <th className="p-3">Order ID</th>
            <th className="p-3">Status</th>
            <th className="p-3">Created</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {appeals.map((appeal) => (
            <tr key={appeal._id} className="border-t hover:bg-gray-900 relative">
              <td className="p-3">{appeal.appealedBy?.fullName || 'N/A'}</td>
              <td className="p-3">{appeal.appealedAgainst?.fullName || 'N/A'}</td>
              <td className="p-3">{appeal.reason}</td>
              <td className="p-3">{appeal.order}</td>
              <td className="p-3 capitalize">{appeal.status}</td>
              <td className="p-3">{new Date(appeal.createdAt).toLocaleString('en-GB')}</td>
              <td className="p-3 relative">
                <button onClick={() => setDropdownOpen(dropdownOpen === appeal._id ? null : appeal._id)}>
                  <MoreVertical className="text-white cursor-pointer" />
                </button>
                {dropdownOpen === appeal._id && (
                  <div className="absolute right-0 mt-2 w-40 bg-gray-800 border border-gray-700 rounded shadow-lg z-10">
                    <button
                      onClick={() => navigate(`/appeals/${appeal._id}`)}
                      className="block w-full px-4 py-2 text-left hover:bg-gray-700"
                    >
                      View
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AppealsPage;
