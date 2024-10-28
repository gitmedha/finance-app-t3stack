'use client';

import { useState } from "react";
import SearchInput from "~/app/_components/searchInput";
import PaginationLimitSelect from "~/app/_components/pagination/limit";
import ReactPaginationStyle from "~/app/_components/pagination/pagination";
import DonorFilterForm from "./filter";
import EditDonor from "./edit";
import DeleteDonor from "./delete";

const cols = ['Name', 'Cost Center', 'Year', 'Total Budget', 'Received Budget', 'Currency', 'Type', 'Created At','actions']
const donorData = [
  {
    Name: 'Marketing Campaign',
    CostCenter: 'Marketing',
    Year: '23-24',
    TotalBudget: 50000,
    ReceivedBudget: 30000,
    Currency: 'USD',
    Type:'FC',
    CreatedAt: '2023-04-10 10:00:00',
  },
  {
    Name: 'Employee Training',
    CostCenter: 'HR',
    Year: '23-24',
    TotalBudget: 15000,
    ReceivedBudget: 15000,
    Currency: 'USD',
    Type:'FC',
    CreatedAt: '2023-04-12 09:15:00',
  },
  {
    Name: 'Product Development',
    CostCenter: 'R&D',
    Year: '24-25',
    TotalBudget: 120000,
    ReceivedBudget: 60000,
    Currency: 'USD',
    Type:'FC',
    CreatedAt: '2023-05-01 14:30:00',
  },
  {
    Name: 'Office Supplies',
    CostCenter: 'Administration',
    Year: '24-25',
    TotalBudget: 8000,
    ReceivedBudget: 5000,
    Currency: 'EUR',
    Type:'FC',
    CreatedAt: '2023-05-05 12:00:00',
  },
  {
    Name: 'System Upgrade',
    CostCenter: 'IT',
    Year: '23-24',
    TotalBudget: 25000,
    ReceivedBudget: 25000,
    Currency: 'USD',
    Type:'NFC',
    CreatedAt: '2023-06-15 16:00:00',
  },
  {
    Name: 'Client Events',
    CostCenter: 'Sales',
    Year: '23-24',
    TotalBudget: 30000,
    ReceivedBudget: 20000,
    Currency: 'USD',
    Type:'FC',
    CreatedAt: '2023-07-01 18:30:00',
  },
  {
    Name: 'Market Research',
    CostCenter: 'R&D',
    Year: '24-25',
    TotalBudget: 20000,
    ReceivedBudget: 10000,
    Currency: 'USD',
    Type:'NFC',
    CreatedAt: '2023-08-01 15:45:00',
  },
  {
    Name: 'Legal Consulting',
    CostCenter: 'HR',
    Year: '23-24',
    TotalBudget: 10000,
    ReceivedBudget: 7000,
    Currency: 'USD',
    Type:'FC',
    CreatedAt: '2023-08-10 11:15:00',
  },
  {
    Name: 'Branding Project',
    CostCenter: 'Marketing',
    Year: '24-25',
    TotalBudget: 50000,
    ReceivedBudget: 25000,
    Currency: 'EUR',
    Type:'NFC',
    CreatedAt: '2023-09-20 08:45:00',
  },
  {
    Name: 'Infrastructure Setup',
    CostCenter: 'Operations',
    Year: '24-25',
    TotalBudget: 150000,
    ReceivedBudget: 100000,
    Currency: 'USD',
    Type:'FC',
    CreatedAt: '2023-10-05 10:20:00',
  }
];

// ( FC or NFC )

const totalItems = 100; // Total number of items (for example)
const itemsPerPage = 10; // Items per page

export default function DonorReport() {
  const [limit, setLimit] = useState<number>(10); // Default limit
  const [currentPage, setCurrentPage] = useState(0);
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    byTime: '',
    year: '',
    month: ''
  });

  const handleSelect = (name: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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
          <DonorFilterForm filters={filters} handleSelect={handleSelect} />
        </div>
      </div>
      <div className="flex justify-center">
        <div className='shadow-lg container rounded-lg m-2 p-1'>

          <div className="flex justify-between items-center mb-1">
            <span className="font-semibold">Donors ({donorData.length})</span>
            <div className=" w-80 ">
              <SearchInput placeholder="Search Donor"
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
                {
                  cols?.map(col => {
                    return <th key={col} className="p-2">{col}</th>
                  })
                }

              </tr>
            </thead>
            <tbody>
              {donorData.map((item) => (
                <tr
                  key={item?.CreatedAt}
                  className="border-b hover:bg-gray-100 text-sm transition-colors"
                >
                  <td className="p-2">{item.Name}</td>
                  <td className="p-2">{item.CostCenter}</td>
                  <td className="p-2">{item.Year}</td>
                  <td className="p-2">{item.TotalBudget}</td>
                  <td className="p-2">{item.ReceivedBudget}</td>
                  <td className="p-2">{item.Currency}</td>
                  <td className="p-2">{item.Type}</td>
                  <td className="p-2">{item.CreatedAt}</td>
                  <td className="p-1.5 space-x-2">
                    <EditDonor item={item} />
                    <DeleteDonor item={item} />
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
