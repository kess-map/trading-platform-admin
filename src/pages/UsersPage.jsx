import { useEffect, useState } from 'react';
import axios from '../utils/axios';
import { MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [dropdownOpen, setDropdownOpen] = useState(null);

  const fetchUsers = async () => {
    const res = await axios.get(`/admin/users?search=${search}&page=${page}`);
    setUsers(res.data.data.users);
    setPages(res.data.data.pages);
  };

  useEffect(() => {
    fetchUsers();
  }, [search, page]);

  const navigate = useNavigate()


  const handleAction = async(action, user) => {
    if(action === 'view'){
        navigate(`/users/${user._id}`)
    }else if (action === 'suspend' || action === 'unsuspend') {
      try {
        await axios.post(`/admin/user/suspend/${user._id}`);
        toast.success(!user.isSuspended ? 'User suspended successfully' : 'User unsuspended successfully');
  
        setUsers(prevUsers =>
          prevUsers.map(u =>
            u._id === user._id ? { ...u, isSuspended: !u.isSuspended } : u
          )
        );
      } catch (error) {
        toast.error(error.response?.data?.message || 'Something went wrong');
      }
    }else if (action === 'toggle-role') {
      const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
      try {
        await axios.post(`/admin/user/role/${user._id}`);
        toast.success(`User role changed to ${newRole}`);
  
        setUsers(prev =>
          prev.map(u =>
            u._id === user._id ? { ...u, role: newRole } : u
          )
        );
      } catch (error) {
        toast.error(error.response?.data?.message || 'Something went wrong');
      }
    }
    setDropdownOpen(null);
  };

  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="Search by name or email"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 rounded mb-4 w-full md:w-1/3"
      />

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">Full Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Verified</th>
              <th className="p-3">Suspended</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id} className="border-t hover:bg-gray-900 text-white">
                <td className="p-3">{user.fullName}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">{user.role}</td>
                <td className="p-3">{user.isDocumentVerified ? 'Yes' : 'No'}</td>
                <td className="p-3">{user.isSuspended ? 'Yes' : 'No'}</td>
                <td className="p-3 text-right relative">
                  <button onClick={() => setDropdownOpen(dropdownOpen === user._id ? null : user._id)}>
                    <MoreVertical />
                  </button>
                  {dropdownOpen === user._id && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow z-10 text-black">
                      <button onClick={() => handleAction('view', user)} className="w-full px-4 py-2 hover:bg-gray-100 text-left">View</button>
                      <button onClick={() => handleAction(user.isSuspended ? 'unsuspend' : 'suspend', user)} className="w-full px-4 py-2 hover:bg-gray-100 text-left">
                        {user.isSuspended ? 'Unsuspend' : 'Suspend'}
                      </button>
                      <button onClick={() => handleAction('toggle-role', user)} className="w-full px-4 py-2 hover:bg-gray-100 text-left">
                        {user.role === 'ADMIN' ? 'Make User' : 'Make Admin'}
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
        {getPageNumbers(page, pages).map((p, i) =>
            p === '...' ? (
            <span key={i} className="px-2 text-gray-400">...</span>
            ) : (
            <button
                key={i}
                onClick={() => setPage(p)}
                className={`px-3 py-1 rounded ${page === p ? 'bg-black text-white' : 'bg-gray-200'}`}
            >
                {p}
            </button>
            )
        )}
        </div>
    </div>
  );
};

export default AdminUsersPage;

const getPageNumbers = (current, total) => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    let l;
  
    for (let i = 1; i <= total; i++) {
      if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
        range.push(i);
      }
    }
  
    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l > 2) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    }
  
    return rangeWithDots;
  };  