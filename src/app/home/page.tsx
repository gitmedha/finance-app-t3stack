'use client';

import {  useState } from "react";
// import ActualQ1 from "./actualQ1";
// import ActualQ2 from "./actualQ2";
// import ActualQ3 from "./actualQ3";
// import ActualQ4 from "./actualQ4";
import AppMatrics from "./annualBudget";
import HomeFilterForm from "./filter";
import { useSession } from "next-auth/react";
import type { FilterOptions, HandleSelectValue } from "./home"
import ShowBudget from "./showBudget";

export default function Home() {
    const userData = useSession()
    const year = new Date().getFullYear()
    const month = new Date().getMonth()
    const [filters, setFilters] = useState<FilterOptions>({
        department: userData.data?.user.departmentId?.toString() ?? '0',
        departmentname: userData.data?.user.departmentName ?? "ALL",
        year: month >= 3 ? `${year.toString()}-${(year + 1).toString().slice(2)}` : `${(year - 1).toString()}-${year.toString().slice(2)}`,
        // need to be updated wit respect to user login
        subdepartmentId: userData.data?.user.subDepartmentId ?? 0,
        subdepartmentName: userData.data?.user.subDepartmentName ?? "ALL"
    });
    const handleSelect = (name: string, value: HandleSelectValue) => {
        if (name === 'department' && typeof value === 'object' && value !== null) {
            const departmentValue = value as { id: string; departmentname: string }; // Narrow type
            setFilters((prev) => ({
                ...prev,
                department: departmentValue.id, // Use the explicit type
                departmentname: departmentValue.departmentname, // Extract department name
            }));
        }
        else if (name === 'subdepartment' && typeof value === 'object' && value !== null) {
            const subDeptVal = value as { id: number; departmentname: string }; // Narrow type
            setFilters((prev) => ({
                ...prev,
                subdepartmentId: subDeptVal.id,
                subdepartmentName: subDeptVal.departmentname,
            }));
        }
        else if (name === 'year' && typeof value === 'string') {
            setFilters((prev) => ({
                ...prev,
                [name]: value, // Year is a string
            }));
        }
    };
    return (
        <div className="mt-20 gap-4 p-2 flex-col flex ">
            <div>
                <HomeFilterForm filters={filters} handleSelect={handleSelect} />
            </div>
            <div>
                <AppMatrics financialYear={filters.year} />
            </div>
            <div>
                <ShowBudget filters={filters} />
            </div>
            {/* <div className="mt-3 grid grid-cols-2 gap-4">
                
                <ActualQ1 financialYear={filters.year} />
                <ActualQ2 financialYear={filters.year} />
                <ActualQ3 financialYear={filters.year} />
                <ActualQ4 financialYear={filters.year} />
            </div> */}

        </div>
    );
}
