'use client'
import { useMyEmailQuery } from '@/feature/EmailApi';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';

export default function EmailListPage() {
  const { data: session } = useSession();
  const userEmail = session?.user?.email;

  // State for filters and pagination
  const [filters, setFilters] = useState({
    search: '',
    status: 'All',
    dateFilter: 'All'
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10
  });

  // Use query with all parameters
  const { data: allEmail, isLoading, error, refetch } = useMyEmailQuery({
    email: userEmail,
    ...pagination,
    ...filters
  }, {
    skip: !userEmail,
  });

  const getColor = (score) => {
    if (score >= 70) return "bg-green-500";
    if (score >= 40) return "bg-yellow-400";
    return "bg-red-500";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "opened":
        return "text-green-400 bg-green-500/20";
      case "sent":
        return "text-blue-400 bg-blue-500/20";
      case "delivered":
        return "text-purple-400 bg-purple-500/20";
      default:
        return "text-yellow-400 bg-yellow-500/20";
    }
  };

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    // Reset to first page when filters change
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      search: '',
      status: 'All',
      dateFilter: 'All'
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Debounced search to avoid too many API calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (filters.search !== '') {
        setPagination(prev => ({ ...prev, page: 1 }));
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [filters.search]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#06152B] text-white px-6 py-10 flex items-center justify-center">
        <div className="text-xl">Loading emails...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#06152B] text-white px-6 py-10 flex items-center justify-center">
        <div className="text-xl text-red-400">Error loading emails</div>
      </div>
    );
  }

  const emails = allEmail?.data || [];
  const paginationInfo = allEmail?.pagination;

  return (
    <div className="min-h-screen bg-[#06152B] text-white px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Email History</h1>

      {/* FILTER BAR */}
      <div className="bg-[#10243E] p-5 rounded-xl shadow-xl w-full max-w-6xl mx-auto mb-8">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search by subject, sender or recipient..."
            className="bg-[#0B1B31] border border-gray-700 px-4 py-2 w-72 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />

          {/* Status Filter */}
          {/* <select 
            className="bg-[#0B1B31] px-4 py-2 rounded-lg border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="sent">Sent</option>
            <option value="opened">Opened</option>
            <option value="delivered">Delivered</option>
          </select> */}

          {/* Date Filter */}
          <select 
            className="bg-[#0B1B31] px-4 py-2 rounded-lg border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            value={filters.dateFilter}
            onChange={(e) => handleFilterChange('dateFilter', e.target.value)}
          >
            <option value="All">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>

          {/* Results Per Page */}
          <select 
            className="bg-[#0B1B31] px-4 py-2 rounded-lg border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            value={pagination.limit}
            onChange={(e) => setPagination(prev => ({ ...prev, limit: parseInt(e.target.value), page: 1 }))}
          >
            <option value="5">5 per page</option>
            <option value="10">10 per page</option>
            <option value="20">20 per page</option>
            <option value="50">50 per page</option>
          </select>

          {/* Clear Filters Button */}
          <button 
            onClick={clearFilters}
            className="bg-gray-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-gray-500 transition-colors"
          >
            Clear Filters
          </button>

          {/* Refresh Button */}
          {/* <button 
            onClick={refetch}
            className="bg-blue-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors"
          >
            Refresh
          </button> */}
        </div>

        {/* Results Count */}
        <div className="mt-4 text-sm text-gray-300">
          Showing {emails.length} of {paginationInfo?.totalEmails || 0} emails
          {filters.search && ` • Search: "${filters.search}"`}
          {filters.status !== 'All' && ` • Status: ${filters.status}`}
          {filters.dateFilter !== 'All' && ` • Date: ${filters.dateFilter}`}
        </div>
      </div>

      {/* TABLE CONTAINER */}
      <div className="bg-[#10243E] rounded-xl shadow-xl w-full max-w-6xl mx-auto">
        {emails.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <div className="text-4xl mb-4">📧</div>
            <div className="text-xl">No emails found</div>
            <div className="text-sm mt-2">
              {filters.search || filters.status !== 'All' || filters.dateFilter !== 'All' 
                ? "Try changing your filters" 
                : "Your email history will appear here"}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-gray-300 border-b border-gray-600">
                <tr>
                  <th className="py-4 px-4 font-semibold">Date & Time</th>
                  <th className="py-4 px-4 font-semibold">Subject</th>
                  <th className="py-4 px-4 font-semibold">Recipient</th>
                  <th className="py-4 px-4 font-semibold">Status</th>
                  <th className="py-4 px-4 font-semibold">Attachments</th>
                </tr>
              </thead>

              <tbody>
                {emails.map((item, i) => (
                  <tr
                    key={i}
                    className="border-b border-gray-700 hover:bg-[#0D2038] transition duration-200"
                  >
                    {/* DATE & TIME */}
                    <td className="py-4 px-4">
                      <div className="text-sm font-medium text-white">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(item.createdAt).toLocaleTimeString()}
                      </div>
                    </td>

                    {/* SUBJECT */}
                    <td className="py-4 px-4">
                      <div className="font-semibold text-white max-w-xs truncate" title={item.subject}>
                        {item.subject || "No Subject"}
                      </div>
                      {item.coach?.name && (
                        <div className="text-xs text-gray-400 mt-1">
                          Coach: {item.coach.name}
                        </div>
                      )}
                    </td>

                    {/* RECIPIENT */}
                    <td className="py-4 px-4">
                      <div className="text-sm text-white" title={item.recipient}>
                        {item.recipient}
                      </div>
                      {item.coach?.school && (
                        <div className="text-xs text-gray-400 mt-1">
                          {item.coach.school}
                        </div>
                      )}
                    </td>

                    {/* STATUS */}
                    <td className="py-4 px-4">
                      <span 
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}
                        title={item.status}
                      >
                        {item.status === "opened" && "📬 "}
                        {item.status === "sent" && "✉️ "}
                        {item.status === "delivered" && "✅ "}
                        {item.status?.charAt(0).toUpperCase() + item.status?.slice(1) || "Sent"}
                      </span>
                    </td>

                
                 

                    {/* ATTACHMENTS */}
                    <td className="py-4 px-4">
                      <div className="text-center">
                        {item.attachmentsCount > 0 ? (
                          <span 
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400"
                            title={`${item.attachmentsCount} attachment(s)`}
                          >
                            📎 {item.attachmentsCount}
                          </span>
                        ) : (
                          <span className="text-gray-500 text-xs">None</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* PAGINATION */}
        {paginationInfo && paginationInfo.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-400">
              Page {paginationInfo.currentPage} of {paginationInfo.totalPages} • 
              Total {paginationInfo.totalEmails} emails
            </div>
            
            <div className="flex gap-2 flex-wrap justify-center">
              {/* Previous Button */}
              <button 
                onClick={() => handlePageChange(paginationInfo.currentPage - 1)}
                disabled={!paginationInfo.hasPrev}
                className={`px-4 py-2 rounded text-sm font-medium transition ${
                  paginationInfo.hasPrev
                    ? "bg-[#0B1B31] border border-gray-700 text-gray-300 hover:bg-gray-700"
                    : "bg-gray-800 text-gray-500 cursor-not-allowed"
                }`}
              >
                Previous
              </button>

              {/* Page Numbers */}
              {Array.from({ length: Math.min(5, paginationInfo.totalPages) }, (_, i) => {
                let pageNum;
                if (paginationInfo.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (paginationInfo.currentPage <= 3) {
                  pageNum = i + 1;
                } else if (paginationInfo.currentPage >= paginationInfo.totalPages - 2) {
                  pageNum = paginationInfo.totalPages - 4 + i;
                } else {
                  pageNum = paginationInfo.currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-1 rounded text-sm font-medium transition ${
                      paginationInfo.currentPage === pageNum
                        ? "bg-yellow-500 text-black"
                        : "bg-[#0B1B31] border border-gray-700 text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              {/* Next Button */}
              <button 
                onClick={() => handlePageChange(paginationInfo.currentPage + 1)}
                disabled={!paginationInfo.hasNext}
                className={`px-4 py-2 rounded text-sm font-medium transition ${
                  paginationInfo.hasNext
                    ? "bg-[#0B1B31] border border-gray-700 text-gray-300 hover:bg-gray-700"
                    : "bg-gray-800 text-gray-500 cursor-not-allowed"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

 
   
    </div>
  );
}