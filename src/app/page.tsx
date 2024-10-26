'use client';

import { useState } from "react";
// import AppBar from "./_components/appBar";
import ReportFilterForm from "./reports/filter";
import SearchInput from "./_components/searchInput";
import PaginationLimitSelect from "./_components/pagination/limit";
import ReactPaginationStyle from "./_components/pagination/pagination";

const financeReportData = [
  {
    id: 1,
    date: "2024/10/01",
    description: "Office Supplies",
    category: "Expenses",
    amount: "150.00",
    status: "Paid",
  },
  {
    id: 2,
    date: "2024/10/02",
    description: "Client Payment",
    category: "Income",
    amount: "1,200.00",
    status: "Paid",
  },
  {
    id: 3,
    date: "2024/10/03",
    description: "Electricity Bill",
    category: "Expenses",
    amount: "200.00",
    status: "Pending",
  },
  {
    id: 4,
    date: "2024/10/05",
    description: "Internet Subscription",
    category: "Expenses",
    amount: "100.00",
    status: "Paid",
  },
  {
    id: 5,
    date: "2024/10/07",
    description: "Consultation Fees",
    category: "Income",
    amount: "750.00",
    status: "Paid",
  },
  {
    id: 6,
    date: "2024/10/02",
    description: "Client Payment",
    category: "Income",
    amount: "1,200.00",
    status: "Paid",
  },
  {
    id: 7,
    date: "2024/10/03",
    description: "Electricity Bill",
    category: "Expenses",
    amount: "200.00",
    status: "Pending",
  },
  {
    id: 8,
    date: "2024/10/05",
    description: "Internet Subscription",
    category: "Expenses",
    amount: "100.00",
    status: "Paid",
  },
  {
    id: 9,
    date: "2024/10/07",
    description: "Consultation Fees",
    category: "Income",
    amount: "750.00",
    status: "Paid",
  },
  {
    id: 10,
    date: "2024/10/05",
    description: "Internet Subscription",
    category: "Expenses",
    amount: "100.00",
    status: "Paid",
  },
  {
    id: 11,
    date: "2024/10/07",
    description: "Consultation Fees",
    category: "Income",
    amount: "750.00",
    status: "Paid",
  }
];
const totalItems = 100; // Total number of items (for example)
const itemsPerPage = 10; // Items per page


export default function Staff() {  // Removed async here
  const [appliedFilters, setAppliedFilters] = useState({});
  const [limit, setLimit] = useState<number>(10); // Default limit
  const [currentPage, setCurrentPage] = useState(0);

  console.log(appliedFilters)
  const handlePagination = (selectedPage: { selected: number }) => {
    setCurrentPage(selectedPage.selected); // Update current page
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    console.log('Selected limit:', newLimit); // Handle limit change as needed
  };

  const handleApplyFilters = (filters: any) => {
    setAppliedFilters(filters);
    console.log("Applied Filters:", filters);
  };

  const handleClearFilters = () => {
    setAppliedFilters({});
    console.log("Filters cleared");
  };

  return (
    <div className="h-full">
      <div className="mb-6 p-2 shadow-md bg-white flex justify-center">
        <div className="container py-1">
          <ReportFilterForm onApply={handleApplyFilters} onClear={handleClearFilters} />
        </div>
      </div>
      <div className="flex justify-center">
        <div className='shadow-md container rounded-md m-2 p-2'>

          <div className="grid grid-cols-2 mb-1">
            <div className="flex justify-start items-center space-x-2">
              <span className="font-semibold">Staff ({financeReportData.length})</span>
              <div className=" w-80 ">
                <SearchInput placeholder="Search Staff"
                  className="p-2"
                />
              </div>
            </div>

            <div className="flex justify-end items-center space-x-2">
              <ReactPaginationStyle
                total={totalItems}
                currentPage={currentPage}
                handlePagination={handlePagination}
                limit={itemsPerPage}
              />

              <PaginationLimitSelect
                limits={[10, 20, 50, 100]} // Define the limits you want to provide
                selectedLimit={limit}
                onLimitChange={handleLimitChange}
              />
            </div>
          </div>

          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-200 text-gray-600 text-left text-sm uppercase">
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Description</th>
                <th className="px-4 py-2">Category</th>
                <th className="px-4 py-2">Amount</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {financeReportData.map((item) => (
                <tr
                  key={item.id}
                  className="border-b hover:bg-gray-100 transition-colors"
                >
                  <td className="px-4 py-2">{item.date}</td>
                  <td className="px-4 py-2">{item.description}</td>
                  <td className="px-4 py-2">{item.category}</td>
                  <td className="px-4 py-2">Rs. {item.amount}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded-lg text-sm ${item.status === 'Paid'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                        }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
