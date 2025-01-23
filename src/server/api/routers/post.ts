import { createTRPCRouter } from "~/server/api/trpc";
import { login } from "../controller/user";
import { addDonor, editDonor } from "../controller/donor";
import { addStaff, editStaff } from "../controller/staff";
import { addDepartment, editDepartment } from "../controller/department";
import { addCostCenter, editCostCenter } from "../controller/costCenters";
import {
  addStaffSalaryDetails,
  editStaffSalaryDetails,
} from "../controller/salaryDetails";
import { addBudgetDetails, createBudget, updateBudgetDetails, updateStatusBudgetDetails } from "../controller/budget";

export const postRouter = createTRPCRouter({
  login,
  addDonor,
  editDonor,
  addStaff,
  editStaff,
  addDepartment,
  editDepartment,
  addCostCenter,
  editCostCenter,
  addStaffSalaryDetails,
  editStaffSalaryDetails,
  createBudget,
  updateBudgetDetails,
  addBudgetDetails,
  updateStatusBudgetDetails,
});
