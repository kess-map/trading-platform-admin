import { useEffect, useState } from 'react';
import axios from '../utils/axios';;

const InvestmentsPage = () => {
  const [investments, setInvestments] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const fetchInvestments = async () => {
    const queryParams = new URLSearchParams({
      search,
      page,
      sortBy,
      order: sortOrder,
    });
    if (statusFilter) queryParams.append('status', statusFilter);

    const res = await axios.get(`/admin/investments?${queryParams}`);
    setInvestments(res.data.data.investments);
    setPages(res.data.data.pages);
  };

  useEffect(() => {
    fetchInvestments();
  }, [search, page, sortBy, sortOrder, statusFilter]);

  const handleSortChange = (key) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('asc');
    }
  };

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full md:w-1/3"
        />

        <div className="flex overflow-x-auto md:overflow-hidden gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded bg-white text-black"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>

          <button onClick={() => handleSortChange('planDurationDays')} className="px-3 py-2 bg-gray-800 text-white rounded">
            Sort by Duration {sortBy === 'duration' && `(${sortOrder})`}
          </button>
          <button onClick={() => handleSortChange('amount')} className="px-3 py-2 bg-gray-800 text-white rounded">
            Sort by Amount {sortBy === 'amount' && `(${sortOrder})`}
          </button>
          <button onClick={() => handleSortChange('roiPercentage')} className="px-3 py-2 bg-gray-800 text-white rounded">
            Sort by ROI Percentage {sortBy === 'roiPercentage' && `(${sortOrder})`}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-white">
          <thead>
            <tr className="bg-gray-800 text-left">
              <th className="p-3">User</th>
              <th className="p-3">Email</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Duration (days)</th>
              <th className="p-3">ROI (%)</th>
              <th className="p-3">Status</th>
              <th className="p-3">Created</th>
            </tr>
          </thead>
          <tbody>
            {investments.map((inv) => (
              <tr key={inv._id} className="border-t hover:bg-gray-900">
                <td className="p-3">{inv.user?.fullName}</td>
                <td className="p-3">{inv.user?.email}</td>
                <td className="p-3">₦{inv.amount.toLocaleString()}</td>
                <td className="p-3">{inv.planDurationDays} days</td>
                <td className="p-3">{inv.roiPercentage} %</td>
                <td className="p-3 capitalize">{inv.roiCredited ? 'Completed' : 'Active'}</td>
                <td className="p-3">{new Date(inv.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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

export default InvestmentsPage;

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