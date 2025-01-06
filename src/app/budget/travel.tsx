"use client";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import React, { useState } from "react";
import { RiArrowDropDownLine } from 'react-icons/ri';

interface TravelBudgetProps {
  section: string;
}

interface LevelData {
  Count: string | number;
  [month: string]: string | number;
}

type TableData = Record<string, LevelData>;

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

const travels = [
  'Accomodation',
  'Local Conveyance',
  'Per Diem',
  'Tour & Travel'
]

const TravelBudget: React.FC<TravelBudgetProps> = ({ section }) => {
  // Initialize table data
  const [selectedTravel, setSelectedTravel] = useState<string>(""); // State for selected activity

  const [tableData, setTableData] = useState<TableData>(
    particulars.reduce((acc, level) => {
      acc[level] = {
        Count: "",
        ...months.reduce((mAcc, month) => ({ ...mAcc, [month]: "" }), {}),
      };
      return acc;
    }, {} as TableData),
  );

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

  const handleactivitySelect = (activity: string) => {
    setSelectedTravel(activity);
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

        <hr className="my-2 scale-x-150" />
        <div className='flex justify-end items-center m-2'>
          <div className="w-52">
            {/* activity Dropdown */}
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="cursor-pointer w-full py-1 border rounded-lg text-left text-gray-500 text-sm pl-2 font-normal flex justify-between items-center">
                  <span>{selectedTravel || "Select Travel"}</span>
                  <RiArrowDropDownLine size={30} />
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content className="bg-white max-h-56 overflow-y-scroll shadow-lg rounded-lg p-2 !w-[220px]">
                {travels.map((travel) => (
                  <DropdownMenu.Item
                    key={travel}
                    className="p-2 focus:ring-0 hover:bg-gray-100 rounded cursor-pointer"
                    onSelect={() => handleactivitySelect(travel)}
                  >
                    {travel}
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </div>
        </div>
        <div className="bg-gray-50 overflow-scroll">
          {/* Table */}
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-200 text-left text-sm uppercase text-gray-600">
                <th className="border p-2">Particulars</th>
                <th scope="col" className="border p-2">
                  #
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
                  #
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
                  #
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
                  #
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
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(
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

export default TravelBudget;
