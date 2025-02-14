import { useEffect, useState } from "react"
import { api } from "~/trpc/react"
import type { tableSchema } from "./home"
import type { FilterOptions } from "./home";

const Labels = [{ map: 1, name: "FY Plan" }, { map: 2, name: "FY Actual" }, { map: 3, name: "FY Balance" }, { map: 4, name: "FY Utilization" },
    { map: 5, name: "Q1 Plan" }, { map: 6, name: "Q1 Actual" }, { map: 7, name: "Q1 Balance" }, { map: 8, name: "Q1 Utilization" },
    { map: 9, name: "Q2 Plan" }, { map: 10, name: "Q2 Actual" }, { map: 11, name: "Q2 Balance" }, { map: 12, name: "Q2 Utilization" },
    { map: 13, name: "Q3 Plan" }, { map: 14, name: "Q3 Actual" }, { map: 15, name: "Q3 Balance" }, { map: 16, name: "Q3 Utilization" },
    { map: 17, name: "Q4 Plan" }, { map: 18, name: "Q4 Actual" }, { map: 19, name: "Q4 Balance" }, { map: 20, name: "Q4 Utilization" }]

const ShowBudget = ({ filters }: { filters: FilterOptions }) => {
    const { data: cat, isLoading: catsLoading } = api.get.getCats.useQuery()
    const { data: budgetData } = api.get.getBudgetSum.useQuery({ financialYear: filters.year,departmentId:Number(filters.department),subDeptId:filters.subdepartmentId},{
        enabled:!!cat,
        staleTime:0
    })
    const [tableData, setTable] = useState<tableSchema>({})

    useEffect(() => {
        if (!budgetData || !Array.isArray(budgetData.budgetData) || budgetData.budgetData.length<=0) {
            setTable({})
            return 
        }; 
        
        if(budgetData.budgetData.length > 0 && Number(filters.department) == budgetData.departmentId && filters.subdepartmentId == budgetData.subDeptId && filters.year == budgetData.financialYear)
        {
            const transformedData = budgetData.budgetData.reduce((acc, curr) => {
                Object.entries(curr).forEach(([key, value]) => {
                    if (key !== "catid") {
                        if (!acc[key]) {
                            acc[key] = {};
                        }
                        acc[key][curr.catid] = Math.round(value).toLocaleString('hi-IN');
                    }
                });
                return acc;
            }, {} as Record<string, Record<number, number|string>>);
            setTable(transformedData);
        }
    }, [budgetData]);


    return <div className="bg-white shadow-lg w-full p-2 rounded-md">
        {/* {JSON.stringify(budgetData)} */}
        {/* {JSON.stringify(tableData)} */}
        <table className="w-full table-auto border-collapse">
            <thead>
                <tr className="bg-gray-200 text-left text-sm text-gray-600 !capitalize">
                    <th className="p-2 !capitalize">description</th>
                    {cat?.categories && cat.categories.length > 0 && cat.categories.map((c) => (
                        <th className="p-2 !capitalize" key={c.categoryId} >{c.categoryName.toLowerCase()}</th>
                    ))}
                </tr>
            </thead>

            {!catsLoading  && <tbody>
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