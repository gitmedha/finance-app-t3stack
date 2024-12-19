import { and, count, eq, ilike, desc } from "drizzle-orm";
import { z } from "zod";
import {
  //   createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { db } from "~/server/db";
import { costCenterInFinanceProject as costCenter } from "~/server/db/schema";

export const getCostCenters = protectedProcedure
  .input(
    z.object({
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(100).default(10),
      searchTerm: z.string().optional().default("").optional(), // Optional search term
      type: z.string().optional().default("").optional(), // Optional search term
      status: z.string().optional().default("").optional(), // Optional search term
    }),
  )
  .query(async ({ ctx, input }) => {
    const { page, limit, searchTerm, type, status } = input;
    const offset = (page - 1) * limit;
    // Apply the search condition only if searchTerm is not an empty string
    const searchCondition = searchTerm
      ? ilike(costCenter.name, `%${searchTerm}%`)
      : undefined;
    const statusCondition = status
      ? eq(costCenter.isactive, status === "Active")
      : undefined;
    const typeCondition = type ? eq(costCenter.type, type) : undefined;

    const costCenters = await ctx.db
      .select({
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
      })
      .from(costCenter)
      .where(and(searchCondition, statusCondition, typeCondition))
      .orderBy(desc(costCenter.createdAt))
      .offset(offset)
      .limit(limit);

    const totalCountResult = await db
      .select({ count: count() })
      .from(costCenter)
      .where(and(searchCondition, statusCondition, typeCondition)); // Count with filter if searchCondition is defined

    const totalCount = totalCountResult[0]?.count ?? 0;

    const updatedCostCenters = [];
    for (const center of costCenters) {
      const typeData = {
        value: center.type ?? "",
        label: center.type ?? "",
      };

      updatedCostCenters.push({
        ...center,
        typeData,
      });
    }

    return {
      costCenters: updatedCostCenters,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
    };
  });

export const getAllCostCenters = protectedProcedure.query(async ({ ctx }) => {
  const costCenters = await ctx.db
    .select({
      id: costCenter.id,
      name: costCenter.name,
    })
    .from(costCenter);

  return costCenters.map((center) => {
    return {
      value: center.id,
      label: center.name,
    };
  });
});

export const addCostCenter = protectedProcedure
  .input(
    z.object({
      name: z.string().min(1, "Name is required"),
      parentId: z.number().min(1, "Parent Id is required"),
      type: z.string().min(1, "Type is required"),
      code: z.string().min(1, "Code is required"),
      isactive: z.boolean(),
      notes: z.string().optional().nullable(),
      description: z.string().optional().nullable(),
      createdBy: z.number().min(1, "Invalid creator ID"),
      createdAt: z.string(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    try {
      // Format data for insertion
      const formattedInput = {
        ...input,
      };

      // Insert new Cost Center into the database
      const result = await ctx.db.insert(costCenter).values(formattedInput);
      return {
        success: true,
        message: "Cost Center added successfully",
        costCenter: result[0], // Return the created Cost Center record
      };
    } catch (error) {
      console.error("Error adding Cost Center:", error);
      throw new Error("Failed to add Cost Center. Please try again.");
    }
  });


  export const editCostCenter = protectedProcedure
  .input(
    z.object({
      id: z.number().min(1, "Cost Center ID is required"),
      name: z.string().optional(),
      type: z.string().optional(),
      code: z.string().optional(),
      parentId: z.number().optional(),
      isactive: z.boolean().optional(),
      updatedBy: z.number().min(1, "Invalid updater ID"),
      updatedAt: z.string(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    try {
          const { id, updatedBy, updatedAt, ...fieldsToUpdate } = input;
    
          // Check if the cost center exists
          const existingCostCenter =
            await ctx.db.query.costCenterInFinanceProject.findFirst({
              where: eq(costCenter.id, id),
            });
    
          if (!existingCostCenter) {
            throw new Error("Cost Center not found");
          }
    
          // Update Cost Center details
          const updatedCostCenter = await ctx.db
            .update(costCenter)
            .set({
              ...fieldsToUpdate,
              updatedBy,
              updatedAt,
            })
            .where(eq(costCenter.id, id))
            .returning(); // Correct usage of eq()
          // .returning("*");
    
          return {
            success: true,
            message: "Cost Center member updated successfully",
            costCenter: updatedCostCenter[0], // Return the updated cost center record
          };
        } catch (error) {
          console.error("Error updating cost center:", error);
          throw new Error("Failed to update center. Please try again.");
        }
  });

export const deleteCostCenter = protectedProcedure
  .input(
    z.object({
      id: z.number().min(1, "Cost Center ID is required"), // Cost Center ID to locate the record
    }),
  )
  .mutation(async ({ ctx, input }) => {
    try {
      const { id } = input;

      // Check if the cost Center exists
      const existingCostCenter =
        await ctx.db.query.costCenterInFinanceProject.findFirst({
          where: eq(costCenter.id, id),
        });

      if (!existingCostCenter) {
        throw new Error("Cost Center not found");
      }

      // Update staff cost center details
      const updatedCostCenter = await ctx.db
        .update(costCenter)
        .set({
          isactive: false,
        })
        .where(eq(costCenter.id, id))
        .returning(); // Correct usage of eq()
      // .returning("*");

      return {
        success: true,
        message: "Cost Center deleted successfully",
        costCenter: updatedCostCenter[0], // Return the updated cost center record
      };
    } catch (error) {
      console.error("Error deleting cost center:", error);
      throw new Error("Failed to delete cost center. Please try again.");
    }
  });