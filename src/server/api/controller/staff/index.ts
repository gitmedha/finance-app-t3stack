
import { count, ilike } from "drizzle-orm";
import { z } from "zod";
import {
//   createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { db } from "~/server/db";
import { staffMasterInFinanceProject } from "~/server/db/schema";

export const getStaffs = protectedProcedure.input(z.object({
    page: z.number().min(1).default(1),
    limit: z.number().min(1).max(100).default(10),
    searchTerm: z.string().optional().default(""), // Optional search term
  })).query(async ({ ctx, input }) => {
    const { page, limit, searchTerm } = input;
    const offset = (page - 1) * limit;
    // Apply the search condition only if searchTerm is not an empty string
    const searchCondition = searchTerm
      ? ilike(staffMasterInFinanceProject.name, `%${searchTerm}%`)
      : undefined;

    // Fetch the staff records with pagination, search, and offset
    const staffs = await ctx.db.query.staffMasterInFinanceProject.findMany({
      where: searchCondition, // Only applies if searchCondition is defined
      limit,
      offset,
    });

    // Get the total count of records with the same condition
    const totalCountResult = await db.select({ count: count() })
      .from(staffMasterInFinanceProject)
      .where(searchCondition); // Count with filter if searchCondition is defined

    const totalCount = totalCountResult[0]?.count || 0;

    return {
      staffs,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
    };
  })