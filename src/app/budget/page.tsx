"use client";

import { useEffect, useState } from "react";
import BudgetFilterForm from "./filter";
import PersonnelCost from "./personnelCost";
import ActivityBudget from "./activityBudget";
import TravelBudget from "./travel";
import ProgramOffice from "./programOffice";
import CapitalCost from "./capitalCost";
import OverHeads from "./overheads";
import type { FilterOptions } from "./budget";
import { api } from "~/trpc/react";
import { useSession } from "next-auth/react";

// Define types for filters

type HandleSelectValue =
  | { id: string | number; departmentname: string } // For department objects
  | string // For simple string values
  | number; // For numeric values

const Budget: React.FC = () => {
  // Explicitly define the type for filters
  const userData = useSession();
  const year = new Date().getFullYear();
  const month = new Date().getMonth();
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [sectionOpen, setSectionOpen] = useState<
    | null
    | "PERSONNEL"
    | "Program Activities"
    | "Travel"
    | "PROGRAM OFFICE"
    | "CAPITAL COST"
    | "OVERHEADS"
  >(null);
  const [filters, setFilters] = useState<FilterOptions>({
    department: userData.data?.user.departmentId?.toString() ?? "0",
    departmentname: userData.data?.user.departmentName ?? "All",
    year:
      month >= 3
        ? `${year.toString()}-${(year + 1).toString().slice(2)}`
        : `${(year - 1).toString()}-${year.toString().slice(2)}`,
    // need to be updated wit respect to user login
    subdepartmentId: userData.data?.user.subDepartmentId ?? 0,
    subdepartmentName: userData.data?.user.subDepartmentName ?? "All",
  });
  const [budgetId, setBudgetId] = useState<number | null>(null);
  const [personnelTotals, setPersonnelTotals] = useState({
    totalQ1: 0,
    totalQ2: 0,
    totalQ3: 0,
    totalQ4: 0,
    totalFY: 0,
  });
  const [activityTotals, setActivityTotals] = useState({
    totalQ1: 0,
    totalQ2: 0,
    totalQ3: 0,
    totalQ4: 0,
    totalFY: 0,
  });
  const [travelTotals, setTravelTotals] = useState({
    totalQ1: 0,
    totalQ2: 0,
    totalQ3: 0,
    totalQ4: 0,
    totalFY: 0,
  });
  const [programOfficeTotals, setProgramOfficeTotals] = useState({
    totalQ1: 0,
    totalQ2: 0,
    totalQ3: 0,
    totalQ4: 0,
    totalFY: 0,
  });
  const [capitalTotals, setCapitalTotals] = useState({
    totalQ1: 0,
    totalQ2: 0,
    totalQ3: 0,
    totalQ4: 0,
    totalFY: 0,
  });
  const [overheadsTotals, setOverheadsTotals] = useState({
    totalQ1: 0,
    totalQ2: 0,
    totalQ3: 0,
    totalQ4: 0,
    totalFY: 0,
  });
  const handleSelect = (name: string, value: HandleSelectValue) => {
    if (name === "department" && typeof value === "object" && value !== null) {
      const departmentValue = value as { id: string; departmentname: string }; // Narrow type
      setFilters((prev) => ({
        ...prev,
        department: departmentValue.id, // Use the explicit type
        departmentname: departmentValue.departmentname, // Extract department name
      }));
    } else if (
      name === "subdepartment" &&
      typeof value === "object" &&
      value !== null
    ) {
      const subDeptVal = value as { id: number; departmentname: string }; // Narrow type
      setFilters((prev) => ({
        ...prev,
        subdepartmentId: subDeptVal.id,
        subdepartmentName: subDeptVal.departmentname,
      }));
    } else if (name === "year" && typeof value === "string") {
      setFilters((prev) => ({
        ...prev,
        [name]: value, // Year is a string
      }));
    }
  };
  const shouldFetch = filters.department !== "" && filters.year !== "";
  const { data: budgetRes, isLoading } = api.get.getBudgetMaster.useQuery(
    shouldFetch
      ? {
          deptId: Number(filters.department),
          financialYear: filters.year,
        }
      : {
          deptId: 1,
          financialYear: "1",
        },
    {
      enabled: shouldFetch,
    },
  );
  useEffect(() => {
    if (budgetRes) {
      setBudgetId(budgetRes.budgetId ?? null);
      setStatus(budgetRes.status ?? undefined);
    } else {
      setBudgetId(null);
      setStatus(undefined);
    }
  }, [budgetRes]);
  // get all main categories
  const { data } = api.get.getCats.useQuery();
  const allQ1 =
    personnelTotals.totalQ1 +
    activityTotals.totalQ1 +
    travelTotals.totalQ1 +
    programOfficeTotals.totalQ1 +
    capitalTotals.totalQ1 +
    overheadsTotals.totalQ1;

  const allQ2 =
    personnelTotals.totalQ2 +
    activityTotals.totalQ2 +
    travelTotals.totalQ2 +
    programOfficeTotals.totalQ2 +
    capitalTotals.totalQ2 +
    overheadsTotals.totalQ2;

  const allQ3 =
    personnelTotals.totalQ3 +
    activityTotals.totalQ3 +
    travelTotals.totalQ3 +
    programOfficeTotals.totalQ3 +
    capitalTotals.totalQ3 +
    overheadsTotals.totalQ3;

  const allQ4 =
    personnelTotals.totalQ4 +
    activityTotals.totalQ4 +
    travelTotals.totalQ4 +
    programOfficeTotals.totalQ4 +
    capitalTotals.totalQ4 +
    overheadsTotals.totalQ4;

  const allFY =
    personnelTotals.totalFY +
    activityTotals.totalFY +
    travelTotals.totalFY +
    programOfficeTotals.totalFY +
    capitalTotals.totalFY +
    overheadsTotals.totalFY;
  return (
    <div className="overflow-hidden">
      {/* {JSON.stringify(userData)} */}
      <BudgetFilterForm
        filters={filters}
        handleSelect={handleSelect}
        budgetId={budgetId}
        setBugetId={setBudgetId}
        status={status}
        setStatus={setStatus}
      />
      {isLoading && <div>loading</div>}

      {budgetId != null && !isLoading && (
        <div className="m-2 mt-24">
          <div className="mt-20 p-2 text-right font-black text-green-900">
            {status == "submitted" && <p>{status.toUpperCase()}</p>}
            {status == "draft" && userData.data?.user.role == 1 && (
              <p className="text-red-900">{status.toUpperCase()}</p>
            )}
            {status == "approved" && <p>{status.toUpperCase()}</p>}
          </div>{" "}
          {/* Header row */}
          <div className="flex items-center gap-20 rounded-md border border-primary/20 bg-primary/10 p-2 font-medium text-primary transition-all hover:border-primary/40 hover:shadow-sm">
            {/* 1st column: “BUDGET CATEGORY” */}
            <div className="flex w-1/6 items-center">
            <div className="">Budget Category</div>
            </div>
            {/* 2nd–6th columns: Q1, Q2, Q3, Q4, FY */}
            <div className="flex justify-start gap-4 w-5/6">
            <div className="w-1/6 text-center">Q1</div>
            <div className="w-1/6 text-center">Q2</div>
            <div className="w-1/6 text-center">Q3</div>
            <div className="w-1/6 text-center">Q4</div>
            <div className="w-1/6 mx-8 text-center">Total</div>
            </div>
          </div>
          {/* Render budget category sections */}
          <PersonnelCost
            section="PERSONNEL"
            categoryId={
              data?.categories[0] ? data?.categories[0].categoryId : 1
            }
            deptId={filters.department}
            budgetId={budgetId}
            status={status}
            setSectionOpen={setSectionOpen}
            sectionOpen={sectionOpen}
            travelCatId={
              data?.categories[2] ? data?.categories[2].categoryId : 3
            }
            subdepartmentId={filters.subdepartmentId}
            financialYear={filters.year}
            onTotalsChange={setPersonnelTotals}
          />
          <ActivityBudget
            section="Program Activities"
            categoryId={
              data?.categories[1] ? data?.categories[1].categoryId : 2
            }
            budgetId={budgetId}
            deptId={filters.department}
            status={status}
            setSectionOpen={setSectionOpen}
            sectionOpen={sectionOpen}
            subdepartmentId={filters.subdepartmentId}
            financialYear={filters.year}
          />
          <TravelBudget
            section="Travel"
            categoryId={
              data?.categories[2] ? data?.categories[2].categoryId : 3
            }
            deptId={filters.department}
            budgetId={budgetId}
            searchSubCatId={
              data?.categories[0] ? data?.categories[0].categoryId : 1
            }
            status={status}
            setSectionOpen={setSectionOpen}
            sectionOpen={sectionOpen}
            subdepartmentId={filters.subdepartmentId}
            financialYear={filters.year}
          />
          <ProgramOffice
            section="PROGRAM OFFICE"
            categoryId={
              data?.categories[3] ? data?.categories[3].categoryId : 4
            }
            budgetId={budgetId}
            deptId={filters.department}
            status={status}
            sectionOpen={sectionOpen}
            setSectionOpen={setSectionOpen}
            subdepartmentId={filters.subdepartmentId}
            financialYear={filters.year}
          />
          <CapitalCost
            section="CAPITAL COST"
            categoryId={
              data?.categories[4] ? data?.categories[4].categoryId : 5
            }
            budgetId={budgetId}
            deptId={filters.department}
            status={status}
            sectionOpen={sectionOpen}
            setSectionOpen={setSectionOpen}
            subdepartmentId={filters.subdepartmentId}
            financialYear={filters.year}
          />
          <OverHeads
            section="OVERHEADS"
            categoryId={
              data?.categories[5] ? data?.categories[5].categoryId : 6
            }
            budgetId={budgetId}
            deptId={filters.department}
            status={status}
            sectionOpen={sectionOpen}
            setSectionOpen={setSectionOpen}
            subdepartmentId={filters.subdepartmentId}
            financialYear={filters.year}
          />{" "}
          {/* Footer row */}{" "}
          <div className="flex items-center gap-36 rounded-md border border-primary/20 bg-primary/10 p-2 font-medium text-primary transition-all hover:border-primary/40 hover:shadow-sm">
            <div className="flex w-1/6 items-center">
              <div className="">TOTAL</div>
            </div>
            <div className="flex w-5/6 justify-start gap-8">
              <div className="w-1/6">{allQ1.toLocaleString("hi-IN")}</div>
              <div className="w-1/6">{allQ2.toLocaleString("hi-IN")}</div>
              <div className="w-1/6">{allQ3.toLocaleString("hi-IN")}</div>
              <div className="w-1/6">{allQ4.toLocaleString("hi-IN")}</div>
              <div className="w-1/6">{allFY.toLocaleString("hi-IN")}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Budget;
