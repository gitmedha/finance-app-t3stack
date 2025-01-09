"use client";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import React, { useState } from "react";
import { BiComment } from "react-icons/bi";
import { RiArrowDropDownLine } from 'react-icons/ri';

interface ActivityBudgetProps {
  section: string;
}

interface LevelData {
  Count: string | number;
  [month: string]: string | number;
}

type TableData = Record<string, LevelData>;

const subProgramActivites = [
  "Certificate Event",
  "Faculty Workshop",
  "Alumni Engagement",
  "AI and Placement Drive",
  "ITI Diagnostic",
  "Divisional workshop",
  "Divisional Industry workshop",
  "MSDF Event",
  "DSE Shoshin",
  "Poly-Enrollment Drive",
  "Poly-Placement Drive",
  "Industry Engagement",
  "TCPO Workshop",
  "DSE Faculty workshop"
]
const particulars = [
  "Venue charges & maintenance",
  "Meals & refreshment",
  "Equipments on rent",
  "Printing, stationary & materials",
  "Poster, banners, collaterals",
  "Photo & videography",
  "Gifts & rewards",
  "Stipend & remuneration",
  "Local conveyance (External)",
  "Outstation travel (External)",
  "Accomodation (External)",
  "Per diem for employees (External)",
  "Professional services (e.g. event management)",
  "Tent, decoration & catering services",
  "Carriage & transportation",
  "Promotion, advertising & campaign",
  "Telecommunication expenses",
  "Branding materials & supplies",
  "License, permit and taxes",
  "Capex & asset purchase",
  "Misc & others"
];

const months = [
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
  "Jan",
  "Feb",
  "Mar",
];

const ActivityBudget: React.FC<ActivityBudgetProps> = ({ section }) => {
  // Initialize table data

  const [tableData, setTableData] = useState<TableData>(
    particulars.reduce((acc, level) => {
      acc[level] = {
        Count: "",
        ...months.reduce((mAcc, month) => ({ ...mAcc, [month]: "" }), {}),
      };
      return acc;
    }, {} as TableData),
  );
  const [filter, setFilter] = useState(subProgramActivites.sort((a, b) => a.localeCompare(b))[0])
  const handleSelect = (val: string) => {
    setFilter(val)
  }
  // Handle input changes with strict typing
  const handleInputChange = (
    level: string,
    field: string,
    value: string | number,
  ) => {
    setTableData((prev) => ({
      ...prev,
      [level]: {
        // Provide a default structure for safety
        Count: prev[level]?.Count ?? "",
        ...prev[level],
        [field]: value,
      },
    }));
  };

  return (
    <div className="my-6 rounded-md bg-white shadow-lg">
      <details
        className={`group mx-auto w-full overflow-hidden rounded bg-[#F5F5F5] shadow transition-[max-height] duration-500`}
      >
        <summary className="flex cursor-pointer items-center justify-between rounded-md border border-primary bg-primary/10 p-2 text-primary outline-none">
          <h1 className=" uppercase ">{section}</h1>
          <div className="flex items-center space-x-2">
            <p className="text-sm">Avg Cost: Q1: XXX Q2: XXX Q3: XXX Q4: XXX</p>
            {/* Rotate arrow when details are open */}
            <span className="text-lg font-bold transition-transform group-open:rotate-90">
              →
            </span>
          </div>
        </summary>

        <div className='w-72 mt-3 z-10'>
          <DropdownMenu.Root >
            <DropdownMenu.Trigger asChild>
              <button className="cursor-pointer  py-1 border rounded-lg text-left text-gray-500 text-sm pl-2 font-normal flex justify-between items-center w-full">
                <span>{filter} </span>
                <RiArrowDropDownLine size={30} />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content
              className="bg-white max-h-56 overflow-y-scroll shadow-lg rounded-lg p-2 !w-[280px]"
            >
              {subProgramActivites.sort((a, b) => a.localeCompare(b)).map((val, ind) => (
                <DropdownMenu.Item
                  key={ind}
                  className="p-2 focus:ring-0 hover:bg-gray-100 rounded cursor-pointer"
                  onSelect={() => handleSelect(val)} // Pass entire department object
                >
                  {val}
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Root>

        </div>
        <hr className="my-2 scale-x-150" />
        <div className="bg-gray-50 overflow-scroll">
          {/* Table */}
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-200 text-left text-sm uppercase text-gray-600">
                <th className="border p-2">Particulars</th>
                <th scope="col" className="border p-2">
                  Qty
                </th>
                <th scope="col" className="border p-2">
                  Rate
                </th>
                <th scope="col" className="border p-2">
                  Amount
                </th>
                <th scope="col" className="border p-2">
                  Apr
                </th>
                <th scope="col" className="border p-2">
                  May
                </th>
                <th scope="col" className="border p-2">
                  Jun
                </th>

                <th scope="col" className="border p-2">
                  Qty
                </th>
                <th scope="col" className="border p-2">
                  Rate
                </th>
                <th scope="col" className="border p-2">
                  Amount
                </th>
                <th scope="col" className="border p-2">
                  Jul
                </th>
                <th scope="col" className="border p-2">
                  Aug
                </th>
                <th scope="col" className="border p-2">
                  Sep
                </th>

                <th scope="col" className="border p-2">
                  Qty
                </th>
                <th scope="col" className="border p-2">
                  Rate
                </th>
                <th scope="col" className="border p-2">
                  Amount
                </th>
                <th scope="col" className="border p-2">
                  Oct
                </th>
                <th scope="col" className="border p-2">
                  Nov
                </th>
                <th scope="col" className="border p-2">
                  Dec
                </th>
                <th scope="col" className="border p-2">
                  Qty
                </th>
                <th scope="col" className="border p-2">
                  Rate
                </th>
                <th scope="col" className="border p-2">
                  Amount
                </th>
                <th scope="col" className="border p-2">
                  Jan
                </th>
                <th scope="col" className="border p-2">
                  Feb
                </th>
                <th scope="col" className="border p-2">
                  Mar
                </th>
                <th scope="col" className="border p-2">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody>
              {particulars.map((level) => (
                <tr
                  key={level}
                  className="text-sm transition hover:bg-gray-100"
                >
                  {/* Level Name */}
                  <td className="border p-2 font-medium">{level}</td>

                  {/* Count Input */}
                  <td className="border p-2">
                    <input
                      type="number"
                      className="w-full rounded border p-1"
                      value={tableData[level]?.Count}
                      onChange={(e) =>
                        handleInputChange(level, "Count", e.target.value)
                      }
                    />
                  </td>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23].map(
                    (it) => {
                      return (
                        <td key={it} className="border p-2">
                          <input
                            type="text"
                            className="w-full rounded border p-1"
                          />
                        </td>
                      );
                    },
                  )}
                  <td className="border p-2">
                    <BiComment className="text-xl" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>

      {/* Section Header */}
    </div>
  );
};

export default ActivityBudget;
