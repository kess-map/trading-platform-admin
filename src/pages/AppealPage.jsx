import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../utils/axios';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const AppealDetailsPage = () => {
  const { id } = useParams();
  const [appeal, setAppeal] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [resolutionNote, setResolutionNote] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchAppeal = async () => {
    try {
      const res = await axios.get(`/appeals/${id}`);
      setAppeal(res.data.data);
    } catch (err) {
      toast.error('Failed to fetch appeal details');
    }
  };

  useEffect(() => {
    fetchAppeal();
  }, [id]);

const handleSubmit = async () => {
    if (!resolutionNote.trim()) return toast.error('Resolution note is required.');
    setLoading(true);
    try {
    await axios.put(`/appeals/${id}`, {
        resolutionNote, status: actionType
    });
    toast.success(`Appeal marked as ${actionType}`);
    setModalOpen(false);
    setResolutionNote('');
    fetchAppeal();
    } catch (err) {
    toast.error('Failed to update appeal');
    } finally {
    setLoading(false);
    }
}

  if (!appeal) return <LoadingSpinner/>

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Appeal Details</h1>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Appeal Info</h2>
        <p><strong>Status:</strong> {appeal.status}</p>
        <p><strong>Reason:</strong> {appeal.reason}</p>
        <p><strong>Created At:</strong> {new Date(appeal.createdAt).toLocaleString()}</p>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Appealed By</h2>
        <p><strong>Name:</strong> {appeal.appealedBy?.fullName || 'N/A'}</p>
        <p><strong>Email:</strong> {appeal.appealedBy?.email || 'N/A'}</p>
        <p><strong>Username:</strong> {appeal.appealedBy?.username || 'N/A'}</p>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Appealed Against</h2>
        <p><strong>Name:</strong> {appeal.appealedAgainst?.fullName || 'N/A'}</p>
        <p><strong>Email:</strong> {appeal.appealedAgainst?.email || 'N/A'}</p>
        <p><strong>Username:</strong> {appeal.appealedAgainst?.username || 'N/A'}</p>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Order Info</h2>
        <p><strong>Order ID:</strong> {appeal.order?._id}</p>
        <p><strong>Buyer:</strong> {appeal.order?.buyer?.fullName || 'N/A'}</p>
        <p><strong>Seller:</strong> {appeal.order?.seller?.fullName || 'N/A'}</p>
        <p><strong>Amount:</strong> {appeal.order?.amount?.toLocaleString()} CHT</p>
      </div>
       {appeal?.status === 'pending' && (
        <div className="flex gap-4 mt-6">
            <button
            onClick={() => {
                setActionType('resolved');
                setModalOpen(true);
            }}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
            >
            Mark as Resolved
            </button>
            <button
            onClick={() => {
                setActionType('rejected');
                setModalOpen(true);
            }}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
            >
            Mark as Rejected
            </button>
        </div>
        )}

        {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
            <div className="bg-white text-black rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Mark as {actionType}</h2>
            <textarea
                rows={4}
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
                className="w-full border border-gray-300 rounded p-2 mb-4"
                placeholder="Enter resolution note..."
            />
            <div className="flex justify-end gap-3">
                <button
                onClick={() => {
                    setModalOpen(false);
                    setResolutionNote('');
                }}
                className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
                >
                Cancel
                </button>
                <button
                onClick={handleSubmit}
                className={`text-white px-4 py-2 rounded ${
                    actionType === 'resolved'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
                >
                {loading ? 'Submitting...' : `Confirm ${actionType}`}
                </button>
            </div>
            </div>
        </div>
        )}
    </div>
  );
};

export default AppealDetailsPage;
