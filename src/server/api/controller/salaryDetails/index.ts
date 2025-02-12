import {  eq } from "drizzle-orm";
import { z } from "zod";
import {
  //   createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import {
  salaryDetailsInFinanceProject as salaryMaster,
} from "~/server/db/schema";

export const getStaffSalaryDetails = protectedProcedure
  .input(
    z.object({
      empId: z.number().min(1).default(1),
    }),
  )
  .query(async ({ ctx, input }) => {
    const { empId } = input;
    // Apply the search condition only if searchTerm is not an empty strin

    const salaryDetails = await ctx.db
      .select({
        salary: salaryMaster.salary,
        insurance: salaryMaster.insurance,
        bonus: salaryMaster.bonus,
        gratuity: salaryMaster.gratuity,
        epf: salaryMaster.epf,
        pgw_pld: salaryMaster.pgwPld,
        // count: count()
      })
      .from(salaryMaster)
      .where(
        eq(salaryMaster.empId, empId)
      )

    // Get the total count of records with the same condition
    // const totalCountResult = await db
    //   .select({ count: count() })
    //   .from(staffMaster)
    //   .where(
    //     and(
    //       searchCondition,
    //       departmentCondition,
    //       statusCondition,
    //       designationCondition,
    //     ),
    //   );

    // const totalCount = totalCountResult[0]?.count ?? 0;

    // const updatedStaffs = [];

    // for (const staff of staffs) {
    //   const statesData = {
    //     value: staff.stateId,
    //     label: staff.state,
    //   };

    //   const locationData = {
    //     value: staff.locationId,
    //     label: staff.location,
    //   };

    //   const departmentData = {
    //     value: staff.department,
    //     label: staff.departmentname,
    //   };

    //   updatedStaffs.push({
    //     ...,
    //     statesData,
    //     locationData,
    //     departmentData,
    //   });
    // }

    return {
      salaryDetails,
      // totalCount,
      // totalPages: Math.ceil(totalCount / limit),
    };
  });

export const addStaffSalaryDetails = protectedProcedure
  .input(
    z.object({
      empId: z.number().min(1, "Employee number is required"),
      salary: z.string(),
      insurance: z.string().nullable(),
      isactive: z.boolean(),
      bonus: z.string().optional().nullable(),
      gratuity: z.string().optional().nullable(),
      epf: z.string().optional().nullable(),
      pgwPld: z.string().optional().nullable(),
      createdBy: z.number().min(1, "Invalid creator ID"),
      createdAt: z.string(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    try {
      // Format data for insertion
      const formattedInput = {
        ...input,
        salary: parseFloat(input.salary).toFixed(2),
        insurance: input.insurance ? parseFloat(input.insurance).toFixed(2) : null,
        bonus: input.bonus ? parseFloat(input.bonus).toFixed(2) : null,
        gratuity: input.gratuity ? parseFloat(input.gratuity).toFixed(2) : null,
        epf: input.epf ? parseFloat(input.epf).toFixed(2) : null,
        pgwPld: input.pgwPld ? parseFloat(input.pgwPld).toFixed(2) : null
      };

      const result = await ctx.db
        .insert(salaryMaster)
        .values(formattedInput)
        .returning({
          id: salaryMaster.id,
        });
      return {
        success: true,
        message: "Salary details added successfully",
        salaryDetails: result[0],
      };
    } catch (error) {
      console.error("Error adding salary details:", error);
      throw new Error("Failed to add salary details. Please try again.");
    }
  });

export const editStaffSalaryDetails = protectedProcedure
  .input(
    z.object({
      id: z.number().min(1, "Salary Details ID is required"),
      empId: z.number(),
      salary: z.string(),
      insurance: z.string().nullable(),
      isactive: z.boolean(),
      bonus: z.string().optional().nullable(),
      gratuity: z.string().optional().nullable(),
      epf: z.string().optional().nullable(),
      pgwPld: z.string().optional().nullable(),
      updatedBy: z.number().min(1, "Invalid creator ID"),
      updatedAt: z.string(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    try {
      const { id, updatedBy, updatedAt } = input;

      const formattedInput = {
        ...input,
        salary: parseFloat(input.salary).toFixed(2),
        insurance: input.insurance ? parseFloat(input.insurance).toFixed(2) : null,
        bonus: input.bonus ? parseFloat(input.bonus).toFixed(2) : null,
        gratuity: input.gratuity ? parseFloat(input.gratuity).toFixed(2) : null,
        epf: input.epf ? parseFloat(input.epf).toFixed(2) : null,
        pgwPld: input.pgwPld ? parseFloat(input.pgwPld).toFixed(2) : null
      };

      const existingSalaryDetails =
        await ctx.db.query.salaryDetailsInFinanceProject.findFirst({
          where: eq(salaryMaster.id, id),
        });

      if (!existingSalaryDetails) {
        throw new Error("Salary Details not found!");
      }

      const updatedStaff = await ctx.db
        .update(salaryMaster)
        .set({
          ...formattedInput,
          updatedBy,
          updatedAt,
        })
        .where(eq(salaryMaster.id, id))
        .returning({
          id: salaryMaster.id,
        });

      return {
        success: true,
        message: "Salary Details updated successfully",
        staff: updatedStaff[0],
      };
    } catch (error) {
      console.error("Error updating staff:", error);
      throw new Error("Failed to update staff. Please try again.");
    }
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
        await ctx.db.query.salaryDetailsInFinanceProject.findFirst({
          where: eq(salaryMaster.id, id),
        });

      if (!existingStaff) {
        throw new Error("Staff member not found");
      }

      // Update staff member details
      const updatedStaff = await ctx.db
        .update(salaryMaster)
        .set({
          isactive: false,
        })
        .where(eq(salaryMaster.id, id))
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
