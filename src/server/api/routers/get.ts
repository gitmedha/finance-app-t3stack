import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { getDesignation, getLevels, getStaffs } from "../controller/staff";
import { getDonors } from "../controller/donor";
import { getCostCenters, getAllCostCenters } from "../controller/costCenters";
import { getDepartments, getAllDepartments } from "../controller/department";
import { getAllLocations, getAllStates } from "../controller/geography";
import { getBudgetMaster, getCats, getCatsBudgetDetails, getLevelStaffCount, getSubCats } from "../controller/budget";
import { getQuarterBudgetSum, getTotalBudgetSum } from "../controller/home";

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
  getTotalBudgetSum,
  getQuarterBudgetSum,
  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
