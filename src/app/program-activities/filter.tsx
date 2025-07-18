"use client";

import React, { useEffect, useRef } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { RiArrowDropDownLine } from "react-icons/ri";
import { useSession } from "next-auth/react";
import { api } from "~/trpc/react";
import type { FilterProps } from "./program-activity.d";

type Option = { value: number | string; label: string };

export default function ProgramActivityFilterForm({
  filters,
  handleSelect,
}: FilterProps) {
  const { data: session } = useSession();
  const role = session?.user.role ?? 1;
  const prevDepartmentRef = useRef(filters.department);

  // Load department & sub-department lists
  const { data: depts = [] } = api.get.getHeadDepartments.useQuery();
  const { data: subs = [] } = api.get.getSubDepartments.useQuery(
    { deptId: filters.department ?? 0 },
    { enabled: Boolean(filters.department) },
  );

  // Build option arrays
  const deptOptions: Option[] = [
    { value: 0, label: "All" },
    ...depts
      .filter((d) => d.isactive)
      .map((d) => ({ value: d.value, label: d.label })),
  ];
  const subOptions: Option[] = [
    { value: 0, label: "All" },
    ...subs
      .filter((s) => s.isactive)
      .map((s) => ({ value: s.value, label: s.label })),
  ];
  const statusOptions: Option[] = [
    { value: "", label: "All" },
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
  ];

  // Financial year calculation
  const generateFYOptions = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 6 }, (_, i) => {
      const year = currentYear - 3 + i;
      const label = `${year}-${String(year + 1).slice(-2)}`;
      return { value: label, label };
    });
  };
  const fyOptions = generateFYOptions();

  const getCurrentFY = () => {
    const now = new Date();
    const year = now.getFullYear();
    return now.getMonth() >= 3
      ? `${year}-${String(year + 1).slice(-2)}`
      : `${year - 1}-${String(year).slice(-2)}`;
  };

  // Auto-select user’s department/sub-dept on mount
  useEffect(() => {
    if (session?.user) {
      if (
        session.user.departmentId &&
        filters.department !== session.user.departmentId
      ) {
        handleSelect("department", {
          value: session.user.departmentId,
          label: session.user.departmentName!,
        });
      }
      if (
        session.user.subDepartmentId &&
        filters.subdepartment !== session.user.subDepartmentId
      ) {
        handleSelect("subdepartment", {
          value: session.user.subDepartmentId,
          label: session.user.subDepartmentName!,
        });
      }
    }
  }, [session, filters.department, filters.subdepartment, handleSelect]);

  // Reset sub-department when department changes
  useEffect(() => {
    if (prevDepartmentRef.current !== filters.department) {
      prevDepartmentRef.current = filters.department;
      if (filters.subdepartment !== 0) {
        handleSelect("subdepartment", { value: 0, label: "All" });
      }
    }
  }, [filters.department, filters.subdepartment, handleSelect]);

  // Dropdown configurations
  const dropdowns = [
    {
      key: "department" as const,
      placeholder: "Select Department",
      selected:
        filters.department && filters.department !== 0
          ? filters.departmentname
          : null,
      options: deptOptions,
      disabled: role !== 1,
      show: () => true,
      showOptions: () => role === 1,
    },
    {
      key: "subdepartment" as const,
      placeholder: "Select Sub-Department",
      selected:
        filters.subdepartment && filters.subdepartment !== 0
          ? filters.subdepartmentname
          : null,
      options: subOptions,
      disabled: !filters.department || role === 3,
      show: () => true,
      showOptions: () => role === 1 || role === 2,
    },
    {
      key: "status" as const,
      placeholder: "Select Status",
      selected: filters.status || null,
      options: statusOptions,
      disabled: false,
      show: () => true,
      showOptions: () => true,
    },
    {
      key: "financialYear" as const,
      placeholder: "Select Financial Year",
      selected: filters.financialYear || null,
      options: fyOptions,
      disabled: false,
      show: () => true,
      showOptions: () => true,
    },
  ];

  // Fixed dropdown width
  const FIXED_WIDTH_PX = 220;

  return (
    <div className="flex w-full flex-col gap-2 md:flex-row md:gap-2">
      {dropdowns.map(
        ({
          key,
          placeholder,
          selected,
          options,
          disabled,
          show,
          showOptions,
        }) =>
          show() ? (
            <div key={key}>
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <button
                    disabled={disabled}
                    className={`flex h-10 w-full items-center justify-between rounded-lg border px-3 py-1 text-sm md:w-[220px] ${
                      disabled ? "opacity-50" : "cursor-pointer"
                    }`}
                  >
                    <span>{selected ?? placeholder}</span>
                    <RiArrowDropDownLine size={20} />
                  </button>
                </DropdownMenu.Trigger>

                {showOptions() && (
                  <DropdownMenu.Portal>
                    <DropdownMenu.Content
                      sideOffset={4}
                      className="max-h-[280px] w-full overflow-y-auto rounded-lg bg-white p-1 shadow-lg md:w-[220px]"
                    >
                      {options.map((opt) => (
                        <DropdownMenu.Item
                          key={`${key}-${opt.value}`}
                          style={{ width: "100%" }}
                          className="block px-2 py-1 text-sm hover:bg-gray-100"
                          onSelect={() => handleSelect(key, opt)}
                        >
                          {opt.label}
                        </DropdownMenu.Item>
                      ))}
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                )}
              </DropdownMenu.Root>
            </div>
          ) : null,
      )}
    </div>
  );
}
