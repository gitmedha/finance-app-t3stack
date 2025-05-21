import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { getDesignation, getLevels, getStaffs, getStaffLevels } from "../controller/staff";
import { getDonors } from "../controller/donor";
import { getCostCenters, getAllCostCenters } from "../controller/costCenters";
import { getDepartments, getAllDepartments, getHeadDepartments, getSubDepartments } from "../controller/department";
import { getAllLocations, getAllStates } from "../controller/geography";
import { getBudgetMaster, getCapitalCostData, getCats, getCatsBudgetDetails, getLevelStaffCount, getOverHeadsData, getPersonalCatDetials, getProgramActivities, getProgramOfficeData, getSubCats, getSubDepts, getTravelCatDetials } from "../controller/budget";
import { getBudgetSum, getQuarterBudgetSum, getTotalBudgetSum } from "../controller/home";

export const getRouter = createTRPCRouter({
  getStaffs,
  getDonors,
  getCostCenters,
  getAllCostCenters,
  getDesignation,
  getDepartments,
  getAllDepartments,
  getAllStates,
  getAllLocations,
  getCats,
  getSubCats,
  getBudgetMaster,
  getCatsBudgetDetails,
  getLevelStaffCount,
  getLevels,
  getStaffLevels,
  getTotalBudgetSum,
  getQuarterBudgetSum,
  getPersonalCatDetials,
  getProgramActivities,
  getTravelCatDetials,
  getProgramOfficeData,
  getCapitalCostData,
  getOverHeadsData,
  getHeadDepartments,
  getSubDepts,
  getSubDepartments,
  getBudgetSum,
  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
