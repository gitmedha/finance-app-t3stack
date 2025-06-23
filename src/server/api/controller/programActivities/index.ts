import { and, count, desc, eq, ilike, ne, or, sql } from "drizzle-orm";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  //   createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { db } from "~/server/db";
import { programActivitiesInFinanceProject } from "../../../db/schema";

export const addProgramActivities = protectedProcedure
  .input(
    z.object({
      name: z.string().min(1, "Activity name is required"),
      description: z.string().optional().nullable(),
      departmentId: z.number().min(1, "Department ID is required"),
      subDepartmentId: z.number().optional().nullable(),
      financialYear: z.string().optional(),
      isActive: z.boolean().default(true),
      createdBy: z.number().min(1, "Invalid creator ID"),
      createdAt: z.string(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    try {
      // Check if the activity name already exists
      const rawName = input.name;
      const normalizedIn = rawName.toLowerCase().replace(/\s+/g, "");

      const existingActivity = await ctx.db
        .select()
        .from(programActivitiesInFinanceProject)
        .where(
          sql`REPLACE(LOWER(${programActivitiesInFinanceProject.name}), ' ', '') = ${normalizedIn}`,
        )
        .limit(1);

      if (existingActivity.length > 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Program activity with this name already exists",
        });
      }

      // Insert new program activity into the database
      const result = await ctx.db
        .insert(programActivitiesInFinanceProject)
        .values({
          name: input.name,
          description: input.description,
          departmentId: input.departmentId,
          subDepartmentId: input.subDepartmentId,
          financialYear: input.financialYear,
          isActive: input.isActive,
          createdBy: input.createdBy,
          createdAt: input.createdAt,
        })
        .returning();

      return {
        success: true,
        message: "Program activity added successfully",
        activity: result[0],
      };
    } catch (error) {
      console.error("Error adding program activity:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Failed to add program activity: ${error}`,
      });
    }
  });

export const getProgramActivity = protectedProcedure
  .input(
    z
      .object({
        isActive: z.boolean().optional(),
        departmentId: z.number().optional(),
        subDepartmentId: z.number().optional(),
        page: z.number().min(1).default(1),
      limit: z.number().min(1).max(100).default(10),
      searchTerm: z.string().optional().default(""), // Optional search term
      status: z.string().optional().default("Active"), // Optional search term
      type: z.string().optional().default(""),
      financialYear: z.string().optional(),
      })
      .optional(),
  )
  .query(async ({ ctx, input }) => {
    try {
      const filters = [];

      if (input?.isActive !== undefined) {
        filters.push(
          eq(programActivitiesInFinanceProject.isActive, input.isActive),
        );
      }

      if (input?.departmentId) {
        filters.push(
          eq(
            programActivitiesInFinanceProject.departmentId,
            input.departmentId,
          ),
        );
      }

      if (input?.subDepartmentId) {
        filters.push(
          eq(
            programActivitiesInFinanceProject.subDepartmentId,
            input.subDepartmentId,
          ),
        );
      }

      const activities = await ctx.db
        .select()
        .from(programActivitiesInFinanceProject)
        .where(filters.length > 0 ? and(...filters) : undefined);

      return {
        success: true,
        count: activities.length,
        activities,
      };
    } catch (error) {
      console.error("Error fetching program activities:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Failed to fetch program activities: ${error}`,
      });
    }
  });

  export const getAllProgramActivities = protectedProcedure
  .query(async ({ ctx }) => {
    
    // Pull every column (or pick the ones you need) from your table
    const activities = await ctx.db
      .select({
        id:               programActivitiesInFinanceProject.id,
        name:             programActivitiesInFinanceProject.name
      })
      .from(programActivitiesInFinanceProject);

    // Return as-is (or wrap in a success envelope)
    return activities?.map((activity) => {
        return {
          value: activity.id,
          label: activity.name,
        };
      });
  });

export const updateProgramActivity = protectedProcedure
  .input(
    z.object({
      id: z.number().min(1, "Activity ID is required"),
      name: z.string().min(1, "Activity name is required"),
      description: z.string().optional().nullable(),
      departmentId: z.number().min(1, "Department ID is required"),
      subDepartmentId: z.number().optional().nullable(),
      financialYear: z.string().optional(),
      isActive: z.boolean().optional(),
      updatedBy: z.number().min(1, "Invalid updater ID"),
      updatedAt: z.string(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    try {
      // Check if activity exists
      const existingActivity = await ctx.db
        .select()
        .from(programActivitiesInFinanceProject)
        .where(eq(programActivitiesInFinanceProject.id, input.id))
        .limit(1);

      if (existingActivity.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Program activity not found",
        });
      }

      // Check if the new name conflicts with an existing activity (excluding the current one)
      const nameConflict = await ctx.db
        .select()
        .from(programActivitiesInFinanceProject)
        .where(
          and(
            eq(programActivitiesInFinanceProject.name, input.name),
            ne(programActivitiesInFinanceProject.id, input.id),
          ),
        )
        .limit(1);

      if (nameConflict.length > 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Another program activity with this name already exists",
        });
      }

      // Update the program activity
      const result = await ctx.db
        .update(programActivitiesInFinanceProject)
        .set({
          name: input.name,
          description: input.description,
          departmentId: input.departmentId,
          subDepartmentId: input.subDepartmentId,
          financialYear: input.financialYear,
          isActive: input.isActive,
          updatedBy: input.updatedBy,
          updatedAt: input.updatedAt,
        })
        .where(eq(programActivitiesInFinanceProject.id, input.id))
        .returning();

      return {
        success: true,
        message: "Program activity updated successfully",
        activity: result[0],
      };
    } catch (error) {
      console.error("Error updating program activity:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Failed to update program activity: ${error}`,
      });
    }
  });

export const deleteProgramActivity = protectedProcedure
  .input(z.object({ id: z.number().min(1, "Activity ID is required"),
    updatedBy: z.number().min(1, "Invalid updater ID"),
    updatedAt: z.string(),
  }))
  .mutation(async ({ ctx, input }) => {
    try {
      // Check if activity exists
      const existingActivity = await ctx.db
        .select()
        .from(programActivitiesInFinanceProject)
        .where(eq(programActivitiesInFinanceProject.id, input.id))
        .limit(1);

      if (existingActivity.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Program activity not found",
        });
      }

      // Delete the program activity
      const deleted = await ctx.db
      .update(programActivitiesInFinanceProject)
      .set({
        isActive: false,
        updatedBy: input.updatedBy,
        updatedAt: input.updatedAt
      })
        .where(eq(programActivitiesInFinanceProject.id, input.id))
        .returning();

      return {
        success: true,
        message: "Program activity deleted successfully",
        activity: deleted[0],
      };
    } catch (error) {
      console.error("Error deleting program activity:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Failed to delete program activity: ${error}`,
      });
    }
  });

  export const reactivateProgramActivity = protectedProcedure
  .input(
    z.object({
      id: z.number().min(1, "Activity ID is required"),
      updatedBy: z.number().min(1, "Invalid updater ID"),
      updatedAt: z.string(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    try {
      // Check if the activity exists
      const activityPresent = await ctx.db.select()
        .from(programActivitiesInFinanceProject)
        .where(eq(programActivitiesInFinanceProject.id, input.id));
      
      if (activityPresent.length < 1) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Program activity not found"
        });
      }
      
      // Reactivate the activity
      const activatedActivity = await ctx.db.update(programActivitiesInFinanceProject)
        .set({
          isActive: true,
          updatedAt: input.updatedAt,
          updatedBy: input.updatedBy
        })
        .where(eq(programActivitiesInFinanceProject.id, input.id))
        .returning();
      
      if (!activatedActivity || activatedActivity.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Error while updating the program activity"
        });
      }

      return {
        success: true,
        message: "Program activity reactivated successfully",
        activity: activatedActivity[0]
      };
    } catch (error) {
      console.error("Error reactivating program activity:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Failed to reactivate program activity: ${error}`,
      });
    }
  });
