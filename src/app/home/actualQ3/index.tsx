'use client';

import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { api } from '~/trpc/react';

interface BudgetData {
    bHead: string;
    actQ1: string;
    q1bal: string;
    util: string;
    budget: string;
}
type tableDataSchema = Record<string, BudgetData>
const data = [
    {
        bHead: 'PERSONNEL',
        actQ1: "",
        q1bal: "",
        util: "",
        budget: ""
    },
    {
        bHead: 'PROGRAM ACTIVITIES',
        actQ1: "",
        q1bal: "",
        util: "",
        budget: ""
    },
    {
        bHead: 'TRAVEL ',
        actQ1: "",
        q1bal: "",
        util: "",
        budget: ""
    },
    {
        bHead: 'PROGRAM OFFICE',
        actQ1: "",
        q1bal: "",
        util: "",
        budget: ""
    },
    {
        bHead: 'CAPITAL COST',
        actQ1: "",
        q1bal: "",
        util: "",
        budget: ""
    },
    {
        bHead: 'OVERHEADS',
        actQ1: "",
        q1bal: "",
        util: "",
        budget: ""
    }
]
const ActualQ3 = ({ financialYear }: { financialYear: string }) => {
    const userData = useSession()
    const [tableData, setTableData] = useState<tableDataSchema>({})
    const { data: cat, isLoading: catsLoading } = api.get.getCats.useQuery()
    const { data: q1data, isLoading: q1DataLoading } = api.get.getQuarterBudgetSum.useQuery({ financialYear: financialYear, quarter: "q3",departmentId:userData.data?.user.departmentId }, { enabled: !!cat && !catsLoading })

    useEffect(() => {
        if (cat?.categories && cat.categories.length > 0) {
            const formattedData = cat.categories.reduce((acc, category) => {
                acc[category.categoryId] = {
                    bHead: category.categoryName,
                    actQ1: 'NA',
                    q1bal: 'NA',
                    util: 'NA',
                    budget: 'NA',
                };
                return acc;
            }, {} as tableDataSchema);

            setTableData(formattedData);
        }
    }, [cat]);
    // updateing the data after getting the q3 data
    useEffect(() => {
        if (q1data && tableData) {
            setTableData((prev) => {
                const updated: tableDataSchema = { ...prev };

                q1data.forEach((val) => {
                    if (updated[val.catid]) {
                        const valBeforeUpdate = updated[val.catid]
                        updated[val.catid] = {
                            bHead: valBeforeUpdate?.bHead ?? "NA",
                            actQ1: valBeforeUpdate?.actQ1 ?? "NA",
                            q1bal: valBeforeUpdate?.q1bal ?? "NA",
                            util: valBeforeUpdate?.util ?? "NA",
                            budget: Math.round(Number(val.qSum)).toString()
                        }
                    }
                });

                return updated;
            });
        }
    }, [q1data]);
    return (
        <div className='bg-white shadow-lg  w-full p-2 rounded-md'>
            <table className="  min-w-full table-auto border-collapse p-2">
                <thead>
                    <tr className="bg-gray-200 text-gray-600 text-left text-sm uppercase">
                        <th className="p-2">Budget Head</th>
                        <th className="p-2">Actual Q3</th>
                        <th className="p-2">Balance Q3 </th>
                        <th className="p-2">Utilized Q3 %</th>
                        <th className="p-2">Budget Q3</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        Object.keys(tableData).map((k) => {
                            const item = tableData[k]
                            return <tr key={k} className="hover:bg-gray-100 text-sm transition-colors">
                                <td className="p-1 border text-left">{item?.bHead}</td>
                                <td className="p-1 border text-center">{item?.actQ1}</td>
                                <td className="p-1 border text-center">{item?.q1bal}</td>
                                <td className="p-1 border text-center">{item?.util}</td>
                                <td className="p-1 border text-center">{item?.budget}</td>
                            </tr>

                        })
                    }
                </tbody>
            </table>
        </div>
    )
}

export default ActualQ3