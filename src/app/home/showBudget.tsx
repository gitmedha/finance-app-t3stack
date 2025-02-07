import { useEffect, useState } from "react"
import { api } from "~/trpc/react"
import type { tableSchema } from "./home"
import type { FilterOptions } from "./home";

const Labels = [{ map: 1, name: "FY Plan" }, { map: 2, name: "FY Actual" }, { map: 3, name: "FY Balance" }, { map: 4, name: "FY Utitlization" },
    { map: 5, name: "Q1 Plan" }, { map: 6, name: "Q1 Actual" }, { map: 7, name: "Q1 Balance" }, { map: 8, name: "Q1 Utitlization" },
    { map: 9, name: "Q2 Plan" }, { map: 10, name: "Q2 Actual" }, { map: 11, name: "Q2 Balance" }, { map: 12, name: "Q2 Utitlization" },
    { map: 13, name: "Q3 Plan" }, { map: 14, name: "Q3 Actual" }, { map: 15, name: "Q3 Balance" }, { map: 16, name: "Q3 Utitlization" },
    { map: 17, name: "Q4 Plan" }, { map: 18, name: "Q4 Actual" }, { map: 19, name: "Q4 Balance" }, { map: 20, name: "Q4 Utitlization" }]

const ShowBudget = ({ filters }: { filters: FilterOptions }) => {
    const { data: cat, isLoading: catsLoading } = api.get.getCats.useQuery()
    const { data: budgetData } = api.get.getBudgetSum.useQuery({ financialYear: filters.year,departmentId:Number(filters.department),subDeptId:filters.subdepartmentId})
    const [tableData, setTable] = useState<tableSchema>({})
    // useEffect(() => {
    //     const formattedData = Labels.reduce((acc, label) => {
    //         acc[label.map] = {
    //             "PERSONNEL": "NA",
    //             "PROGRAM ACTIVITIES": "NA",
    //             "PROGRAM TRAVEL": "NA",
    //             "CAPITAL COST": "NA",
    //             "PROGRAM OFFICE": "NA",
    //             "OVERHEADS":"NA"
    //         }
    //         return acc;
    //     }, {} as tableSchema)
    //     setTable(formattedData)
    // }, [cat])
    useEffect(() => {
        if (!budgetData || !Array.isArray(budgetData)) return; // Ensure budgetData is valid

        const transformedData = budgetData.reduce((acc, curr) => {
            Object.entries(curr).forEach(([key, value]) => {
                if (key !== "catid") {
                    if (!acc[key]) {
                        acc[key] = {};
                    }
                    acc[key][curr.catid] = value;
                }
            });
            return acc;
        }, {} as Record<string, Record<number, number>>);
        console.log(transformedData)
        setTable(transformedData);
    }, [budgetData]);


    return <div className="bg-white shadow-lg w-full p-2 rounded-md">
        {JSON.stringify(budgetData)}
        {/* {JSON.stringify(tableData)} */}
        <table className="w-full table-auto border-collapse">
            <thead>
                <tr className="bg-gray-200 text-left text-sm uppercase text-gray-600">
                    <th className="p-2">Label</th>
                    {cat?.categories && cat.categories.length > 0 && cat.categories.map((c) => (
                        <th className="p-2" key={c.categoryId}>{c.categoryName}</th>
                    ))}
                </tr>
            </thead>

            {cat && <tbody>
                {
                    Labels.map((label) => (
                        <tr key={label.map} className="text-sm transition hover:bg-gray-100">
                            <td className="border p-2 font-medium">
                                {label.name}
                            </td>
                            {cat?.categories.map((c) => (
                                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                                <td key={c.categoryId} className="border p-2">{tableData[label.map]?.[c.categoryId] ?? "NA"}</td>
                            ))}
                        </tr>
                    ))
                }
            </tbody>
            }

        </table>
    </div>
}

export default ShowBudget