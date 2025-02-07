interface FilterOptions {
    department: string;
    departmentname: string;
    year: string;
    subdepartmentId: number
    subdepartmentName: string
}
type HandleSelectValue =
    | { id: string | number; departmentname: string } // For department objects
    | string // For simple string values
    | number; // For numeric values

interface HomeFilterFormProps {
    filters: FilterOptions;
    handleSelect: (name: string, value: number | string | { id: number; departmentname: string }) => void;
}
export type { FilterOptions, HandleSelectValue, HomeFilterFormProps, tableSchema }

interface LevelSchema{
    "PERSONNEL":string
    "PROGRAM ACTIVITIES":string
    "PROGRAM TRAVEL":string
    "CAPITAL COST":string
    "PROGRAM OFFICE":string
    "OVERHEADS":string

}
type tableSchema = Record<number,LevelData>

