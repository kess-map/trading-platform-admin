import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../utils/axios';
import toast from 'react-hot-toast';

export default function AdminUserTradeHistoryPage() {
  const { id } = useParams();
  const [tab, setTab] = useState('buy');

  const [buyOrders, setBuyOrders] = useState([]);
  const [sellOrders, setSellOrders] = useState([]);

  const [buyPage, setBuyPage] = useState(1);
  const [sellPage, setSellPage] = useState(1);

  const [buyTotalPages, setBuyTotalPages] = useState(1);
  const [sellTotalPages, setSellTotalPages] = useState(1);

  const LIMIT = 10;

  const fetchBuyOrders = async (page = 1) => {
    try {
      const res = await axios.get(`/admin/user/${id}/buy-orders?page=${page}&limit=${LIMIT}`);
      setBuyOrders(res.data.data.orders);
      setBuyTotalPages(res.data.data.totalPages);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load buy orders');
    }
  };

  const fetchSellOrders = async (page = 1) => {
    try {
      const res = await axios.get(`/admin/user/${id}/sell-orders?page=${page}&limit=${LIMIT}`);
      setSellOrders(res.data.data.orders);
      setSellTotalPages(res.data.data.totalPages);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load sell orders');
    }
  };

  useEffect(() => {
    fetchBuyOrders(buyPage);
  }, [id, buyPage]);

  useEffect(() => {
    fetchSellOrders(sellPage);
  }, [id, sellPage]);

  const renderPagination = (currentPage, totalPages, onPageChange) => (
    <div className="flex justify-center mt-4 gap-2 flex-wrap">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50"
      >
        Prev
      </button>
      <span className="text-white px-2 py-1">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto text-white">
      <h1 className="text-2xl font-bold mb-6 text-center">Trade History</h1>

      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-4 flex-wrap">
        <button
          className={`px-4 py-2 rounded ${tab === 'buy' ? 'bg-blue-600' : 'bg-gray-700'} hover:bg-blue-700`}
          onClick={() => setTab('buy')}
        >
          Buy Orders
        </button>
        <button
          className={`px-4 py-2 rounded ${tab === 'sell' ? 'bg-green-600' : 'bg-gray-700'} hover:bg-green-700`}
          onClick={() => setTab('sell')}
        >
          Sell Orders
        </button>
      </div>

      {/* Table container */}
      <div className="overflow-x-auto">
        {tab === 'buy' ? (
          <>
            <table className="min-w-full text-left border border-gray-700">
              <thead className="bg-gray-800">
                <tr>
                  <th className="p-2">Order ID</th>
                  <th className="p-2">Amount</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Payment Method</th>
                  <th className="p-2">Created At</th>
                </tr>
              </thead>
              <tbody>
                {buyOrders.map((order) => (
                  <tr key={order._id} className="border-t border-gray-700">
                    <td className="p-2">{order._id}</td>
                    <td className="p-2">{order.amount.toLocaleString()}</td>
                    <td className="p-2">{order.status}</td>
                    <td className="p-2">{order.paymentMethod}</td>
                    <td className="p-2">{new Date(order.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {renderPagination(buyPage, buyTotalPages, setBuyPage)}
          </>
        ) : (
          <>
            <table className="min-w-full text-left border border-gray-700">
              <thead className="bg-gray-800">
                <tr>
                  <th className="p-2">Order ID</th>
                  <th className="p-2">Amount</th>
                  <th className="p-2">Remaining</th>
                  <th className="p-2">Payment Method</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Created At</th>
                </tr>
              </thead>
              <tbody>
                {sellOrders.map((order) => (
                  <tr key={order._id} className="border-t border-gray-700">
                    <td className="p-2">{order._id}</td>
                    <td className="p-2">{order.amount.toLocaleString()}</td>
                    <td className="p-2">{order.remainingAmount.toLocaleString()}</td>
                    <td className="p-2">{order.paymentMethod}</td>
                    <td className="p-2">{order.status}</td>
                    <td className="p-2">{new Date(order.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {renderPagination(sellPage, sellTotalPages, setSellPage)}
          </>
        )}
      </div>
    </div>
  );
}