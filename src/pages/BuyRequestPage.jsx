import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../utils/axios';
import LoadingSpinner from '../components/LoadingSpinner';

const BuyRequestPage = () => {
  const { id } = useParams();
  const [buyOrder, setBuyOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBuyOrder = async () => {
      try {
        const res = await axios.get(`/admin/buy-orders/${id}`);
        setBuyOrder(res.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBuyOrder();
  }, [id]);

  if (loading) return <LoadingSpinner/>
  if (!buyOrder) return <div className="p-4">Buy Order not found</div>;

  const { user, amount, paymentMethod, status, proofOfPayment, matchedTo } = buyOrder;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 text-white">Buy Order Details</h2>
      <div className="mb-4 text-white">
        <p><strong>User:</strong> {user?.fullName} ({user?.email})</p>
        <p><strong>Amount:</strong> ₦{amount}</p>
        <p><strong>Payment Method:</strong> {paymentMethod}</p>
        <p><strong>Status:</strong> {status}</p>
      </div>

      {matchedTo && (
        <div className="mb-4">
          <h3 className="font-semibold">Matched Sell Order</h3>
          <p><strong>User:</strong> {matchedTo.user?.fullName} ({matchedTo.user?.email})</p>
          <p><strong>Amount:</strong> ₦{matchedTo.amount}</p>
        </div>
      )}

      {proofOfPayment && (
        <div className="mb-4">
          <h3 className="font-semibold">Proof of Payment</h3>
          <img
            src={proofOfPayment}
            alt="Proof of Payment"
            className="max-w-sm border rounded"
          />
        </div>
      )}
    </div>
  );
};

export default BuyRequestPage;
