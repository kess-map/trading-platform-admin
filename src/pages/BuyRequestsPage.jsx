import { useEffect, useState } from 'react';
import axios from '../utils/axios';
import { MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const TABS = ['All', 'Pending', 'Approved', 'Matched', 'Paid', "Completed", 'Declined', 'Cancelled'];

const BuyRequestsPage = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [activeTab, setActiveTab] = useState('All');

  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const statusQuery = activeTab === 'All' ? '' : `&status=${activeTab.toLowerCase()}`;
      const res = await axios.get(`/admin/buy-orders?search=${search}&page=${page}${statusQuery}`);
      const { orders: fetchedOrders, pages: totalPages } = res.data.data;
      setOrders(fetchedOrders);
      setPages(totalPages);
    } catch (err) {
      toast.error('Failed to fetch orders');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [search, page, activeTab]);

  const handleAction = async (action, order) => {
    try {
      if (action === 'view') {
        navigate(`/buy-requests/${order._id}`);
      } else {
        const status = action === 'approve' ? 'approved' : 'declined';
        await axios.post(`/admin/buy-orders/${order._id}/status`, { action: status });
        toast.success(`Order ${status} successfully`);
        setOrders(prev =>
          prev.map(o =>
            o._id === order._id ? { ...o, status } : o
          )
        );
      }
      setDropdownOpen(null);
    } catch (err) {
      toast.error('Action failed');
    }
  };

  return (
    <div className="p-4">
      {/* Search */}
      <input
        type="text"
        placeholder="Search by user name or email"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 rounded mb-4 w-full md:w-1/3"
      />

      {/* Tabs */}
      <div className="flex gap-4 mb-4 flex-wrap">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setPage(1); // Reset to page 1 on tab switch
            }}
            className={`px-4 py-2 rounded-full ${activeTab === tab ? 'bg-black text-white' : 'bg-gray-200'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">User</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Payment Method</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id} className="border-t hover:bg-gray-900 text-white">
                <td className="p-3">{order.user?.fullName || 'N/A'}</td>
                <td className="p-3">{order.amount}</td>
                <td className="p-3">{order.paymentMethod?.toUpperCase() || 'N/A'}</td>
                <td className="p-3">{order.status}</td>
                <td className="p-3 text-right relative">
                  <button onClick={() => setDropdownOpen(dropdownOpen === order._id ? null : order._id)}>
                    <MoreVertical />
                  </button>
                  {dropdownOpen === order._id && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow z-10 text-black">
                      <button onClick={() => handleAction('view', order)} className="w-full px-4 py-2 hover:bg-gray-100 text-left">View</button>
                      {order.status === 'pending' && (
                        <>
                          <button onClick={() => handleAction('approve', order)} className="w-full px-4 py-2 hover:bg-gray-100 text-left">Approve</button>
                          <button onClick={() => handleAction('decline', order)} className="w-full px-4 py-2 hover:bg-gray-100 text-left">Decline</button>
                        </>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
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

export default BuyRequestsPage;

// Helper for pagination display
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
