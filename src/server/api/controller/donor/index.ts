import { and, count, eq, ilike } from "drizzle-orm";
import { z } from "zod";
import {
  //   createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { db } from "~/server/db";
import { donorMasterInFinanceProject as donorMaster, costCenterInFinanceProject as costCenterMaster } from "~/server/db/schema";

export const getDonors = protectedProcedure
  .input(
    z.object({
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(100).default(10),
      searchTerm: z.string().optional().default(""), // Optional search term
      type: z.string().optional().default(""), // Optional search term
      status: z.string().optional().default(""), // Optional search term
    }),
  )
  .query(async ({ ctx, input }) => {
    const { page, limit, searchTerm, type, status } = input;
    const offset = (page - 1) * limit;
    // Apply the search condition only if searchTerm is not an empty string
    const searchCondition = searchTerm
      ? ilike(donorMaster.name, `%${searchTerm}%`)
      : undefined;
    const typeCondition = type ? eq(donorMaster.type, type) : undefined;
    const statusCondition = status
      ? eq(donorMaster.isactive, status === "Active")
      : undefined;

    const donors = await ctx.db
      .select({
        id: donorMaster.id,
        name: donorMaster.name,
        costCenter: donorMaster.costCenter,
        finYear: donorMaster.finYear,
        totalBudget: donorMaster.totalBudget,
        budgetReceived: donorMaster.budgetReceived,
        currency: donorMaster.currency,
        notes: donorMaster.notes,
        description: donorMaster.description,
        isactive: donorMaster.isactive,
        createdAt: donorMaster.createdAt,
        updatedAt: donorMaster.updatedAt,
        createdBy: donorMaster.createdBy,
        updatedBy: donorMaster.updatedBy,
        type: donorMaster.type,
        costCenterName: costCenterMaster.name
        // count: count()
      })
      .from(donorMaster)
      .leftJoin(
        costCenterMaster,
        and(
          eq(costCenterMaster.isactive, true),
          eq(costCenterMaster.id, donorMaster.costCenter),
        ),
      )
      .where(and(searchCondition, typeCondition, statusCondition))
      .offset(offset)
      .limit(limit);

    const totalCountResult = await db
      .select({ count: count() })
      .from(donorMaster)
      .where(and(searchCondition, typeCondition, statusCondition)); // Count with filter if searchCondition is defined

    const totalCount = totalCountResult[0]?.count ?? 0;

    const updatedDonors = [];
    
    for (const donor of donors) {
      const costCenterData = {
        value: donor.costCenter ?? 1,
        label: donor.costCenterName ?? ""
      }

      updatedDonors.push({
        ...donor,
        costCenterData
      })
    }

    return {
      donors: updatedDonors,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
    };
  });

export const addDonor = protectedProcedure
  .input(
    z.object({
      name: z.string().min(1, "Name is required"),
      costCenter: z.number().optional(),
      finYear: z
        .number()
        .min(2000, "Invalid min financial year")
        .max(3100, "Invalid max financial year"),
      totalBudget: z.string(),
      budgetReceived: z.string(),
      currency: z.string().min(1, "Currency is required"),
      notes: z.string().optional().nullable(),
      description: z.string().optional().nullable(),
      isactive: z.boolean(),
      createdBy: z.number().min(1, "Invalid creator ID"),
      type: z.string().optional(),
      createdAt: z.string(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    try {
      // Ensure the input is correctly formatted for the DB
      const formattedInput = {
        ...input,
        totalBudget: parseFloat(input.totalBudget).toFixed(2),
        budgetReceived: parseFloat(input.budgetReceived).toFixed(2),
      };
    

      // Insert new donor into the database
      const result = await ctx.db.insert(donorMaster).values(formattedInput);
      return {
        success: true,
        message: "Donor added successfully",
        donor: result[0], // Return the created donor
      };
    } catch (error) {
      console.error("Error adding donor:", error);
      throw new Error("Failed to add donor. Please try again.");
    }
  });

export const editDonor = protectedProcedure
  .input(
    z.object({
      id: z.number().min(1, "Donor ID is required"), // Ensure the donor ID is provided
      name: z.string().min(1, "Name is required").optional(),
      costCenter: z.number().optional(),
      finYear: z
        .number()
        .min(2000, "Invalid min financial year")
        .max(3100, "Invalid max financial year")
        .optional(),
      totalBudget: z.string(),
      budgetReceived: z.string(),
      currency: z.string().min(1, "Currency is required").optional(),
      notes: z.string().optional().nullable(),
      description: z.string().optional().nullable(),
      isactive: z.boolean().optional(),
      type: z.string().optional(),
      updatedBy: z.number().min(1, "Invalid updater ID"),
      updatedAt: z.string(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    try {
      const { id, updatedBy, updatedAt, ...updatedFields } = input;

      // Check if the donor exists before updating
      const existingDonor =
        await ctx.db.query.donorMasterInFinanceProject.findFirst({
          where: eq(donorMaster.id, id),
        });

      if (!existingDonor) {
        throw new Error("Donor not found");
      }

      // Update donor in the database
      const result = await ctx.db
        .update(donorMaster)
        .set({
          ...updatedFields,
          updatedBy,
          updatedAt,
        })
        .where(eq(donorMaster.id, id))
        .returning();

      return {
        success: true,
        message: "Donor updated successfully",
        donor: result[0], // Return the updated donor
      };
    } catch (error) {
      console.error("Error editing donor:", error);
      throw new Error("Failed to update donor. Please try again.");
    }
  });

export const deleteDonor = protectedProcedure
  .input(
    z.object({
      id: z.number().min(1, "Donor ID is required"), // Donor ID to locate the record
    }),
  )
  .mutation(async ({ ctx, input }) => {
    try {
      const { id } = input;

      // Check if the donor member exists
      const existingStaff =
        await ctx.db.query.staffMasterInFinanceProject.findFirst({
          where: eq(donorMaster.id, id),
        });

      if (!existingStaff) {
        throw new Error("Donor member not found");
      }

      // Update donor member details
      const updatedStaff = await ctx.db
        .update(donorMaster)
        .set({
          isactive: false,
        })
        .where(eq(donorMaster.id, id))
        .returning(); // Correct usage of eq()
      // .returning("*");

      return {
        success: true,
        message: "Donor member deleted successfully",
        donor: updatedStaff[0], // Return the updated donor record
      };
    } catch (error) {
      console.error("Error deleting donor:", error);
      throw new Error("Failed to delete donor. Please try again.");
    }
  });
