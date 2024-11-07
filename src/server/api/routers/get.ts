import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { getStaffs } from "../controller/staff";
import { getDonors } from "../controller/donor";
import { getCostCenters } from "../controller/costCenters";
import { getDepartments } from "../controller/department";

export const getRouter = createTRPCRouter({
  getStaffs,
  getDonors,
  getCostCenters,
  getDepartments,
  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
