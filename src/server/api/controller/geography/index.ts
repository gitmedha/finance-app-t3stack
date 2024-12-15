import { eq } from "drizzle-orm";
import { z } from "zod";
import { protectedProcedure } from "~/server/api/trpc";
import {
  locationMasterInFinanceProject,
  statesMasterInFinanceProject,
  // departmentMasterInFinanceProject
} from "~/server/db/schema";

export const getAllStates = protectedProcedure.query(async ({ ctx }) => {
  const states = await ctx.db
    .select({
      id: statesMasterInFinanceProject.id,
      name: statesMasterInFinanceProject.name,
    })
    .from(statesMasterInFinanceProject);

  return states.map((state) => {
    return {
      value: state.id,
      label: state.name,
    };
  });
});

export const getAllLocations = protectedProcedure
  .input(
    z.object({
      stateName: z.string().default(""),
    }),
  )
  .query(async ({ ctx, input }) => {
    const locations = await ctx.db
      .select({
        id: locationMasterInFinanceProject.id,
        name: locationMasterInFinanceProject.cityName,
      })
      .from(locationMasterInFinanceProject)
      .where(eq(locationMasterInFinanceProject.stateName, input.stateName));

    return locations.map((location) => {
      return {
        value: location.id,
        label: location.name,
      };
    });
  });

