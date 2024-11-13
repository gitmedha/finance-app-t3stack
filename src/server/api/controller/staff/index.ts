
import { and, count, eq, ilike } from "drizzle-orm";
import { z } from "zod";
import {
  //   createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { db } from "~/server/db";
import { departmentMasterInFinanceProject, staffMasterInFinanceProject } from "~/server/db/schema";

export const getStaffs = protectedProcedure.input(z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  searchTerm: z.string().optional().default(""), // Optional search term
  department: z.string().optional().default(""), // Optional search term
  status: z.string().optional().default('Active'), // Optional search term
  designation: z.string().optional().default(""), // Optional search term
})).query(async ({ ctx, input }) => {
  const { page, limit, searchTerm, status } = input;

  // console.log(input)
  const offset = (page - 1) * limit;
  // Apply the search condition only if searchTerm is not an empty string
  const searchCondition = searchTerm
    ? ilike(staffMasterInFinanceProject.name, `%${searchTerm}%`)
    : undefined;

  const staffs = await ctx.db.select({
    id: staffMasterInFinanceProject.id,
    name: staffMasterInFinanceProject.name,
    empNo: staffMasterInFinanceProject.empNo,
    isactive: staffMasterInFinanceProject.isactive,
    notes: staffMasterInFinanceProject.notes,
    description: staffMasterInFinanceProject.description,
    createdAt: staffMasterInFinanceProject.createdAt,
    updatedAt: staffMasterInFinanceProject.updatedAt,
    createdBy: staffMasterInFinanceProject.createdBy,
    updatedBy: staffMasterInFinanceProject.updatedBy,
    department: staffMasterInFinanceProject.department,
    departmentname: departmentMasterInFinanceProject.departmentname,
    // count: count()
  }).from(staffMasterInFinanceProject).leftJoin(departmentMasterInFinanceProject,
    and(
      eq(departmentMasterInFinanceProject.isactive, true),
      eq(departmentMasterInFinanceProject.id, staffMasterInFinanceProject.department)
  )).where(and(
    searchCondition,
    eq(staffMasterInFinanceProject.isactive, (status === 'Active') )
  )).offset(offset).limit(limit)

  // // Get the total count of records with the same condition
  const totalCountResult = await db.select({ count: count() }).from(staffMasterInFinanceProject).where(searchCondition); // Count with filter if searchCondition is defined

  const totalCount = totalCountResult[0]?.count || 0;

  return {
    staffs,
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
  };
})