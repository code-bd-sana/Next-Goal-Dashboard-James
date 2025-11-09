
'use client'
import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";

// Define the TypeScript interface for payment data


// Payment data
const paymentData = [
  {
    id: 1,
    transactionId: "TXN78451",
    customer: "John Smith",
    email: "john@example.com",
    amount: "$239.00",
    date: "15 Jan, 2024",
    paymentMethod: "Credit Card",
    status: "Completed",
  },
  {
    id: 2,
    transactionId: "TXN78452",
    customer: "Sarah Johnson",
    email: "sarah@example.com",
    amount: "$159.00",
    date: "14 Jan, 2024",
    paymentMethod: "PayPal",
    status: "Pending",
  },
  {
    id: 3,
    transactionId: "TXN78453",
    customer: "Michael Brown",
    email: "michael@example.com",
    amount: "$399.00",
    date: "14 Jan, 2024",
    paymentMethod: "Credit Card",
    status: "Completed",
  },
  {
    id: 4,
    transactionId: "TXN78454",
    customer: "Emily Davis",
    email: "emily@example.com",
    amount: "$89.00",
    date: "13 Jan, 2024",
    paymentMethod: "Stripe",
    status: "Failed",
  },
  {
    id: 5,
    transactionId: "TXN78455",
    customer: "Robert Wilson",
    email: "robert@example.com",
    amount: "$299.00",
    date: "12 Jan, 2024",
    paymentMethod: "Bank Transfer",
    status: "Refunded",
  },
  {
    id: 6,
    transactionId: "TXN78456",
    customer: "Lisa Anderson",
    email: "lisa@example.com",
    amount: "$450.00",
    date: "11 Jan, 2024",
    paymentMethod: "Credit Card",
    status: "Completed",
  },
  {
    id: 7,
    transactionId: "TXN78457",
    customer: "David Miller",
    email: "david@example.com",
    amount: "$120.00",
    date: "10 Jan, 2024",
    paymentMethod: "PayPal",
    status: "Completed",
  },
  {
    id: 8,
    transactionId: "TXN78458",
    customer: "Jennifer Taylor",
    email: "jennifer@example.com",
    amount: "$199.00",
    date: "09 Jan, 2024",
    paymentMethod: "Credit Card",
    status: "Pending",
  },
  {
    id: 9,
    transactionId: "TXN78459",
    customer: "Christopher Lee",
    email: "chris@example.com",
    amount: "$320.00",
    date: "08 Jan, 2024",
    paymentMethod: "Stripe",
    status: "Completed",
  },
  {
    id: 10,
    transactionId: "TXN78460",
    customer: "Amanda White",
    email: "amanda@example.com",
    amount: "$75.00",
    date: "07 Jan, 2024",
    paymentMethod: "Bank Transfer",
    status: "Failed",
  },
  {
    id: 11,
    transactionId: "TXN78461",
    customer: "Daniel Harris",
    email: "daniel@example.com",
    amount: "$280.00",
    date: "06 Jan, 2024",
    paymentMethod: "Credit Card",
    status: "Refunded",
  },
  {
    id: 12,
    transactionId: "TXN78462",
    customer: "Michelle Clark",
    email: "michelle@example.com",
    amount: "$150.00",
    date: "05 Jan, 2024",
    paymentMethod: "PayPal",
    status: "Completed",
  },
];

const PaymentHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter payments based on search term and status filter
  const filteredPayments = useMemo(() => {
    return paymentData.filter((payment) => {
      const matchesSearch = 
        payment.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = statusFilter === "all" || payment.status === statusFilter;

      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, statusFilter]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPayments = filteredPayments.slice(startIndex, startIndex + itemsPerPage);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return pageNumbers;
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Payment History
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            View and manage all payment transactions
          </p>
        </div>

        <div className="flex items-center gap-3">
       
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search by transaction, email or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-80 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 placeholder-gray-400 shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:placeholder-gray-500 dark:focus:ring-blue-600"
            />
            <svg
              className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:focus:ring-blue-600"
            >
              <option value="all">All Status</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
              <option value="Refunded">Refunded</option>
            </select>
          </div>
        </div>

        <div className="text-sm text-gray-500 dark:text-gray-400">
          Showing {currentPayments.length} of {filteredPayments.length} payments
        </div>
      </div>
      
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Transaction ID
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Customer
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Amount
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Date
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Payment Method
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Status
              </TableCell>
           
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {currentPayments.map((payment) => (
              <TableRow key={payment.id} className="">
                <TableCell className="py-3 font-medium text-gray-800 text-theme-sm dark:text-white/90">
                  {payment.transactionId}
                </TableCell>
                <TableCell className="py-3">
                  <div>
                    <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {payment.customer}
                    </p>
                    <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                      {payment.email}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="py-3 font-medium text-gray-800 text-theme-sm dark:text-white/90">
                  {payment.amount}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {payment.date}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {payment.paymentMethod}
                </TableCell>
                <TableCell className="py-3">
                  <Badge
                    size="sm"
                    color={
                      payment.status === "Completed"
                        ? "success"
                        : payment.status === "Pending"
                        ? "warning"
                        : payment.status === "Failed"
                        ? "error"
                        : "gray"
                    }
                  >
                    {payment.status}
                  </Badge>
                </TableCell>
          
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {currentPayments.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No payments found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex flex-col gap-4 items-center justify-between mt-4 sm:flex-row">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredPayments.length)} of {filteredPayments.length} results
        </p>
        <div className="flex items-center gap-2">
          {/* Previous Button */}
          <button 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-theme-sm font-medium text-gray-700 hover:opacity-90 transition-opacity ${
              currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            style={{ backgroundColor: '#FFD700' }}
          >
            Previous
          </button>

          {/* Page Numbers */}
          {getPageNumbers().map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-theme-sm font-medium hover:opacity-90 transition-opacity ${
                currentPage === page
                  ? 'border-gray-800 text-gray-800'
                  : 'border-gray-300 text-gray-700'
              }`}
              style={{ backgroundColor: '#FFD700' }}
            >
              {page}
            </button>
          ))}

          {/* Next Button */}
          <button 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-theme-sm font-medium text-gray-700 hover:opacity-90 transition-opacity ${
              currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            style={{ backgroundColor: '#FFD700' }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;