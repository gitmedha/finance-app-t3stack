import { TRPCError } from "@trpc/server";
import {
  and,
  count,
  desc,
  eq,
  ilike,
  aliasedTable,
  or,
  sql,
  ne,
  notInArray,
} from "drizzle-orm";
import { z } from "zod";
import {
  //   createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { db } from "~/server/db";
import {
  departmentMasterInFinanceProject as departmentMaster,
  staffMasterInFinanceProject as staffMaster,
  // statesMasterInFinanceProject as stateMaster,
  // locationMasterInFinanceProject as locationMaster,
  salaryDetailsInFinanceProject as salaryMaster,
  categoryHierarchyInFinanceProject,
  categoryMasterInFinanceProject,
} from "~/server/db/schema";

const subDepartmentTable = aliasedTable(departmentMaster, "subDepartmentTable");
export const getStaffs = protectedProcedure
  .input(
    z.object({
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(100).default(10),
      searchTerm: z.string().optional().default(""),
      department: z.number().optional().default(0),
      status: z.string().optional().default("Active"),
      level: z.number().optional().default(0),
      subdepartment: z.number().optional().default(0),
    }),
  )
  .query(async ({ ctx, input }) => {
    const {
      page,
      limit,
      searchTerm,
      status,
      department,
      level,
      subdepartment,
    } = input;
    const offset = (page - 1) * limit;
    // Apply the search condition only if searchTerm is not an empty string
    const searchCondition = searchTerm
      ? ilike(staffMaster.name, `%${searchTerm}%`)
      : undefined;
    const departmentCondition =
      department === 0 ? undefined : eq(staffMaster.department, department);
    const subdepartmentCondition =
      subdepartment == 0 ? undefined : eq(staffMaster.subDeptid, subdepartment);
    const statusCondition = status
      ? eq(staffMaster.isactive, status === "Active")
      : undefined;
    const levelCondition =
      level === 0 ? undefined : eq(staffMaster.level, level);

    const staffs = await ctx.db
      .select({
        id: staffMaster.id,
        name: staffMaster.name,
        empNo: staffMaster.empNo,
        email: staffMaster.email,
        dateOfJoining: staffMaster.dateOfJoining,
        level: staffMaster.level,
        levelName: categoryMasterInFinanceProject.categoryname,
        isactive: staffMaster.isactive,
        notes: staffMaster.notes,
        nature_of_employment: staffMaster.natureOfEmployment,
        description: staffMaster.description,
        createdAt: staffMaster.createdAt,
        updatedAt: staffMaster.updatedAt,
        createdBy: staffMaster.createdBy,
        updatedBy: staffMaster.updatedBy,
        department: staffMaster.department,
        departmentname: departmentMaster.departmentname,
        state: staffMaster.stateId,
        stateId: staffMaster.stateId,
        location: staffMaster.locationId,
        locationId: staffMaster.locationId,
        designation: staffMaster.designation,
        project: staffMaster.project,
        salaryDetailsId: salaryMaster.id,
        salary: salaryMaster.salary,
        insurance: salaryMaster.insurance,
        bonus: salaryMaster.bonus,
        gratuity: salaryMaster.gratuity,
        epf: salaryMaster.epf,
        pgwPld: salaryMaster.pgwPld,
        subDeptid: staffMaster.subDeptid,
        subDeptName: subDepartmentTable.departmentname,
        hired: staffMaster.hired,
      })
      .from(staffMaster)
      .leftJoin(
        departmentMaster,
        and(
          eq(departmentMaster.isactive, true),
          eq(departmentMaster.id, staffMaster.department),
        ),
      )
      .leftJoin(
        subDepartmentTable, // Joining again for sub-department
        and(
          eq(subDepartmentTable.id, staffMaster.subDeptid),
          eq(subDepartmentTable.isactive, true),
        ),
      )
      .leftJoin(
        categoryMasterInFinanceProject,
        and(eq(categoryMasterInFinanceProject.id, staffMaster.level)),
      )
      .leftJoin(salaryMaster, and(eq(salaryMaster.empId, staffMaster.id)))
      .where(
        and(
          searchCondition,
          departmentCondition,
          statusCondition,
          levelCondition,
          subdepartmentCondition,
        ),
      )
      .orderBy(desc(staffMaster.createdAt))
      .offset(offset)
      .limit(limit);

    // Get the total count of records with the same condition
    const totalCountResult = await db
      .select({ count: count() })
      .from(staffMaster)
      .where(
        and(
          searchCondition,
          departmentCondition,
          subdepartmentCondition,
          statusCondition,
          levelCondition,
        ),
      );

    const totalCount = totalCountResult[0]?.count ?? 0;

    const updatedStaffs: Array<
      (typeof staffs)[0] & {
        statesData: { value: string | null; label: string | null };
        locationData: { value: string | null; label: string | null };
        departmentData: { value: number | null; label: string | null };
        levelData: { value: number | null; label: string | null };
        subDeptData: { value: number | null; label: string | null };
      }
    > = [];

    for (const staff of staffs) {
      const statesData = {
        value: staff.stateId,
        label: staff.state,
      };

      const locationData = {
        value: staff.locationId,
        label: staff.location,
      };

      const departmentData = {
        value: staff.department,
        label: staff.departmentname,
      };
      const subDeptData = {
        value: staff.subDeptid,
        label: staff.subDeptName,
      };
      const levelData = {
        value: staff.level,
        label: staff.levelName,
      };

      updatedStaffs.push({
        ...staff,
        statesData,
        locationData,
        departmentData,
        levelData,
        subDeptData,
      });
    }
    return {
      staffs: updatedStaffs,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
    };
  });

export const addStaff = protectedProcedure
  .input(
    z.object({
      name: z.string().min(1, "Name is required"),
      empNo: z.string().min(1, "Employee number is required"),
      stateId: z.string().min(1, "State is required"),
      locationId: z.string().min(1, "Location is required"),
      departmentId: z.number().min(1, "Department is required"),
      designation: z.string().min(1, "Designation is required"),
      isactive: z.boolean(),
      email: z.string().email(),
      level: z.number(),
      project: z.string().optional(),
      natureOfEmployment: z.string().optional(),
      notes: z.string().optional().nullable(),
      description: z.string().optional().nullable(),
      createdBy: z.number().min(1, "Invalid creator ID"),
      createdAt: z.string(),
      subDeptId: z.number().optional().nullable(),
      dateOfJoining: z.string().optional().nullable(),
      dateOfResigning: z.string().optional().nullable(),
      hired: z.string().optional().nullable(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const existing = await ctx.db
      .select()
      .from(staffMaster)
      .where(
        or(
          eq(sql`LOWER(${staffMaster.empNo})`, input.empNo.toLowerCase()),
          eq(sql`LOWER(${staffMaster.email})`, input.email.toLowerCase()),
        ),
      );
    // Format data for insertion
    if (existing?.length > 0) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Employee ID or Employee Email already Present",
      });
    }
    try {
      const formattedInput = {
        ...input,
        department: input.departmentId,
        subDeptid: input.subDeptId,
        hired: input.hired,
      };

      // Insert new staff member into the database
      const result = await ctx.db
        .insert(staffMaster)
        .values(formattedInput)
        .returning({
          id: staffMaster.id,
        });
      return {
        success: true,
        message: "Staff member added successfully",
        staff: result[0], // Return the created staff record
      };
    } catch (error) {
      console.error("Error adding staff:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Failed to add staff: ${String(error)}`,
      });
    }
  });

export const editStaff = protectedProcedure
  .input(
    z.object({
      id: z.number().min(1, "Staff ID is required"),
      name: z.string().optional(),
      empNo: z.string().optional(),
      stateId: z.string().optional(),
      locationId: z.string().optional(),
      department: z.number().optional(),
      designation: z.string().optional(),
      isactive: z.boolean().optional(),
      natureOfEmployment: z.string().optional(),
      notes: z.string().optional().nullable(),
      description: z.string().optional().nullable(),
      level: z.number().optional(),
      project: z.string().optional(),
      email: z.string().email().optional(),
      dateOfJoining: z.string().optional().nullable(),
      hired: z.string().optional(),
      updatedBy: z.number().min(1, "Invalid updater ID"),
      updatedAt: z.string(),
      subDeptid: z.number().optional().nullable(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    try {
      console.log(input, "edit input");
      const {
        id,
        updatedBy,
        updatedAt,
        natureOfEmployment,
        ...fieldsToUpdate
      } = input;
      // Check if the staff member exists
      const existingStaff =
        await ctx.db.query.staffMasterInFinanceProject.findFirst({
          where: eq(staffMaster.id, id),
        });

      if (!existingStaff) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Employee not present",
        });
      }

      // Update staff member details
      const updatedStaff = await ctx.db
        .update(staffMaster)
        .set({
          ...fieldsToUpdate,
          natureOfEmployment: natureOfEmployment,
          updatedBy,
          updatedAt,
        })
        .where(eq(staffMaster.id, id))
        .returning();
      console.log(updatedStaff, "updatedStaff");
      return {
        success: true,
        message: "Staff member updated successfully",
        staff: updatedStaff[0],
      };
    } catch (error) {
      console.error("Error updating staff:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        message: `Failed to edit staff: ${error}`,
      });
    }
  });

export const getDesignation = protectedProcedure.query(async ({ ctx }) => {
  const designations = await ctx.db
    .select({
      designation: staffMaster.designation,
    })
    .from(staffMaster)
    .groupBy(staffMaster.designation); // Group by type to get unique values

  return {
    designations,
  };
});

export const deleteStaff = protectedProcedure
  .input(
    z.object({
      id: z.number().min(1, "Staff ID is required"),
      updatedAt: z.string(),
      updatedBy: z.number().min(1, "Invalid updater ID"), // Staff ID to locate the record
    }),
  )
  .mutation(async ({ ctx, input }) => {
    try {
      const { id } = input;

      // Check if the staff member exists
      const existingStaff =
        await ctx.db.query.staffMasterInFinanceProject.findFirst({
          where: eq(staffMaster.id, id),
        });

      if (!existingStaff) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Staff member not found",
        });
      }

      // Update staff member details
      const updatedStaff = await ctx.db
        .update(staffMaster)
        .set({
          isactive: false,
          dateOfResigning: new Date().toISOString().split("T")[0],
        })
        .where(eq(staffMaster.id, id))
        .returning();

      // Also update salary details to set isactive to false
      await ctx.db
        .update(salaryMaster)
        .set({
          isactive: false,
        })
        .where(eq(salaryMaster.empId, id));

      return {
        success: true,
        message:
          "Staff member and associated salary details deleted successfully",
        staff: updatedStaff[0], // Return the updated staff record
      };
    } catch (error) {
      console.error("Error deleting staff:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        message: `Failed to delete staff: ${error}`,
      });
    }
  });

export const getLevels = protectedProcedure.query(async ({ ctx }) => {
  const subCategories = await ctx.db
    .select({
      subCategoryId: categoryHierarchyInFinanceProject.catId,
      subCategoryName: categoryMasterInFinanceProject.categoryname,
    })
    .from(categoryHierarchyInFinanceProject)
    .innerJoin(
      categoryMasterInFinanceProject,
      eq(
        categoryHierarchyInFinanceProject.catId,
        categoryMasterInFinanceProject.id,
      ),
    )
    .where(
      and(
        eq(categoryHierarchyInFinanceProject.parentId, 1),
        ne(categoryMasterInFinanceProject.id, 76)
      )
    );
  const levelsData = subCategories.map((subcategory) => ({
    value: subcategory.subCategoryId,
    label: subcategory.subCategoryName,
  }));

  return levelsData.length > 0 ? levelsData : undefined;
});

export const activateStaff = protectedProcedure
  .input(
    z.object({
      id: z.number().min(1, "Staff ID is required"),
      updatedAt: z.string(),
      updatedBy: z.number().min(1, "Invalid updater ID"), // Staff ID to locate the record
    }),
  )
  .mutation(async ({ ctx, input }) => {
    try {
      const { id } = input;

      // Check if the staff member exists
      const existingStaff =
        await ctx.db.query.staffMasterInFinanceProject.findFirst({
          where: eq(staffMaster.id, id),
        });

      if (!existingStaff) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Staff member not found",
        });
      }

      // Update staff member details
      const updatedStaff = await ctx.db
        .update(staffMaster)
        .set({
          isactive: true,
          updatedAt: input.updatedAt,
          updatedBy: input.updatedBy,
        })
        .where(eq(staffMaster.id, id))
        .returning();

      // Also update salary details to set isactive to true
      await ctx.db
        .update(salaryMaster)
        .set({
          isactive: true,
        })
        .where(eq(salaryMaster.empId, id));

      return {
        success: true,
        message:
          "Staff member and associated salary details activated successfully",
        staff: updatedStaff[0], // Return the updated staff record
      };
    } catch (error) {
      console.error("Error activating staff:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        message: `Failed to activating staff: ${error}`,
      });
    }
  });

export const getStaffLevels = protectedProcedure.query(async ({ ctx }) => {
  const levels = await ctx.db
    .select({
      level: staffMaster.level,
      categoryname: categoryMasterInFinanceProject.categoryname,
    })
    .from(staffMaster)
    .innerJoin(
      categoryMasterInFinanceProject,
      eq(staffMaster.level, categoryMasterInFinanceProject.id),
    )
    .groupBy(staffMaster.level, categoryMasterInFinanceProject.categoryname); // Group by level to get unique values

  console.log(levels, "levels");
  // Format the results to match the expected structure
  const formattedLevels = levels.map((level) => ({
    value: level.level,
    label: level.categoryname,
  }));

  // Create a mapping of Roman numerals to their numeric values for sorting
  const romanOrder: Record<string, number> = {
    I: 1,
    II: 2,
    III: 3,
    IV: 4,
    V: 5,
    VI: 6,
    VII: 7,
    VIII: 8,
    IX: 9,
    X: 10,
  };

  // Sort the levels based on Roman numeral order
  const sortedLevels = formattedLevels.sort((a, b) => {
    const orderA = romanOrder[a.label] ?? 999;
    const orderB = romanOrder[b.label] ?? 999;
    return orderA - orderB;
  });

  return {
    levels: sortedLevels,
  };
});
