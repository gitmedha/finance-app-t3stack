import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { getDesignation, getStaffs } from "../controller/staff";
import { getDonors } from "../controller/donor";
import { getCostCenters } from "../controller/costCenters";
import { getDepartments } from "../controller/department";
import { getAllLocations, getAllStates } from "../controller/geography";

export const getRouter = createTRPCRouter({
  getStaffs,
  getDonors,
  getCostCenters,
  getDesignation,
  getDepartments,
  getAllStates,
  getAllLocations,
  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
