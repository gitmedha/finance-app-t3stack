"use client";

import React, { useMemo } from "react";
import { api } from "~/trpc/react";
import type { FilterOptions } from "./home";

// --- your data interfaces ---
export interface BudgetItem {
  categoryId: number;
  categoryName: string;
  budget: number; // full‐year total
  actual: number; // actual spent
  variance?: number; // budget – actual
  utilization?: string; // e.g. "60%"
  employeeCount: number;
}

export interface GetBudgetSumResponse {
  budgetData: BudgetItem[];
  departmentId: number | null;
  subDeptId: number | null;
  financialYear: string;
}
// --------------------------------

const ShowBudget: React.FC<{ filters: FilterOptions }> = ({ filters }) => {
  const { data: catData, isLoading: catsLoading } = api.get.getCats.useQuery();
  const { data: budgetRes, isLoading: budgetLoading } =
    api.get.getBudgetSum.useQuery(
      {
        financialYear: filters.year,
        departmentId: Number(filters.departmentId),
        subDeptId: filters.subdepartmentId,
      },
      { enabled: !!catData },
    );
  console.log(budgetRes, "budgetRes");
  // join categories + budgets into rows
  const rows = useMemo<BudgetItem[]>(() => {
    if (catsLoading || budgetLoading || !catData?.categories || !budgetRes) {
      return [];
    }

    // ensure filters match the payload
    if (
      Number(filters.departmentId) !== budgetRes.departmentId ||
      filters.subdepartmentId !== budgetRes.subDeptId ||
      filters.year !== budgetRes.financialYear
    ) {
      return [];
    }
    const totalEmp = budgetRes.budgetData[0]?.employeeCount ?? 0;

    // Map the quarter name to the field in your API response
    const quarterField: keyof (typeof budgetRes.budgetData)[0] =
      filters.quarter === "All"
        ? "budget"
        : (`q${filters.quarter.slice(1)}` as "q1" | "q2" | "q3" | "q4");

    return catData.categories.map((cat) => {
      // find the matching budget object for this category
      const b = budgetRes.budgetData.find((b) => b.catid === cat.categoryId);

      // pick only the selected quarter (or full year)
      const amount = b ? Number(b[quarterField]) : 0;

      const variance =
        filters.quarter === "All"
          ? // annual variance = budget - actual
            Number(b?.budget ?? 0) - amount
          : // quarter variance = quarterBudget - quarterActual
            amount - amount; // or your actual-expense field if separate

      const utilization =
        amount > 0 ? `${((amount / amount) * 100).toFixed(1)}%` : "0%";
      // adjust actual vs. budget if you have separate actual data

      return {
        categoryId: cat.categoryId,
        categoryName: cat.categoryName,
        budget: amount, // shows only q1/q2/q3/q4 or full-year
        actual: amount, // same here, or wire up your real actual
        variance,
        utilization,
        employeeCount: totalEmp,
      };
    });
  }, [
    catData,
    budgetRes,
    catsLoading,
    budgetLoading,
    filters.departmentId,
    filters.subdepartmentId,
    filters.year,
    filters.quarter, // <-- include quarter in deps
  ]);

  if (catsLoading || budgetLoading) {
    return <div>Loading...</div>;
  }
  console.log(rows, "rows");
  return (
    <div className="overflow-x-auto rounded-md bg-white shadow-lg">
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-200 text-center text-sm text-gray-600">
            <th className="p-2 text-left">Description</th>
            <th className="p-2 font-bold">Employee Count</th>
            <th className="p-2 font-bold">Budget</th>
            <th className="p-2 font-bold">Actual</th>
            {/* hide on <640px */}
            <th className="hidden p-2 font-bold sm:table-cell">Variance</th>
            {/* hide on <768px */}
            <th className="hidden p-2 font-bold md:table-cell">
              % Utilization
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.categoryId} className="text-sm transition-colors">
              {/* Description */}
              <td className="border p-1 text-left font-medium">
                {row.categoryName}
              </td>
              <td className="border p-1 text-center">
                {row.employeeCount}
              </td>
              {/* Budget */}
              <td className="border p-1 text-center">
                {row.budget.toLocaleString("hi-IN")}
              </td>
              {/* Actual */}
              <td className="border p-1 text-center">
                {row.actual.toLocaleString("hi-IN")}
              </td>
              {/* Variance */}
              <td className="hidden border p-1 text-center sm:table-cell">
                {row.variance?.toLocaleString("hi-IN")}
              </td>
              {/* % Utilization */}
              <td className="hidden border p-1 text-center md:table-cell">
                {row.utilization}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ShowBudget;
