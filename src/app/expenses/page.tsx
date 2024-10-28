'use client';

import { useState } from "react";
import SearchInput from "~/app/_components/searchInput";
import PaginationLimitSelect from "~/app/_components/pagination/limit";
import ReactPaginationStyle from "~/app/_components/pagination/pagination";
import ExpenseFilterForm from "./filter";
import EditExpense from "./edit";
import DeleteExpense from "./delete";

const cols = ['Date', 'Amount', 'Currency', 'Category', 'Cost Center', 'Description', 'Status', 'Type', 'Created At','actions']

const records = [
  {
    Date: '2024-10-01',
    Amount: 150.00,
    Currency: 'USD',
    Category: 'Travel',
    CostCenter: 'Marketing',
    Description: 'Flight ticket to client site',
    Status: 'Approved',
    Type: 'Expense',
    CreatedAt: '2024-10-01 09:45:00',
  },
  {
    Date: '2024-10-02',
    Amount: 2000.00,
    Currency: 'EUR',
    Category: 'Equipment',
    CostCenter: 'IT',
    Description: 'New laptops for team',
    Status: 'Pending',
    Type: 'Purchase',
    CreatedAt: '2024-10-02 12:30:00',
  },
  {
    Date: '2024-10-03',
    Amount: 300.00,
    Currency: 'USD',
    Category: 'Meals',
    CostCenter: 'Sales',
    Description: 'Team dinner',
    Status: 'Approved',
    Type: 'Expense',
    CreatedAt: '2024-10-03 19:15:00',
  },
  {
    Date: '2024-10-04',
    Amount: 100.00,
    Currency: 'GBP',
    Category: 'Supplies',
    CostCenter: 'Administration',
    Description: 'Office stationery',
    Status: 'Completed',
    Type: 'Purchase',
    CreatedAt: '2024-10-04 08:00:00',
  },
  {
    Date: '2024-10-05',
    Amount: 500.00,
    Currency: 'USD',
    Category: 'Consulting',
    CostCenter: 'HR',
    Description: 'Legal consulting fees',
    Status: 'Pending',
    Type: 'Service',
    CreatedAt: '2024-10-05 11:45:00',
  },
  {
    Date: '2024-10-06',
    Amount: 250.00,
    Currency: 'AUD',
    Category: 'Travel',
    CostCenter: 'Marketing',
    Description: 'Hotel accommodation for seminar',
    Status: 'Approved',
    Type: 'Expense',
    CreatedAt: '2024-10-06 14:30:00',
  },
  {
    Date: '2024-10-07',
    Amount: 120.00,
    Currency: 'CAD',
    Category: 'Supplies',
    CostCenter: 'IT',
    Description: 'Software license renewal',
    Status: 'Approved',
    Type: 'Subscription',
    CreatedAt: '2024-10-07 09:15:00',
  },
  {
    Date: '2024-10-08',
    Amount: 750.00,
    Currency: 'USD',
    Category: 'Training',
    CostCenter: 'Development',
    Description: 'Online course for team',
    Status: 'Completed',
    Type: 'Service',
    CreatedAt: '2024-10-08 10:00:00',
  },
  {
    Date: '2024-10-09',
    Amount: 200.00,
    Currency: 'INR',
    Category: 'Meals',
    CostCenter: 'Operations',
    Description: 'Business lunch with clients',
    Status: 'Approved',
    Type: 'Expense',
    CreatedAt: '2024-10-09 13:25:00',
  },
  {
    Date: '2024-10-10',
    Amount: 4500.00,
    Currency: 'USD',
    Category: 'Equipment',
    CostCenter: 'Production',
    Description: 'New manufacturing machinery',
    Status: 'Pending',
    Type: 'Purchase',
    CreatedAt: '2024-10-10 15:45:00',
  },
];

const totalItems = 100; // Total number of items (for example)
const itemsPerPage = 10; // Items per page

export default function Expenses() {
  const [limit, setLimit] = useState<number>(10); // Default limit
  const [currentPage, setCurrentPage] = useState(0);
  const [filters, setFilters] = useState({
    temp: '',
    year: '',
    month: ''
  });


  const handleSelect = (name: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileupload = (e: object) => {
    console.log(e)
  }
  const handlePagination = (selectedPage: { selected: number }) => {
    setCurrentPage(selectedPage.selected); // Update current page
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    console.log('Selected limit:', newLimit); // Handle limit change as needed
  };

  return (
    <div className="h-full">
      <div className="mb-6 p-1 shadow-lg bg-white flex justify-center">
        <div className="container py-1">
          <ExpenseFilterForm handleFileupload={handleFileupload} handleSelect={handleSelect} filters={filters} />
        </div>
      </div>
      <div className="flex justify-center">
        <div className='shadow-lg container rounded-lg m-2 p-1'>

          <div className="flex justify-between items-center mb-1">
            <span className="font-semibold">Expenses ({records.length})</span>
            <div className=" w-80 ">
              <SearchInput placeholder="Search Expenses"
                className="p-2"
              />
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

          <table className="min-w-full table-auto border-collapse p-2">
            <thead>
              <tr className="bg-gray-200 text-gray-600 text-left text-sm uppercase">
                {cols?.map(col => {
                  return <th key={col} className="p-2">{col}</th>
                })}
              </tr>
            </thead>
            <tbody>
              {records.map((item, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-gray-100 text-sm transition-colors"
                >
                  <td className="p-2">{item.Date}</td>
                  <td className="p-2">{item.Amount}</td>
                  <td className="p-2">{item.Currency}</td>
                  <td className="p-2">{item.Category}</td>
                  <td className="p-2">{item.CostCenter}</td>
                  <td className="p-2">{item.Description}</td>
                  <td className="p-2">
                    <span
                      className={`p-1 rounded-lg text-xs ${item.Status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                    >
                      {item.Status}
                    </span>
                  </td>
                  <td className="p-2">{item.Type}</td>
                  <td className="p-2">{item.CreatedAt}</td>
                  <td className="p-1.5 space-x-2">
                    <EditExpense item={item} />
                    <DeleteExpense item={item} />
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
