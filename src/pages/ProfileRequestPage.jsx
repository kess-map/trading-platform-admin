import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../utils/axios'
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast'


export default function AdminUserDetailPage() {
  const {id} = useParams()
  const [pendingProfileEditRequest, setPendingProfileEditRequest] = useState(null)

    const fetchPendingProfileEditRequest = async (profId) => {
      const res = await axios.get(`/admin/profile-request/${profId}`);
      setPendingProfileEditRequest(res.data.data)
    };
  
  useEffect(()=>{
    try {
      fetchPendingProfileEditRequest(id)
      
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message || 'Something went wrong')
    }
  },[])

  const handleApproveEdit = async(requestId) => {
    try {
      await axios.post(`/admin/profile-request/${requestId}`, {action : 'approved'})
      toast.success('Profile Edit Request approved successfully')
      navigate('/profile-requests')
    } catch (error) {
      toast.error(error.response.data.message || 'Something went wrong')
    }
  };

  const handleDeclineEdit = async(requestId) => {
    try {
      await axios.post(`/admin/profile-request/${requestId}`, {action : 'declined'})
      toast.success('Profile Edit Request declined successfully')
      navigate('/profile-requests')
    } catch (error) {
      toast.error(error.response.data.message || 'Something went wrong')
    }
  };

  return (
    <> 
    {!pendingProfileEditRequest ? <LoadingSpinner/> : <div className="p-6 space-y-6 max-w-4xl mx-auto">
        <h1 className="text-2xl text-white font-bold mb-4">Current User Details</h1>
        <div className="bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl border border-gray-800 text-white p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><strong>Full Name:</strong> {pendingProfileEditRequest.user.fullName}</div>
        <div><strong>Username:</strong> {pendingProfileEditRequest.user.username}</div>
        <div><strong>Email:</strong> {pendingProfileEditRequest.user.email}</div>
        <div><strong>Phone:</strong> {pendingProfileEditRequest.user.phoneNumber}</div>
        <div><strong>Country:</strong> {pendingProfileEditRequest.user.country}</div>
      </div>
      <h1 className="text-2xl text-white font-bold mb-4">Requested Update Details</h1>

      {pendingProfileEditRequest && <div className="bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl border border-gray-800 text-white p-4 mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Object.entries(pendingProfileEditRequest?.updates).map(([key, value]) => (
            <div key={key}>
              <strong>{key}:</strong> {value}
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-4">
          <button
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            onClick={() => handleApproveEdit(pendingProfileEditRequest._id)}
          >
            Approve
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            onClick={()=>handleDeclineEdit(pendingProfileEditRequest._id)}
          >
            Decline
          </button>
        </div>
      </div>}
      </div>}
    </>
  );
}
