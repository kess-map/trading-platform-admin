import { useEffect, useState } from 'react';
import axios from '../utils/axios';
import toast from 'react-hot-toast';
 
const MatchedOrdersPage = () => {
  const [tab, setTab] = useState('all');
  const [matchedOrders, setMatchedOrders] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [loading, setLoading] = useState(false);
 
  const fetchOrders = async () => {
    try {
      const res = await axios.get(`/admin/matched-orders?status=${tab}`);
      setMatchedOrders(res.data.data);
    } catch (error) {
      toast.error('Failed to fetch matched orders');
    }
  };
 
  useEffect(() => {
    fetchOrders();
    setSelectedOrders([]);
  }, [tab]);
 
  const toggleSelect = (id) => {
    setSelectedOrders((prev) =>
      prev.includes(id) ? prev.filter((o) => o !== id) : [...prev, id]
    );
  };
 
  const handleSelectAll = () => {
    if (selectedOrders.length === matchedOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(matchedOrders.map((o) => o._id));
    }
  };
 
  const handleDeploy = async () => {
    if (selectedOrders.length === 0) return toast.error('No orders selected');
 
    try {
      await axios.post('/admin/matched-orders/deploy', {
        matchedOrderIds: selectedOrders,
      });
      toast.success('Orders deployed successfully');
      fetchOrders();
    } catch (err) {
      toast.error('Deployment failed');
    }
  };
 
  return (
    <div className="p-4 text-white">
      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        {['all', 'pending', 'deployed', 'completed'].map((status) => (
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
 
      {/* Deploy Controls */}
      {tab === 'pending' && matchedOrders.length > 0 && (
        <div className="mb-4 flex justify-between items-center">
          <button
            onClick={handleSelectAll}
            className="bg-gray-700 text-white px-3 py-2 rounded hover:bg-gray-600"
          >
            {selectedOrders.length === matchedOrders.length ? 'Unselect All' : 'Select All'}
          </button>
 
          {selectedOrders.length > 0 && (
            <button
              onClick={handleDeploy}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Deploy Selected ({selectedOrders.length})
            </button>
          )}
        </div>
      )}
 
      {/* Table */}
      <table className="min-w-full text-sm text-white">
        <thead>
          <tr className="bg-gray-800 text-left">
            {tab === 'pending' && <th className="p-3">Select</th>}
            <th className="p-3">Buyer</th>
            <th className="p-3">Seller</th>
            <th className="p-3">Amount</th>
            <th className="p-3">Status</th>
            <th className="p-3">Created</th>
          </tr>
        </thead>
        <tbody>
          {matchedOrders.map((order) => (
            <tr key={order._id} className="border-t hover:bg-gray-900">
              {tab === 'pending' && (
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selectedOrders.includes(order._id)}
                    onChange={() => toggleSelect(order._id)}
                  />
                </td>
              )}
              <td className="p-3">{order.buyer?.fullName || 'N/A'}</td>
              <td className="p-3">{order.seller?.fullName || 'N/A'}</td>
              <td className="p-3">₦{order.amount.toLocaleString()}</td>
              <td className="p-3 capitalize">{order.status}</td>
              <td className="p-3">{new Date(order.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
 
export default MatchedOrdersPage;