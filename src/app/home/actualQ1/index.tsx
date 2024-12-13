'use client';

import React from 'react';

// Define the type for the data
interface BudgetData {
  bHead: string;
  actQ1: string;
  q1bal: string;
  util: string;
  budget: string;
}

// Define the data array with the correct type
const data: BudgetData[] = [
  { bHead: 'PERSONNEL', actQ1: "", q1bal: "", util: "", budget: "" },
  { bHead: 'PROGRAM ACTIVITIES', actQ1: "", q1bal: "", util: "", budget: "" },
  { bHead: 'TRAVEL', actQ1: "", q1bal: "", util: "", budget: "" },
  { bHead: 'PROGRAM OFFICE', actQ1: "", q1bal: "", util: "", budget: "" },
  { bHead: 'CAPITAL COST', actQ1: "", q1bal: "", util: "", budget: "" },
  { bHead: 'OVERHEADS', actQ1: "", q1bal: "", util: "", budget: "" },
];

// Functional Component with TypeScript
const ActualQ1: React.FC = () => {
  return (
    <div className="bg-white shadow-lg w-full p-2 rounded-md">
      <table className="min-w-full table-auto border-collapse p-2">
        <thead>
          <tr className="bg-gray-200 text-gray-600 text-left text-sm uppercase">
            <th className="p-2">Budget Head</th>
            <th className="p-2">Actual Q1</th>
            <th className="p-2">Q1 Balance</th>
            <th className="p-2">Utilized %</th>
            <th className="p-2">Budget Q2</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, i) => (
            <tr key={i} className="hover:bg-gray-100 text-sm transition-colors">
              <td className="p-1 border">{item.bHead}</td>
              <td className="p-1 border">{item.actQ1}</td>
              <td className="p-1 border">{item.q1bal}</td>
              <td className="p-1 border">{item.util}</td>
              <td className="p-1 border">{item.budget}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ActualQ1;
