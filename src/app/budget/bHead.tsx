
'use client';

import React, { useState } from "react";

interface BHeadProps {
    section: string;
}

interface LevelData {
    Count: string | number;
    [month: string]: string | number;
}

type TableData = {
    [level: string]: LevelData;
};

const levels = [
    "Assistant",
    "Manager",
    "Senior Manager",
    "AVP",
    "VP",
    "CXO/Director",
    "Others - Interns, Volunteers, PTCs",
    "Staff Benefits - EPF/PDA/PDS/Laptop/Bonus",
];

const months = [
    "Apr", "May", "Jun", "Jul", "Aug", "Sep",
    "Oct", "Nov", "Dec", "Jan", "Feb", "Mar",
];



const BHead: React.FC<BHeadProps> = ({ section }) => {
    // Initialize table data

    const [tableData, setTableData] = useState<TableData>(
        levels.reduce((acc, level) => {
            acc[level] = { Count: "", ...months.reduce((mAcc, month) => ({ ...mAcc, [month]: "" }), {}) };
            return acc;
        }, {} as TableData)
    );

    // Handle input changes with strict typing
    const handleInputChange = (level: string, field: string, value: string | number) => {
        setTableData((prev) => ({
            ...prev,
            [level]: {
                // Provide a default structure for safety
                Count: prev[level]?.Count || "",
                ...prev[level],
                [field]: value,
            },
        }));
    };

    return (
        <div className="bg-white shadow-lg my-6  rounded-md">
            <details
                className={`w-full shadow bg-[#F5F5F5] rounded group mx-auto transition-[max-height] duration-500 overflow-hidden`}
            >
                 <summary className="bg-primary/10 border border-primary rounded-md text-primary p-2  flex items-center justify-between outline-none cursor-pointer">
                    <h1>{section}</h1>
                    <div className="flex items-center space-x-2">
                        <p className="text-sm">Avg Cost: Q1: XXX Q2: XXX Q3: XXX Q4: XXX</p>
                        {/* Rotate arrow when details are open */}
                        <span className="text-lg font-bold transition-transform group-open:rotate-90">→</span>
                    </div>
                </summary>


                <hr className="my-2 scale-x-150" />

                <div className=" bg-gray-50">
                    {/* Table */}
                    <table className="w-full table-auto border-collapse mt-4">
                        <thead>
                            <tr className="bg-gray-200 text-gray-600 text-left text-sm uppercase">
                                <th className="p-2 border">Level</th>
                                <th scope="col" className="p-2 border">#</th>
                                <th scope="col" className="p-2 border">Apr </th>
                                <th scope="col" className="p-2 border">May </th>
                                <th scope="col" className="p-2 border">Jun </th>

                                <th scope="col" className="p-2 border">#</th>
                                <th scope="col" className="p-2 border">Jul </th>
                                <th scope="col" className="p-2 border">Aug </th>
                                <th scope="col" className="p-2 border">Sep </th>

                                <th scope="col" className="p-2 border">#</th>
                                <th scope="col" className="p-2 border">Oct </th>
                                <th scope="col" className="p-2 border">Nov </th>
                                <th scope="col" className="p-2 border">Dec </th>

                                <th scope="col" className="p-2 border">#</th>
                                <th scope="col" className="p-2 border">Jan </th>
                                <th scope="col" className="p-2 border">Feb </th>
                                <th scope="col" className="p-2 border">Mar </th>
                            </tr>
                        </thead>
                        <tbody>
                            {levels.map((level) => (
                                <tr key={level} className="hover:bg-gray-100 text-sm transition">
                                    {/* Level Name */}
                                    <td className="p-2 border font-medium">{level}</td>

                                    {/* Count Input */}
                                    <td className="p-2 border">
                                        <input
                                            type="number"
                                            className="w-full p-1 border rounded"
                                            value={tableData[level]?.Count}
                                            onChange={(e) =>
                                                handleInputChange(level, "Count", e.target.value)
                                            }
                                        />
                                    </td>
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(it => {
                                        return (
                                            <td key={it} className="p-2 border">
                                                <input
                                                    type="text"
                                                    className="w-full p-1 border rounded"
                                                />
                                            </td>
                                        )
                                    })}
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

export default BHead;
