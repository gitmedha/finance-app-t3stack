import { and, count, desc, eq, ilike } from "drizzle-orm";
import { z } from "zod";
import {
  //   createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { db } from "~/server/db";
import { departmentMasterInFinanceProject as departmentMaster } from "~/server/db/schema";

export const getDepartments = protectedProcedure
  .input(
    z.object({
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(100).default(10),
      searchTerm: z.string().optional().default(""), // Optional search term
      status: z.string().optional().default("Active"), // Optional search term
      type: z.string().optional().default(""), // Optional search term
    }),
  )
  .query(async ({ ctx, input }) => {
    const { page, limit, searchTerm, status, type } = input;
    const offset = (page - 1) * limit;

    // Apply the search condition only if searchTerm is not an empty string
    const searchCondition = searchTerm
      ? ilike(departmentMaster.departmentname, `%${searchTerm}%`)
      : undefined;
    const statusCondition = status
      ? eq(departmentMaster.isactive, status === "Active")
      : undefined;
    const typeCondition = type ? eq(departmentMaster.type, type) : undefined;

    const departments = await ctx.db
      .select({
        id: departmentMaster.id,
        departmentname: departmentMaster.departmentname,
        type: departmentMaster.type,
        deptCode: departmentMaster.deptCode,
        isactive: departmentMaster.isactive,
        notes: departmentMaster.notes,
        description: departmentMaster.description,
        createdAt: departmentMaster.createdAt,
        updatedAt: departmentMaster.updatedAt,
        createdBy: departmentMaster.createdBy,
        updatedBy: departmentMaster.updatedBy,
        // count: count()
      })
      .from(departmentMaster)
      .where(and(searchCondition, statusCondition, typeCondition))
      .orderBy(desc(departmentMaster.createdAt))
      .offset(offset)
      .limit(limit);

    const totalCountResult = await db
      .select({ count: count() })
      .from(departmentMaster)
      .where(and(searchCondition, statusCondition, typeCondition)); // Count with filter if searchCondition is defined

    const totalCount = totalCountResult[0]?.count ?? 0;
    const updatedDepartment = []
    for (const department of departments) {
      const typeData = {
        value: department.type ?? "",
        label: department.type ?? ""
      }

      updatedDepartment.push({
        ...department,
        typeData
      })
    }

    return {
      departments: updatedDepartment,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
    };
  });

export const getAllDepartments = protectedProcedure.query(async ({ ctx }) => {
  const departments = await ctx.db
    .select({
      id: departmentMaster.id,
      name: departmentMaster.departmentname,
    })
    .from(departmentMaster);

  return departments.map((department) => {
    return {
      value: department.id,
      label: department.name,
    };
  });
});

// export const getDepartmentsTypes = protectedProcedure.query(async ({ ctx, input }) => {
//   const departmentsType = await ctx.db.select({
//     type: departmentMaster.type,
//   })
//   .from(departmentMaster).groupBy(departmentMaster.type); // Group by type to get unique values

//   return {
//     departmentsType,
//   };
// })

export const addDepartment = protectedProcedure
  .input(
    z.object({
      departmentname: z.string().min(1, "Name is required"),
      deptCode: z.number().min(1, "Department Code is required"),
      type: z.string().min(1, "Type is required"),
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

      // Insert new department member into the database
      const result = await ctx.db
        .insert(departmentMaster)
        .values(formattedInput);
      return {
        success: true,
        message: "Department member added successfully",
        department: result[0], // Return the created department record
      };
    } catch (error) {
      console.error("Error adding department:", error);
      throw new Error("Failed to add department. Please try again.");
    }
  });

export const editDepartment = protectedProcedure
  .input(
    z.object({
      id: z.number().min(1, "Department ID is required"),
      departmentname: z.string().optional(),
      type: z.string().optional(),
      deptCode: z.number().optional(),
      isactive: z.boolean().optional(),
      updatedBy: z.number().min(1, "Invalid updater ID"),
      updatedAt: z.string(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    try {
      const { id, updatedBy, updatedAt, ...fieldsToUpdate } = input;

      // Check if the department member exists
      const existingStaff =
        await ctx.db.query.departmentMasterInFinanceProject.findFirst({
          where: eq(departmentMaster.id, id),
        });

      if (!existingStaff) {
        throw new Error("Department member not found");
      }

      // Update departmet member details
      const updatedDepartment = await ctx.db
        .update(departmentMaster)
        .set({
          ...fieldsToUpdate,
          updatedBy,
          updatedAt,
        })
        .where(eq(departmentMaster.id, id))
        .returning(); // Correct usage of eq()
      // .returning("*");

      return {
        success: true,
        message: "Department member updated successfully",
        staff: updatedDepartment[0], // Return the updated department record
      };
    } catch (error) {
      console.error("Error updating department:", error);
      throw new Error("Failed to update department. Please try again.");
    }
  });