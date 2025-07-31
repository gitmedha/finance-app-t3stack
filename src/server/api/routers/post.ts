import { createTRPCRouter } from "~/server/api/trpc";
import { login } from "../controller/user";
import { addDonor, editDonor } from "../controller/donor";
import { activateStaff, addStaff, editStaff } from "../controller/staff";
import { addDepartment, editDepartment, reactivateDepartment } from "../controller/department";
import { addCostCenter, editCostCenter } from "../controller/costCenters";
import {
  addStaffSalaryDetails,
  editStaffSalaryDetails,
} from "../controller/salaryDetails";
import { addBudgetDetails, addProgramOfficeBudgetDetails, addCapitalCostBudgetDetails, createBudget, savePersonalBudgetDetails, saveTravelBudgetDetails, updateBudgetDetails,  updatePersonalBudgetDetails, updateProgramOfficeBudgetDetails, updateCapitalCostBudgetDetails, updateStatusBudgetDetails, updateTravelBudgetDetails, addOverHeadsBudgetDetails, updateOverHeadsBudgetDetails } from "../controller/budget";
import { addProgramActivities, reactivateProgramActivity, updateProgramActivity } from "../controller/programActivities";

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
  updateProgramOfficeBudgetDetails,
  updateCapitalCostBudgetDetails,
  updateTravelBudgetDetails,
  addBudgetDetails,
  addProgramOfficeBudgetDetails,
  addCapitalCostBudgetDetails,
  addOverHeadsBudgetDetails,
  updateOverHeadsBudgetDetails,
  updateStatusBudgetDetails,
  savePersonalBudgetDetails,
  updatePersonalBudgetDetails,
  saveTravelBudgetDetails,
  reactivateDepartment,
  activateStaff,
  addProgramActivities,
  updateProgramActivity,
  reactivateProgramActivity
});
