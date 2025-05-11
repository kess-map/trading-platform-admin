import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../utils/axios';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner'

const MatchSellRequestPage = () => {
  const { id } = useParams();
  const [sellOrder, setSellOrder] = useState(null);
  const [buyOrders, setBuyOrders] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [remainingAmount, setRemainingAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('')
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchSellOrder = async () => {
    try {
      const res = await axios.get(`/admin/sell-orders/${id}`);
      setSellOrder(res.data.data.sellOrder);
      setRemainingAmount(res.data.data.sellOrder.remainingAmount);
      setPaymentMethod(res.data.data.sellOrder.paymentMethod)
    } catch (err) {
      toast.error('Failed to fetch sell order');
    }
  };

  const fetchBuyOrders = async (pageNum = 1) => {
    try {
      const res = await axios.get(`/admin/buy-orders/approved`, {
        params: {
          page: pageNum,
          limit: 10,
          paymentMethod
        },
      });
      const newOrders = res.data.data.orders;
      setBuyOrders(pageNum === 1 ? newOrders : [...buyOrders, ...newOrders]);
      setHasMore(newOrders.length === 10);
    } catch (err) {
      toast.error('Failed to fetch buy orders');
    }
  };

  useEffect(() => {
    fetchSellOrder();
    fetchBuyOrders(1);
  }, []);

  const handleCheckboxChange = (order) => {
    const isSelected = selectedOrders.find((o) => o._id === order._id);

    if (isSelected) {
      setSelectedOrders((prev) => prev.filter((o) => o._id !== order._id));
      setRemainingAmount((prev) => prev + order.amount);
    } else {
      if (order.amount > remainingAmount) {
        toast.error('Amount exceeds remaining balance');
        return;
      }
      setSelectedOrders((prev) => [...prev, order]);
      setRemainingAmount((prev) => prev - order.amount);
    }
  };

  const handleMatchOrders = async () => {
    if (!sellOrder) return;
    if (selectedOrders.length === 0) {
      return toast.error('Select at least one order.');
    }

    try {
      setLoading(true);
      await axios.post(`/admin/match-buy-orders/${sellOrder._id}`, {
        matches: selectedOrders.map((o) => ({
          buyOrderId: o._id,
          amount: o.amount
        }))});
      toast.success('Orders matched!');
      setSelectedOrders([]);
      setRemainingAmount(sellOrder.remainingAmount);
    } catch (err) {
      toast.error('Match failed.');
    } finally {
      setLoading(false);
    }
  };

  if (!sellOrder) return <LoadingSpinner/>

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 text-white">Match Buy Orders</h2>
      <div className="mb-3 text-lg text-white">
        <strong>Remaining Amount:</strong> {remainingAmount}
      </div>

      <table className="min-w-full text-sm text-white text-left">
        <thead>
          <tr className="bg-gray-800">
            <th className="p-3">User</th>
            <th className="p-3">Amount</th>
            <th className="p-3">Payment</th>
            <th className="p-3">Status</th>
            <th className="p-3">Select</th>
          </tr>
        </thead>
        <tbody>
          {buyOrders.map((order) => {
            const isSelected = selectedOrders.find((o) => o._id === order._id);
            const isOver = order.amount > remainingAmount;

            return (
              <tr key={order._id} className="border-t hover:bg-gray-900">
                <td className="p-3">{order.user?.fullName || 'N/A'}</td>
                <td className="p-3">{order.amount}</td>
                <td className="p-3">{order.paymentMethod.toUpperCase()}</td>
                <td className="p-3">
                  {isOver ? (
                    <span className="text-red-400 text-xs italic">Exceeds balance</span>
                  ) : (
                    order.status
                  )}
                </td>
                <td className="p-3">
                  <input
                    type="checkbox"
                    disabled={isOver}
                    checked={!!isSelected}
                    onChange={() => handleCheckboxChange(order)}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {hasMore && (
        <div className="mt-4">
          <button
            onClick={() => {
              const nextPage = page + 1;
              fetchBuyOrders(nextPage);
              setPage(nextPage);
            }}
            className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded text-white"
          >
            Load More
          </button>
        </div>
      )}

      <div className="mt-6">
        <button
          disabled={loading || selectedOrders.length === 0}
          onClick={handleMatchOrders}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Matching...' : 'Match Selected Orders'}
        </button>
      </div>
    </div>
  );
};

export default MatchSellRequestPage;