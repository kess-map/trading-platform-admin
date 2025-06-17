import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../utils/axios'
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast'


export default function AdminUserDetailPage() {
  const {id} = useParams()
  const navigate = useNavigate()
  
  const [user, setUser] = useState(null)
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');
  
  const fetchUser = async (userId) => {
      const res = await axios.get(`/admin/user/${userId}`);
      setUser(res.data.data)
    };
  
  useEffect(()=>{
    try {
      fetchUser(id)
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message || 'Something went wrong')
    }
  },[])

  const handleSuspend = async() => {
    try {
      await axios.post(`/admin/user/suspend/${id}`)
      toast.success(!user.isSuspended ? 'User suspended successfully' : 'User unsuspended successfully')
    } catch (error) {
      toast.error(error.response.data.message || 'Something went wrong')
    }
    setUser(prev => ({ ...prev, isSuspended: !prev.isSuspended }));
  };

  const handleTopUp = () => {
    setShowTopUpModal(true);
  };

  const handleMakeAdmin = async() => {
    try {
      await axios.post(`/admin/user/role/${id}`)
    } catch (error) {
      toast.error(error.response.data.message || 'Something went wrong')
    }

    setUser((prev) => ({
      ...prev,
      role: prev.role === 'USER' ? 'ADMIN' : "USER"
    }));

    toast.success('Role Updated Successfully')
  };

  const handleConfirmTopUp = async() => {
    if (!topUpAmount || isNaN(topUpAmount)) {
      toast.error('Enter a valid amount');
      return;
    }

    try {
      await axios.post(`/admin/user/top-up/${id}`, {amount: topUpAmount})
    } catch (error) {
      toast.error(error.response.data.message || 'Something went wrong')
    }
    setUser((prev) => ({
      ...prev,
      availableBalance: prev.availableBalance + Number(topUpAmount)
    }));
    setShowTopUpModal(false);
    setTopUpAmount('');
    toast.success('Wallet topped up successfully');
  };

  return (
    <> 
    {!user ? <LoadingSpinner/> : <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <h1 className="text-2xl text-white font-bold mb-4">User Details</h1>

      <div className="bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl border border-gray-800 text-white p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><strong>Full Name:</strong> {user.fullName}</div>
        <div><strong>Username:</strong> {user.username}</div>
        <div><strong>Email:</strong> {user.email}</div>
        <div><strong>Phone:</strong> {user.phoneNumber}</div>
        <div><strong>Country:</strong> {user.country}</div>
        <div><strong>Referral Code:</strong> {user.referralCode}</div>
        <div><strong>Available Balance:</strong> {user.availableBalance.toLocaleString()} CHT</div>
        <div><strong>Staked Balance:</strong> {user.stakedBalance.toLocaleString()} CHT</div>
        <div><strong>Referral Bonus Balance:</strong> {user.referralBonusBalance.toLocaleString()} CHT</div>
        <div><strong>Phone Verified:</strong> {user.isPhoneVerified ? 'Yes' : 'No'}</div>
        <div><strong>Document Verified:</strong> {user.isDocumentVerified ? 'Yes' : 'No'}</div>
        <div><strong>Suspended:</strong> {user.isSuspended ? 'Yes' : 'No'}</div>
        <div><strong>Role:</strong> {user.role}</div>
      </div>

      {/* Admin Actions */}
      <div className="flex flex-wrap gap-3 mt-4">
        <button
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
          onClick={handleTopUp}
        >
          Top-up Wallet
        </button>

        <button
          className={`px-4 py-2 rounded transition ${
            user.isSuspended ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
          } text-white`}
          onClick={handleSuspend}
        >
          {user.isSuspended ? 'Unsuspend User' : 'Suspend User'}
        </button>

        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          onClick={handleMakeAdmin}
        >
          Make {user.role === 'USER' ? 'ADMIN' : "USER"}
        </button>

        <button
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
          onClick={() => navigate(`/user/${id}/trade-history`)}
        >
          View Trade History
        </button>
      </div>
    </div>}
    {showTopUpModal && (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-80 space-y-4 text-black relative">
        <h2 className="text-lg font-semibold">Top-up Wallet</h2>
        <input
          type="number"
          placeholder="Enter amount"
          value={topUpAmount}
          onChange={(e) => setTopUpAmount(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
        />
        <div className="flex justify-end gap-2 mt-2">
          <button
            className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
            onClick={() => setShowTopUpModal(false)}
          >
            Cancel
          </button>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={handleConfirmTopUp}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )}
    </>
  );
}
