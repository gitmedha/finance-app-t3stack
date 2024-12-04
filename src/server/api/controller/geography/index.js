
import { statesMasterInFinanceProject } from "drizzle/schema";
import {
  protectedProcedure,
} from "~/server/api/trpc";
import { locationMasterInFinanceProject } from "~/server/db/schema";

export const getAllStates = protectedProcedure.query(async ({ ctx }) => {
  const states = await ctx.db.select().from(statesMasterInFinanceProject)
  return {
    states
  };
})

export const getAllLocations = protectedProcedure.query(async ({ ctx }) => {
  const locations = await ctx.db.select().from(locationMasterInFinanceProject)
  return {
    locations
  };
})
