import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../utils/axios'
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast'


export default function AdminUserDetailPage() {
  const navigate = useNavigate()
  const {id} = useParams()
  const [pendingVerificationRequest, setPendingVerificationRequest] = useState(null)

    const fetchPendingVerificationRequest = async (profId) => {
      const res = await axios.get(`/admin/id-verification/${profId}`);
      setPendingVerificationRequest(res.data.data)
    };
  
  useEffect(()=>{
    try {
      fetchPendingVerificationRequest(id)
      
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message || 'Something went wrong')
    }
  },[])

  const handleApproveVerification = async(requestId) => {
    try {
      await axios.post(`/admin/id-verification/${requestId}`, {action : 'approved'})
      toast.success('Verification Request approved successfully')
      navigate('/id-verifications')
    } catch (error) {
      toast.error(error.response.data.message || 'Something went wrong')
    }
  };

  const handleDeclineVerification = async(requestId) => {
    try {
      await axios.post(`/admin/id-verification/${requestId}`, {action : 'declined'})
      toast.success('Verification Request declined successfully')
      navigate('/id-verifications')
    } catch (error) {
      toast.error(error.response.data.message || 'Something went wrong')
    }
  };

  return (
    <> 
    {!pendingVerificationRequest ? <LoadingSpinner/> : <div className="bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl border border-gray-800 text-white p-4 mt-6">
        <h2 className="text-lg font-semibold mb-2">Document Verification</h2>
        <p><strong>Country:</strong> {pendingVerificationRequest.country}</p>
        <p><strong>ID Type:</strong> {pendingVerificationRequest.type}</p>
        <p><strong>Requested At:</strong> {new Date(pendingVerificationRequest.createdAt).toLocaleDateString('en-GB')}</p>
        <div className="flex flex-col md:flex-row gap-4 mt-2">
            <div>
                <p className='text-center'>Front Image</p>
                <img src={pendingVerificationRequest.frontImage} alt="Front ID" className="rounded w-full sm:w-52 border" />
            </div>
            <div>
                <p className='text-center'>Back Image</p>
                <img src={pendingVerificationRequest.backImage} alt="Back ID" className="rounded w-full sm:w-52 border" />
            </div>
        </div>

        {pendingVerificationRequest.status === 'pending' ? (
          <div className="flex gap-2 mt-4">
            <button
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              onClick={()=>handleApproveVerification(pendingVerificationRequest._id)}
            >
              Approve
            </button>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              onClick={()=>handleDeclineVerification(pendingVerificationRequest._id)}
            >
              Decline
            </button>
          </div>
        ) : (
          <div className="mt-4">
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                pendingVerificationRequest.status === 'approved'
                  ? 'bg-green-700 text-white'
                  : 'bg-red-700 text-white'
              }`}
            >
              {pendingVerificationRequest.status.charAt(0).toUpperCase() + pendingVerificationRequest.status.slice(1)}
            </span>
          </div>
        )}
      </div>}
    </>
  );
}
