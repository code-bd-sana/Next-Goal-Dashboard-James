import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import Image from "next/image";

// Define the TypeScript interface for payment data


// Payment data
const paymentData= [
  {
    id: 1,
    customer: "John Smith",
    email: "john@example.com",
    amount: "$239.00",
    date: "15 Jan, 2024",
    paymentMethod: "Credit Card",
    status: "Completed",
    avatar: "/images/user/user-01.jpg",
  },
  {
    id: 2,
    customer: "Sarah Johnson",
    email: "sarah@example.com",
    amount: "$159.00",
    date: "14 Jan, 2024",
    paymentMethod: "PayPal",
    status: "Pending",
    avatar: "/images/user/user-02.jpg",
  },
  {
    id: 3,
    customer: "Michael Brown",
    email: "michael@example.com",
    amount: "$399.00",
    date: "14 Jan, 2024",
    paymentMethod: "Credit Card",
    status: "Completed",
    avatar: "/images/user/user-03.jpg",
  },
  {
    id: 4,
    customer: "Emily Davis",
    email: "emily@example.com",
    amount: "$89.00",
    date: "13 Jan, 2024",
    paymentMethod: "Stripe",
    status: "Failed",
    avatar: "/images/user/user-04.jpg",
  },
  {
    id: 5,
    customer: "Robert Wilson",
    email: "robert@example.com",
    amount: "$299.00",
    date: "12 Jan, 2024",
    paymentMethod: "Bank Transfer",
    status: "Refunded",
    avatar: "/images/user/user-05.jpg",
  },
];

export default function RecentPayments() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Recent Payments
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            See all
          </button>
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
            {paymentData.map((payment) => (
              <TableRow key={payment.id} className="">
                <TableCell className="py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 overflow-hidden rounded-full">
                      <Image
                        width={40}
                        height={40}
                        src={payment.avatar}
                        className="h-10 w-10 object-cover"
                        alt={payment.customer}
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {payment.customer}
                      </p>
                      <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                        {payment.email}
                      </span>
                    </div>
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
      </div>
    </div>
  );
}