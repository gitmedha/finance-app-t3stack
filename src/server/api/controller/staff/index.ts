import { and, count, desc, eq, ilike } from "drizzle-orm";
import { z } from "zod";
import {
  //   createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { db } from "~/server/db";
import {
  departmentMasterInFinanceProject as departmentMaster,
  staffMasterInFinanceProject as staffMaster,
  statesMasterInFinanceProject as stateMaster,
  locationMasterInFinanceProject as locationMaster,
  salaryDetailsInFinanceProject as salaryMaster,
} from "~/server/db/schema";

export const getStaffs = protectedProcedure
  .input(
    z.object({
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(100).default(10),
      searchTerm: z.string().optional().default(""), 
      department: z.number().optional().default(0), 
      status: z.string().optional().default("Active"), 
      designation: z.string().optional().default(""), 
    }),
  )
  .query(async ({ ctx, input }) => {
    const { page, limit, searchTerm, status, department, designation } = input;
    const offset = (page - 1) * limit;
    // Apply the search condition only if searchTerm is not an empty string
    const searchCondition = searchTerm
      ? ilike(staffMaster.name, `%${searchTerm}%`)
      : undefined;
    const departmentCondition =
      department === 0 ? undefined : eq(staffMaster.department, department);
    const statusCondition = eq(staffMaster.isactive, status === "Active");
    const designationCondition = designation
      ? eq(staffMaster.designation, designation)
      : undefined;

    const staffs = await ctx.db
      .select({
        id: staffMaster.id,
        name: staffMaster.name,
        empNo: staffMaster.empNo,
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
        state: stateMaster.name,
        stateId: stateMaster.id,
        location: locationMaster.cityName,
        locationId: locationMaster.id,
        designation: staffMaster.designation,
        salaryDetailsId: salaryMaster.id,
        salary: salaryMaster.salary,
        insurance: salaryMaster.insurance,
        bonus: salaryMaster.bonus,
        gratuity: salaryMaster.gratuity,
        epf: salaryMaster.epf,
        pgwPld: salaryMaster.pgwPld,
        // count: count()
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
        stateMaster,
        and(
          // eq(stateMaster.is, true),
          eq(stateMaster.id, staffMaster.stateId),
        ),
      )
      .leftJoin(
        locationMaster,
        and(
          // eq(stateMaster.is, true),
          eq(locationMaster.id, staffMaster.locationId),
        ),
      )
      .leftJoin(salaryMaster, and(eq(salaryMaster.empId, staffMaster.id)))
      .where(
        and(
          searchCondition,
          departmentCondition,
          statusCondition,
          designationCondition,
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
          statusCondition,
          designationCondition,
        ),
      );

    const totalCount = totalCountResult[0]?.count ?? 0;

    const updatedStaffs = [];

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

      updatedStaffs.push({
        ...staff,
        statesData,
        locationData,
        departmentData,
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
      stateId: z.number().min(1, "State is required"),
      locationId: z.number().min(1, "Location is required"),
      departmentId: z.number().min(1, "Department is required"),
      designation: z.string().min(1, "Designation is required"),
      isactive: z.boolean(),
      natureOfEmployment: z.string().optional(),
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
        department: input.departmentId
        // id: undefined, // Ensure ID is not manually set
        // state: undefined, // Ensure no conflicting state field
        // location: undefined, // Ensure no conflicting location field
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
      throw new Error("Failed to add staff. Please try again.");
    }
  });

export const editStaff = protectedProcedure
  .input(
    z.object({
      id: z.number().min(1, "Staff ID is required"), // Staff ID to locate the record
      name: z.string().optional(),
      empNo: z.string().optional(),
      stateId: z.number().optional(),
      locationId: z.number().optional(),
      department: z.number().optional(),
      designation: z.string().optional(),
      isactive: z.boolean().optional(),
      natureOfEmployment: z.string().optional(),
      notes: z.string().optional().nullable(),
      description: z.string().optional().nullable(),
      updatedBy: z.number().min(1, "Invalid updater ID"),
      updatedAt: z.string(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    try {
      const { id, updatedBy, updatedAt, ...fieldsToUpdate } = input;

      // Check if the staff member exists
      const existingStaff =
        await ctx.db.query.staffMasterInFinanceProject.findFirst({
          where: eq(staffMaster.id, id),
        });

      if (!existingStaff) {
        throw new Error("Staff member not found");
      }

      // Update staff member details
      const updatedStaff = await ctx.db
        .update(staffMaster)
        .set({
          ...fieldsToUpdate,
          updatedBy,
          updatedAt,
        })
        .where(eq(staffMaster.id, id))
        .returning({
          id: staffMaster.id,
        });

      return {
        success: true,
        message: "Staff member updated successfully",
        staff: updatedStaff[0], // Return the updated staff record
      };
    } catch (error) {
      console.error("Error updating staff:", error);
      throw new Error("Failed to update staff. Please try again.");
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
      id: z.number().min(1, "Staff ID is required"), // Staff ID to locate the record
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
        throw new Error("Staff member not found");
      }

      // Update staff member details
      const updatedStaff = await ctx.db
        .update(staffMaster)
        .set({
          isactive: false,
        })
        .where(eq(staffMaster.id, id))
        .returning(); // Correct usage of eq()
      // .returning("*");

      return {
        success: true,
        message: "Staff member deleted successfully",
        staff: updatedStaff[0], // Return the updated staff record
      };
    } catch (error) {
      console.error("Error deleting staff:", error);
      throw new Error("Failed to delete staff. Please try again.");
    }
  });
