
import { and, count, eq, ilike } from "drizzle-orm";
import { z } from "zod";
import {
  //   createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { db } from "~/server/db";
import { departmentMasterInFinanceProject as departmentMaster } from "~/server/db/schema";

export const getDepartments = protectedProcedure.input(z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  searchTerm: z.string().optional().default(""), // Optional search term
  status: z.string().optional().default("Active"), // Optional search term
  type: z.string().optional().default(""), // Optional search term
})).query(async ({ ctx, input }) => {

  const { page, limit, searchTerm, status, type } = input;
  const offset = (page - 1) * limit;

  // Apply the search condition only if searchTerm is not an empty string
  const searchCondition = searchTerm
    ? ilike(departmentMaster.departmentname, `%${searchTerm}%`)
    : undefined;
  const statusCondition = status ? eq(departmentMaster.isactive, (status === 'Active')) : undefined
  const typeCondition = type ? eq(departmentMaster.type, type) : undefined

  const departments = await ctx.db.select({
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
  }).from(departmentMaster).where(and(
    searchCondition,
    statusCondition,
    typeCondition
  )).offset(offset).limit(limit)

  const totalCountResult = await db.select({ count: count() }).from(departmentMaster).where(and(
    searchCondition,
    statusCondition,
    typeCondition
  )); // Count with filter if searchCondition is defined

  const totalCount = totalCountResult[0]?.count ?? 0;

  return {
    departments,
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
  };
})


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
