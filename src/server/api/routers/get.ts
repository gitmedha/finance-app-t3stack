import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { getStaffs } from "../controller/staff";
import { getDonors } from "../controller/donor";

export const getRouter = createTRPCRouter({
  getStaffs,
  getDonors,
  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
