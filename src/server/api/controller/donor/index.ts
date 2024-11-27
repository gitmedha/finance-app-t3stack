
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

  const totalCount = totalCountResult[0]?.count ?? 0;

  return {
    donors,
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
  };
})


export const addDonor = protectedProcedure
  .input(
    z.object({
      name: z.string().min(1, "Name is required"),
      costCenter: z.number().optional(),
      finYear: z.number().min(2000, "Invalid min financial year").max(3100, "Invalid max financial year"),
      totalBudget: z.number().positive("Total budget must be greater than 0"),
      budgetReceived: z.number().positive("Budget received must be greater than 0"),
      currency: z.string().min(1, "Currency is required"),
      notes: z.string().optional().nullable(),
      description: z.string().optional().nullable(),
      isactive: z.boolean(),
      createdBy: z.number().min(1, "Invalid creator ID"),
      type: z.string().optional(),
      createdAt: z.string(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    try {
      // Convert numeric fields to strings for the database
      const formattedInput = {
        ...input,
        totalBudget: input.totalBudget.toString(),
        budgetReceived: input.budgetReceived.toString(),
        id:undefined
      };
      console.log(formattedInput)

      // Insert new donor into the database
      const result = await ctx.db.insert(donorMaster).values(formattedInput);
      return {
        success: true,
        message: "Donor added successfully",
        donor: result[0], // Return the created donor
      };
    } catch (error) {
      console.log(error);
      console.error("Error adding donor:", error);
      throw new Error("Failed to add donor. Please try again.");
    }
  });
