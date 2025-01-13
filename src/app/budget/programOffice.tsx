"use client";

import { Button } from "@radix-ui/themes";
import React, { useState } from "react";

interface ProgramOfficeProps {
  section: string;
}

interface LevelData {
  Count: string | number;
  [month: string]: string | number;
}

type TableData = Record<string, LevelData>;

const programOfficeList = [
  "PROGRAM OFFICE",
  "Audio & Video - Prog",
  "Consultany & Contract Services- Prog",
  "Electricity Charges - Prog",
  "IT Maintenance & Subscriptions - Prog",
  "Marketing & Communication Expenses - Prog",
  "Non-Capital Asset - Prog",
  "Office Repair & Maintenance - Prog",
  "Office Supplies - Prog",
  "Others Misc Expenses - Prog",
  "Postage & Courier - Prog",
  "Printing, Stationery & Xerox - Prog",
  "Professional & Legal Fees - Prog",
  "Recruitment & HR Exp - Prog",
  "Rent - Prog",
  "Staff Insurance Charges - Prog",
  "Staff Welfare - Prog",
  "Telephone & Internet Charges - Prog"
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

const ProgramOffice: React.FC<ProgramOfficeProps> = ({ section }) => {
  // Initialize table data

  const [tableData, setTableData] = useState<TableData>(
    programOfficeList.reduce((acc, level) => {
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

        <div className="bg-gray-50 overflow-scroll">
          {/* Table */}
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-200 text-left text-sm uppercase text-gray-600">
                <th className="border p-2">PROGRAM OFFICE</th>

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
              {programOfficeList.map((level) => (
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
        <div className="py-2 pr-4 flex flex-row-reverse ">
          <Button
            type="button"
            className="!cursor-pointer !text-white !bg-primary px-2 !w-20 !text-lg border border-black"
            variant="soft"
          >
            Save
          </Button>
        </div>
      </details>
      {/* Section Header */}
    </div>
  );
};

export default ProgramOffice;
