import { useEffect, useState } from 'react';
import axios from '../utils/axios';
import { MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const BuyRequestsPage = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [dropdownOpen, setDropdownOpen] = useState(null);

  const fetchOrders = async () => {
    const res = await axios.get(`/admin/buy-orders?search=${search}&page=${page}`);
    setOrders(res.data.data.orders);
    setPages(res.data.data.pages);
  };

  useEffect(() => {
    fetchOrders();
  }, [search, page]);

  const navigate = useNavigate();

  const handleAction = async(action, order) => {
    if (action === 'view') {
      navigate(`/buy-requests/${order._id}`);
    } else if (action === 'approve') {
      await axios.post(`/admin/buy-orders/${order._id}/status`, {action: 'approved'})
      setOrders(prev =>
        prev.map(o =>
          o._id === order._id ? { ...o, status: 'approved' } : o
        )
      );
      toast.success('Order approved successfully')
    }else{
        await axios.post(`/admin/buy-orders/${order._id}/status`, {action: 'declined'})
        setOrders(prev =>
          prev.map(o =>
            o._id === order._id ? { ...o, status: 'declined' } : o
          )
        );
        toast.success('Order declined successfully')
    }
    setDropdownOpen(null);
  };

  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="Search by user name or email"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 rounded mb-4 w-full md:w-1/3"
      />

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
                <td className="p-3">{order.amount}</td>{/*₦*/}
                <td className="p-3">{order.paymentMethod.toUpperCase()}</td>
                <td className="p-3">{order.status}</td>
                <td className="p-3 text-right relative">
                  <button onClick={() => setDropdownOpen(dropdownOpen === order._id ? null : order._id)}>
                    <MoreVertical />
                  </button>
                  {dropdownOpen === order._id && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow z-10 text-black">
                      <button onClick={() => handleAction('view', order)} className="w-full px-4 py-2 hover:bg-gray-100 text-left">View</button>
                      {order.status === 'pending' && (<><button onClick={() => handleAction('approve', order)} className="w-full px-4 py-2 hover:bg-gray-100 text-left">Approve</button>
                      <button onClick={() => handleAction('decline', order)} className="w-full px-4 py-2 hover:bg-gray-100 text-left">Decline</button></>)}
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
