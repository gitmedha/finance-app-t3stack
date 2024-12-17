"use client";

import React, { useState } from "react";

interface OverHeadsProps {
  section: string;
}

interface LevelData {
  Count: string | number;
  [month: string]: string | number;
}

type TableData = Record<string, LevelData>;

const overheadlist = [
  "Administration Charges - PF - Admin",
  "Audit Fees - Admin",
  "Bank Fees & Charges - Admin",
  "Consultancy & Contract Services - Admin",
  "Electricity Charges - Admin",
  "General Insurance Charges - Admin",
  "Interest on TDS",
  "IT Maintenance & Subscriptions - Admin",
  "Non-Capital Asset - Admin",
  "Office Repair & Maintenance - Admin",
  "Office Supplies - Admin",
  "Others Misc Expenses - Admin",
  "Postage & Courier - Admin",
  "Printing, Stationery & Xerox - Admin",
  "Professional & Legal Fees - Admin",
  "Recruitment & HR Exp - Admin",
  "Rent - Admin",
  "Staff Insurance Charges- Admin",
  "Staff Welfare - Admin",
  "Telephone & Internet Charges - Admin"
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

const OverHeads: React.FC<OverHeadsProps> = ({ section }) => {
  // Initialize table data

  const [tableData, setTableData] = useState<TableData>(
    overheadlist.reduce((acc, level) => {
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

        <div className="bg-gray-50">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-200 text-left text-sm uppercase text-gray-600">
                <th className="border p-2">OVERHEADS</th>
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
                  Jul
                </th>
                <th scope="col" className="border p-2">
                  Aug
                </th>
                <th scope="col" className="border p-2">
                  Sep
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
              {overheadlist.map((level) => (
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
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(
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

export default OverHeads;
