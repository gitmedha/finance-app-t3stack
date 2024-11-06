import { count } from "drizzle-orm";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { db } from "~/server/db";
import { staffMasterInFinanceProject } from "~/server/db/schema";

export const getRouter = createTRPCRouter({
  getStaffs: protectedProcedure.input(z.object({
    page: z.number().min(1).default(1),
    limit: z.number().min(1).max(100).default(10)
  })).query(async ({ ctx, input }) => {
    const { page, limit } = input;

    // Calculate the offset
    const offset = (page - 1) * limit;

    // Fetch the staff records with pagination using limit and offset
    const staffs = await ctx.db.query.staffMasterInFinanceProject.findMany({ limit, offset })
    const totalCountResult = await db.select({ count: count() }).from(staffMasterInFinanceProject);
    const totalCount = totalCountResult[0]?.count || 0;
    return {
    staffs,
    totalCount,
    // currentPage: page,
    totalPages: Math.ceil(totalCount/limit),
  };
}),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});

