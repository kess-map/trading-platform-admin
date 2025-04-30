import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../utils/axios';
import LoadingSpinner from '../components/LoadingSpinner';

const SellRequestPage = () => {
  const { id } = useParams();
  const [sellOrder, setSellOrder] = useState(null);
  const [matchedOrder, setMatchedOrder] = useState([]);

  const navigate = useNavigate();

  const goToMatchPage = () => {
    navigate(`/sell-requests/${sellOrder._id}/match`);
  };

  const fetchOrder = async () => {
    const res = await axios.get(`/admin/sell-orders/${id}`);
    setSellOrder(res.data.data.sellOrder);
    setMatchedOrder(res.data.data.matchedOrder);
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  if (!sellOrder) return <LoadingSpinner/>

  return (
    <div className="p-6 max-w-3xl mx-auto bg-gray-900 shadow rounded text-white">
      <h2 className="text-2xl font-bold mb-4">Sell Order Details</h2>
      <div className="mb-4">
        <p><strong>User:</strong> {sellOrder.user?.fullName}</p>
        <p><strong>Email:</strong> {sellOrder.user?.email}</p>
        <p><strong>Amount:</strong> ₦{sellOrder.amount}</p>
        <p><strong>Remaining:</strong> ₦{sellOrder.remainingAmount}</p>
        <p><strong>Payment Method:</strong> {sellOrder.paymentMethod.toUpperCase()}</p>
        <p><strong>Status:</strong> {sellOrder.status}</p>
        <p><strong>Created At:</strong> {new Date(sellOrder.createdAt).toLocaleString()}</p>
      </div>

      {sellOrder.status === 'approved' && sellOrder.remainingAmount > 0 && (<div className="mt-4">
    <button
      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow transition duration-200"
      onClick={goToMatchPage}
    >
      Match
    </button>
  </div>)}

  {matchedOrder && matchedOrder.length > 0 ? (
  <div className="mt-6 space-y-6">
    <h3 className="text-xl font-semibold mb-2">Matched Orders</h3>
    {matchedOrder.map((order, index) => (
      <div key={order._id || index} className="p-4 bg-gray-800 rounded shadow">
        <p><strong>Buyer:</strong> {order.buyer?.fullName}</p>
        <p><strong>Buyer Email:</strong> {order.buyer?.email}</p>
        <p><strong>Buy Order Amount:</strong> ₦{order.buyOrder?.amount}</p>
        <p><strong>Matched Amount:</strong> ₦{order.amount}</p>
        <p><strong>Status:</strong> {order.status}</p>
        {order.confirmedAt && (
          <p><strong>Confirmed At:</strong> {new Date(order.confirmedAt).toLocaleString()}</p>
        )}
        {order.proofOfPayment && (
          <div className="mt-2">
            <h4 className="font-semibold">Proof of Payment</h4>
            <img src={order.proofOfPayment} alt="Proof of Payment" className="max-w-full mt-1 border rounded" />
          </div>
        )}
      </div>
    ))}
  </div>
) : (
  <p className="mt-6 text-gray-500 italic">No matched orders found for this sell order.</p>
)}
    </div>
  );
};

export default SellRequestPage;
