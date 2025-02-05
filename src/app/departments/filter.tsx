import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { RiArrowDropDownLine } from "react-icons/ri";
import type { DepartmentFilterFormProps } from "./department";

const types = [
  { value: "", label: "" },
  { value: "Sub Department", label: "Sub Department" },
  { value: "Department", label: "Department" },
];

const DepartmentFilterForm: React.FC<DepartmentFilterFormProps> = ({
  filters,
  handleSelect,
}) => {
  return (
    <>
      <div className="w-52">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              color="gray"
              className="flex w-full cursor-pointer items-center justify-between rounded-lg border py-1 pl-2 text-left text-sm font-normal text-gray-500"
            >
              <span>{filters.status || "Select Status"}</span>
              <RiArrowDropDownLine size={30} />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content className="max-h-56 !w-[220px] overflow-y-scroll rounded-lg bg-white p-2 shadow-lg">
            {[
              { value: "", label: "" },
              { value: "Active", label: "Active" },
              { value: "Inactive", label: "Inactive" },
            ].map((status) => (
              <DropdownMenu.Item
                key={status.value}
                className="cursor-pointer rounded p-2 hover:bg-gray-100 focus:ring-0"
                onSelect={() => handleSelect("status", status)}
              >
                {status.value || "All"}
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>

      <div className="w-52">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger className="w-full" asChild>
            <button
              color="gray"
              className="flex w-full cursor-pointer items-center justify-between rounded-lg border py-1 pl-2 text-left text-sm font-normal text-gray-500"
            >
              <span>{filters.type || "Select Type"}</span>
              <RiArrowDropDownLine size={30} />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content className="max-h-56 !w-[220px] overflow-y-scroll rounded-lg bg-white p-2 shadow-lg">
            {types.map((type, i) => (
              <DropdownMenu.Item
                key={type?.value || i}
                className="cursor-pointer rounded p-2 hover:bg-gray-100 focus:ring-0"
                onSelect={() => handleSelect("type", type)}
              >
                {type?.value || "All"}
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
    </>
  );
};

export default DepartmentFilterForm;
