
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

    console.log(tableData)

    return (
        <div className="bg-white shadow-lg my-6 p-4 rounded-md">
            {/* Section Header */}
            <div className="p-2 bg-primary text-white text-lg font-semibold">
                {section}
            </div>

            {/* Table */}
            <table className="w-full table-auto border-collapse mt-4">
                <thead>
                    <tr className="bg-gray-200 text-gray-600 text-left text-sm uppercase">
                        <th className="p-2 border">Level</th>
                        <th scope="col" className="p-2 border">Count</th>
                        <th scope="col" className="p-2 border">Apr </th>
                        <th scope="col" className="p-2 border">May </th>
                        <th scope="col" className="p-2 border">Jun </th>

                        <th scope="col" className="p-2 border">Count</th>
                        <th scope="col" className="p-2 border">Jul </th>
                        <th scope="col" className="p-2 border">Aug </th>
                        <th scope="col" className="p-2 border">Sep </th>

                        <th scope="col" className="p-2 border">Count</th>
                        <th scope="col" className="p-2 border">Oct </th>
                        <th scope="col" className="p-2 border">Nov </th>
                        <th scope="col" className="p-2 border">Dec </th>

                        <th scope="col" className="p-2 border">Count</th>
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
    );
};

export default BHead;
