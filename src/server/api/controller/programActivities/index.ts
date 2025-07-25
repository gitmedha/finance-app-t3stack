import {
  aliasedTable,
  and,
  count,
  desc,
  eq,
  ilike,
  ne,
  or,
  sql,
} from "drizzle-orm";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  //   createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { db } from "~/server/db";
import {
  programActivitiesInFinanceProject,
  departmentMasterInFinanceProject,
  budgetMasterInFinanceProject,
  budgetDetailsInFinanceProject,
} from "~/server/db/schema";

const subDepartmentTable = aliasedTable(
  departmentMasterInFinanceProject,
  "subDepartmentTable",
);

//add program activity
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
      // Fetch budget ID from budget_master using departmentId and financialYear
      let budgetId = null;
      if (input.financialYear) {
        const budgetRecord = await ctx.db
          .select({
            id: budgetMasterInFinanceProject.id,
          })
          .from(budgetMasterInFinanceProject)
          .where(
            and(
              eq(budgetMasterInFinanceProject.departmentId, input.departmentId),
              eq(
                budgetMasterInFinanceProject.financialYear,
                input.financialYear,
              ),
            ),
          )
          .limit(1);

        if (budgetRecord.length === 0) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `No budget found for the selected department and financial year (${input.financialYear}). Please create a budget first.`,
          });
        }

        budgetId = budgetRecord[0]?.id;
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
          budgetid: budgetId,
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
      if (error instanceof TRPCError) {
        throw error;
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Failed to add program activity: ${String(error)}`,
      });
    }
  });

//get program activity based on filters
export const getProgramActivity = protectedProcedure
  .input(
    z.object({
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(100).default(10),
      searchTerm: z.string().optional().default(""),
      status: z.string().optional().default("Active"),
      financialYear: z.string().optional().default(""),
      departmentId: z.number().optional(),
      subDepartmentId: z.number().optional(),
    }),
  )
  .query(async ({ ctx, input }) => {
    console.log("🚀 input:", input);
    const {
      page,
      limit,
      searchTerm,
      status,
      financialYear,
      departmentId,
      subDepartmentId,
    } = input;
    const offset = (page - 1) * limit;

    // Build filters
    const filters = [];
    if (searchTerm) {
      filters.push(
        ilike(programActivitiesInFinanceProject.name, `%${searchTerm}%`),
      );
    }
    if (status === "Active" || status === "Inactive") {
      filters.push(
        eq(programActivitiesInFinanceProject.isActive, status === "Active"),
      );
    }
    if (financialYear) {
      filters.push(
        eq(programActivitiesInFinanceProject.financialYear, financialYear),
      );
    }
    if (departmentId) {
      filters.push(
        eq(programActivitiesInFinanceProject.departmentId, departmentId),
      );
    }
    if (subDepartmentId) {
      filters.push(
        eq(programActivitiesInFinanceProject.subDepartmentId, subDepartmentId),
      );
    }

    // Alias for the second join on the same department table

    // Fetch rows with LEFT JOINs
    const rows = await ctx.db
      .select({
        id: programActivitiesInFinanceProject.id,
        name: programActivitiesInFinanceProject.name,
        description: programActivitiesInFinanceProject.description,
        departmentId: programActivitiesInFinanceProject.departmentId,
        subDepartmentId: programActivitiesInFinanceProject.subDepartmentId,
        departmentName: departmentMasterInFinanceProject.departmentname,
        subDepartmentName: subDepartmentTable.departmentname,
        budgetYear: budgetMasterInFinanceProject.financialYear,
        financialYear: programActivitiesInFinanceProject.financialYear,
        isActive: programActivitiesInFinanceProject.isActive,
        createdAt: programActivitiesInFinanceProject.createdAt,
        updatedAt: programActivitiesInFinanceProject.updatedAt,
      })
      .from(programActivitiesInFinanceProject)
      .leftJoin(
        departmentMasterInFinanceProject,
        eq(
          departmentMasterInFinanceProject.id,
          programActivitiesInFinanceProject.departmentId,
        ),
      )
      .leftJoin(
        subDepartmentTable,
        eq(
          subDepartmentTable.id,
          programActivitiesInFinanceProject.subDepartmentId,
        ),
      )
      .leftJoin(
        budgetMasterInFinanceProject,
        eq(
          budgetMasterInFinanceProject.id,
          programActivitiesInFinanceProject.budgetid,
        ),
      )
      .where(filters.length ? and(...filters) : undefined)
      .orderBy(desc(programActivitiesInFinanceProject.createdAt))
      .offset(offset)
      .limit(limit);

    // Get total count
    const result = await ctx.db
      .select({ count: count() })
      .from(programActivitiesInFinanceProject)
      .where(filters.length ? and(...filters) : undefined);

    const totalCount = result[0]?.count ?? 0;

    // Map into richer objects
    const activities = rows.map((r) => ({
      ...r,
      departmentData: { value: r.departmentId, label: r.departmentName },
      subDepartmentData: r.subDepartmentId ? { value: r.subDepartmentId, label: r.subDepartmentName } : null,
      budgetData: { value: r.id, label: r.budgetYear },
    }));
    return {
      activities,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
    };
  });

//get all program activities
export const getAllProgramActivities = protectedProcedure.query(
  async ({ ctx }) => {
    // Pull every column (or pick the ones you need) from your table
    const activities = await ctx.db
      .select({
        id: programActivitiesInFinanceProject.id,
        name: programActivitiesInFinanceProject.name,
      })
      .from(programActivitiesInFinanceProject);

    // Return as-is (or wrap in a success envelope)
    return activities?.map((activity) => {
      return {
        value: activity.id,
        label: activity.name,
      };
    });
  },
);
//update program activity
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
      
      // Fetch budget ID from budget_master using departmentId and financialYear
      let budgetId = null;
      if (input.financialYear) {
        const budgetRecord = await ctx.db
          .select({
            id: budgetMasterInFinanceProject.id,
          })
          .from(budgetMasterInFinanceProject)
          .where(
            and(
              eq(budgetMasterInFinanceProject.departmentId, input.departmentId),
              eq(
                budgetMasterInFinanceProject.financialYear,
                input.financialYear,
              ),
            ),
          )
          .limit(1);

        if (budgetRecord.length === 0) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `No budget found for the selected department and financial year (${input.financialYear}). Please create a budget first.`,
          });
        }

        budgetId = budgetRecord[0]?.id;
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
          budgetid: budgetId,
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
        message: `Failed to update program activity: ${String(error)}`,
      });
    }
  });
//delete program activity
export const deleteProgramActivity = protectedProcedure
  .input(
    z.object({
      id: z.number().min(1, "Activity ID is required"),
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

      // Delete the program activity
      const deleted = await ctx.db
        .update(programActivitiesInFinanceProject)
        .set({
          isActive: false,
          updatedBy: input.updatedBy,
          updatedAt: input.updatedAt,
        })
        .where(eq(programActivitiesInFinanceProject.id, input.id))
        .returning();

      // Also deactivate associated budget details
      await ctx.db
        .update(budgetDetailsInFinanceProject)
        .set({
          isactive: false,
          updatedBy: input.updatedBy,
          updatedAt: input.updatedAt,
        })
        .where(eq(budgetDetailsInFinanceProject.activity, String(input.id)));

      return {
        success: true,
        message: "Program activity deleted successfully",
        activity: deleted[0],
      };
    } catch (error) {
      console.error("Error deleting program activity:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Failed to delete program activity: ${String(error)}`,
      });
    }
  });

//reactivate program activity
export const reactivateProgramActivity = protectedProcedure
  .input(
    z.object({
      id: z.number().min(1, "Activity ID is required"),
      updatedBy: z.number().min(1, "Invalid updater ID"),
      updatedAt: z.string(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    try {
      // Check if the activity exists
      const activityPresent = await ctx.db
        .select()
        .from(programActivitiesInFinanceProject)
        .where(eq(programActivitiesInFinanceProject.id, input.id));

      if (activityPresent.length < 1) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Program activity not found",
        });
      }

      // Reactivate the activity
      const activatedActivity = await ctx.db
        .update(programActivitiesInFinanceProject)
        .set({
          isActive: true,
          updatedAt: input.updatedAt,
          updatedBy: input.updatedBy,
        })
        .where(eq(programActivitiesInFinanceProject.id, input.id))
        .returning();

      if (!activatedActivity || activatedActivity.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Error while updating the program activity",
        });
      }

      // Reactivate all related budget details
      await ctx.db
        .update(budgetDetailsInFinanceProject)
        .set({ isactive: true })
        .where(eq(budgetDetailsInFinanceProject.activity, String(input.id)));

      return {
        success: true,
        message: "Program activity reactivated successfully",
        activity: activatedActivity[0],
      };
    } catch (error) {
      console.error("Error reactivating program activity:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Failed to reactivate program activity: ${String(error)}`,
      });
    }
  });
//get program activity by id
export const getProgramActivityById = protectedProcedure
  .input(
    z.object({
      id: z.number().min(1, "Program Activity ID is required"),
    }),
  )
  .query(async ({ ctx, input }) => {
    try {
      // Fetch the program activity with all related data
      const result = await ctx.db
        .select({
          id: programActivitiesInFinanceProject.id,
          name: programActivitiesInFinanceProject.name,
          description: programActivitiesInFinanceProject.description,
          departmentId: programActivitiesInFinanceProject.departmentId,
          subDepartmentId: programActivitiesInFinanceProject.subDepartmentId,
          departmentName: departmentMasterInFinanceProject.departmentname,
          subDepartmentName: subDepartmentTable.departmentname,
          budgetId: programActivitiesInFinanceProject.budgetid,
          budgetYear: budgetMasterInFinanceProject.financialYear,
          financialYear: programActivitiesInFinanceProject.financialYear,
          isActive: programActivitiesInFinanceProject.isActive,
          createdAt: programActivitiesInFinanceProject.createdAt,
          createdBy: programActivitiesInFinanceProject.createdBy,
          updatedAt: programActivitiesInFinanceProject.updatedAt,
          updatedBy: programActivitiesInFinanceProject.updatedBy,
        })
        .from(programActivitiesInFinanceProject)
        .leftJoin(
          departmentMasterInFinanceProject,
          eq(
            departmentMasterInFinanceProject.id,
            programActivitiesInFinanceProject.departmentId,
          ),
        )
        .leftJoin(
          subDepartmentTable,
          eq(
            subDepartmentTable.id,
            programActivitiesInFinanceProject.subDepartmentId,
          ),
        )
        .leftJoin(
          budgetMasterInFinanceProject,
          eq(
            budgetMasterInFinanceProject.id,
            programActivitiesInFinanceProject.budgetid,
          ),
        )
        .where(eq(programActivitiesInFinanceProject.id, input.id))
        .limit(1);

      if (result.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Program activity not found",
        });
      }

      // Format the data with formatted fields
      const activity = {
        ...result[0],
        departmentData: {
          value: result[0]?.departmentId ?? null,
          label: result[0]?.departmentName ?? null,
        },
        subDepartmentData: {
          value: result[0]?.subDepartmentId ?? null,
          label: result[0]?.subDepartmentName ?? null,
        },
        budgetData: {
          value: result[0]?.budgetId ?? null,
          label: result[0]?.budgetYear ?? null,
        },
      };

      return {
        success: true,
        activity,
      };
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }

      console.error("Error fetching program activity:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Failed to fetch program activity: ${String(error)}`,
      });
    }
  });

//get program activities by department
export const getProgramActivitiesByDepartment = protectedProcedure
  .input(
    z.object({
      departmentId: z.number(), // Remove min(1) to allow 0 for super admin
      subDepartmentId: z.number().optional(),
      budgetid: z.number().optional(),
      financialYear: z.string().optional(),
    }),
  )
  .query(async ({ ctx, input }) => {
    try {
      // Build filters
      const filters = [];

      // Only add department filter if departmentId > 0 (for super admin case)
      if (input.departmentId > 0) {
        filters.push(
          eq(
            programActivitiesInFinanceProject.departmentId,
            input.departmentId,
          ),
        );
      }

      // Add sub-department filter if provided
      if (input.subDepartmentId) {
        filters.push(
          eq(
            programActivitiesInFinanceProject.subDepartmentId,
            input.subDepartmentId,
          ),
        );
      }
      if (input.financialYear) {
        filters.push(
          eq(programActivitiesInFinanceProject.financialYear, input.financialYear),
        );
      }
      // Add budget filter if provided
      if (input.budgetid) {
        filters.push(
          eq(programActivitiesInFinanceProject.budgetid, input.budgetid),
        );
      }

      // Only get active program activities
      filters.push(eq(programActivitiesInFinanceProject.isActive, true));

      // Fetch filtered program activities
      const activities = await ctx.db
        .select({
          id: programActivitiesInFinanceProject.id,
          name: programActivitiesInFinanceProject.name,
        })
        .from(programActivitiesInFinanceProject)
        .where(filters.length > 0 ? and(...filters) : undefined)
        .orderBy(programActivitiesInFinanceProject.name);
      console.log(activities, "activities");
      // Return value/label pairs for dropdown selection
      return activities.map((activity) => ({
        value: activity.id,
        label: activity.name,
      }));
    } catch (error) {
      console.error("Error fetching program activities by department:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Failed to fetch program activities: ${String(error)}`,
      });
    }
  });
