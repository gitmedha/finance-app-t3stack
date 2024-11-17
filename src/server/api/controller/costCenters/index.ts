
import { and, count, eq, ilike } from "drizzle-orm";
import { z } from "zod";
import {
  //   createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { db } from "~/server/db";
import { costCenterInFinanceProject as costCenter } from "~/server/db/schema";

export const getCostCenters = protectedProcedure.input(z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  searchTerm: z.string().optional().default(""), // Optional search term
  type: z.string().optional().default(""), // Optional search term
  status: z.string().optional().default(""), // Optional search term

})).query(async ({ ctx, input }) => {
  const { page, limit, searchTerm, type , status} = input;
  const offset = (page - 1) * limit;
  // Apply the search condition only if searchTerm is not an empty string
  const searchCondition = searchTerm
    ? ilike(costCenter.name, `%${searchTerm}%`)
    : undefined;
  const statusCondition = status ? eq(costCenter.isactive, (status === 'Active')) : undefined
  const typeCondition = type ? eq(costCenter.type, type) : undefined

  const costCenters = await ctx.db.select({
    id: costCenter.id,
    name: costCenter.name,
    type: costCenter.type,
    parentId: costCenter.parentId,
    description: costCenter.description,
    notes: costCenter.notes,
    isactive: costCenter.isactive,
    createdAt: costCenter.createdAt,
    updatedAt: costCenter.updatedAt,
    createdBy: costCenter.createdBy,
    updatedBy: costCenter.updatedBy,
    code: costCenter.code,
    // count: count()
  }).from(costCenter).where(and(
    searchCondition,
    statusCondition,
    typeCondition
  )).offset(offset).limit(limit)


  const totalCountResult = await db.select({ count: count() }).from(costCenter).where(and(
    searchCondition,
    statusCondition,
    typeCondition
  )); // Count with filter if searchCondition is defined

  const totalCount = totalCountResult[0]?.count ?? 0;

  return {
    costCenters,
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
  };
})
