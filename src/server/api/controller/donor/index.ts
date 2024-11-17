
import { and, count, eq, ilike } from "drizzle-orm";
import { z } from "zod";
import {
  //   createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { db } from "~/server/db";
import { donorMasterInFinanceProject as donorMaster } from "~/server/db/schema";

export const getDonors = protectedProcedure.input(z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  searchTerm: z.string().optional().default(""), // Optional search term
  type: z.string().optional().default(""), // Optional search term
  status: z.string().optional().default(""), // Optional search term
})).query(async ({ ctx, input }) => {
  const { page, limit, searchTerm, type, status } = input;
  const offset = (page - 1) * limit;
  // Apply the search condition only if searchTerm is not an empty string
  const searchCondition = searchTerm
    ? ilike(donorMaster.name, `%${searchTerm}%`)
    : undefined;
  const typeCondition = type ? eq(donorMaster.type, type) : undefined
  const statusCondition = status ?  eq(donorMaster.isactive, (status === 'Active')) : undefined

  const donors = await ctx.db.select({
    id:donorMaster.id,
    name:donorMaster.name,
    costCenter:donorMaster.costCenter,
    finYear:donorMaster.finYear,
    totalBudget:donorMaster.totalBudget,
    budgetReceived:donorMaster.budgetReceived,
    currency:donorMaster.currency,
    notes:donorMaster.notes,
    description:donorMaster.description,
    isactive:donorMaster.isactive,
    createdAt:donorMaster.createdAt,
    updatedAt:donorMaster.updatedAt,
    createdBy:donorMaster.createdBy,
    updatedBy:donorMaster.updatedBy,
    type:donorMaster.type,
    // count: count()
  }).from(donorMaster).where(and(
    searchCondition,
    typeCondition,
    statusCondition
  )).offset(offset).limit(limit)

  const totalCountResult = await db.select({ count: count() }).from(donorMaster).where(and(
    searchCondition,
    typeCondition,
    statusCondition
  )); // Count with filter if searchCondition is defined

  const totalCount = totalCountResult[0]?.count || 0;

  return {
    donors,
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
  };
})