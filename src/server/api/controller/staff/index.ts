
import { and, count, eq, ilike } from "drizzle-orm";
import { z } from "zod";
import {
  //   createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { db } from "~/server/db";
import { departmentMasterInFinanceProject as departmentMaster, staffMasterInFinanceProject as staffMaster } from "~/server/db/schema";

export const getStaffs = protectedProcedure.input(z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  searchTerm: z.string().optional().default(""), // Optional search term
  department: z.number().optional().default(0), // Optional search term
  status: z.string().optional().default('Active'), // Optional search term
  designation: z.string().optional().default(""), // Optional search term
})).query(async ({ ctx, input }) => {
  const { page, limit, searchTerm, status, department, designation } = input;
  const offset = (page - 1) * limit;
  // Apply the search condition only if searchTerm is not an empty string
  const searchCondition = searchTerm
    ? ilike(staffMaster.name, `%${searchTerm}%`)
    : undefined;
  const departmentCondition = department === 0 ? undefined : eq(staffMaster.department, department)
  const statusCondition = eq(staffMaster.isactive, (status === 'Active'))
  const designationCondition = designation ? eq(staffMaster.designation, designation) : undefined

  const staffs = await ctx.db.select({
    id: staffMaster.id,
    name: staffMaster.name,
    empNo: staffMaster.empNo,
    isactive: staffMaster.isactive,
    notes: staffMaster.notes,
    description: staffMaster.description,
    createdAt: staffMaster.createdAt,
    updatedAt: staffMaster.updatedAt,
    createdBy: staffMaster.createdBy,
    updatedBy: staffMaster.updatedBy,
    department: staffMaster.department,
    departmentname: departmentMaster.departmentname,
    designation:staffMaster.designation
    // count: count()
  }).from(staffMaster).leftJoin(departmentMaster,
    and(
      eq(departmentMaster.isactive, true),
      eq(departmentMaster.id, staffMaster.department)
  )).where(and(
    searchCondition,
    departmentCondition,
    statusCondition,
    designationCondition
  )).offset(offset).limit(limit)

  // Get the total count of records with the same condition
  const totalCountResult = await db.select({ count: count() }).from(staffMaster).where(and(
    searchCondition,
    departmentCondition,
    statusCondition,
    designationCondition
  ))

  const totalCount = totalCountResult[0]?.count ?? 0;

  return {
    staffs,
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
  };
})

export const getDesignation = protectedProcedure.query(async ({ ctx }) => {
  const designations = await ctx.db.select({
    designation: staffMaster.designation,
  })
  .from(staffMaster).groupBy(staffMaster.designation); // Group by type to get unique values

  return {
    designations,
  };
})
