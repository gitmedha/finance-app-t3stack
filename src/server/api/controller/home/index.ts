import { protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { and, eq, sql, inArray } from "drizzle-orm";
import {
  budgetDetailsInFinanceProject,
  budgetMasterInFinanceProject,
  staffMasterInFinanceProject,
} from "~/server/db/schema";

export const getTotalBudgetSum = protectedProcedure
  .input(
    z.object({
      financialYear: z.string(),
      departmentId: z.number().optional().nullable(),
    }),
  )
  .query(async ({ ctx, input }) => {
    const { financialYear, departmentId } = input;
    const baseConditions = [
      eq(budgetMasterInFinanceProject.financialYear, financialYear),
    ];
    if (departmentId) {
      baseConditions.push(
        eq(budgetMasterInFinanceProject.departmentId, departmentId),
      );
    }
    const budgetMasterIds = await ctx.db
      .select({
        id: budgetMasterInFinanceProject.id,
      })
      .from(budgetMasterInFinanceProject)
      .where(and(...baseConditions));
    if (!budgetMasterIds.length) {
      return 0;
    }

    const budgetIds = budgetMasterIds.map((record) => record.id);

    const totalSum = await ctx.db
      .select({
        total: sql`SUM(${budgetDetailsInFinanceProject.april} + 
                                ${budgetDetailsInFinanceProject.may} + 
                                ${budgetDetailsInFinanceProject.june} + 
                                ${budgetDetailsInFinanceProject.july} + 
                                ${budgetDetailsInFinanceProject.august} + 
                                ${budgetDetailsInFinanceProject.september} + 
                                ${budgetDetailsInFinanceProject.october} + 
                                ${budgetDetailsInFinanceProject.november} + 
                                ${budgetDetailsInFinanceProject.december} + 
                                ${budgetDetailsInFinanceProject.january} + 
                                ${budgetDetailsInFinanceProject.february} + 
                                ${budgetDetailsInFinanceProject.march})`.as(
          "total",
        ),
      })
      .from(budgetDetailsInFinanceProject)
      .where(inArray(budgetDetailsInFinanceProject.budgetid, budgetIds));

    return totalSum[0]?.total || 0;
  });
export const getQuarterBudgetSum = protectedProcedure
  .input(
    z.object({
      financialYear: z.string(),
      quarter: z.string(),
      departmentId: z.number().optional().nullable(),
      subDeptId: z.number().optional().nullable(),
    }),
  )
  .query(async ({ ctx, input }) => {
    const { quarter, financialYear, departmentId } = input;
    const baseConditions = [
      eq(budgetMasterInFinanceProject.financialYear, financialYear),
    ];
    if (departmentId) {
      baseConditions.push(
        eq(budgetMasterInFinanceProject.departmentId, departmentId),
      );
    }
    const budgetMasterIds = await ctx.db
      .select({
        id: budgetMasterInFinanceProject.id,
      })
      .from(budgetMasterInFinanceProject)
      .where(and(...baseConditions));
    if (!budgetMasterIds.length) {
      return 0;
    }
    const budgetIds = budgetMasterIds.map((record) => record.id);
    if (quarter == "q1") {
      const quarterBudget = await ctx.db
        .select({
          catid: budgetDetailsInFinanceProject.catid,
          qSum: sql`SUM(${budgetDetailsInFinanceProject.april}+${budgetDetailsInFinanceProject.may}+${budgetDetailsInFinanceProject.june})`.as(
            "qSum",
          ),
        })
        .from(budgetDetailsInFinanceProject)
        .where(inArray(budgetDetailsInFinanceProject.budgetid, budgetIds))
        .groupBy(budgetDetailsInFinanceProject.catid);
      return quarterBudget;
    } else if (quarter == "q2") {
      const quarterBudget = await ctx.db
        .select({
          catid: budgetDetailsInFinanceProject.catid,
          qSum: sql`SUM(${budgetDetailsInFinanceProject.july}+${budgetDetailsInFinanceProject.august}+${budgetDetailsInFinanceProject.september})`.as(
            "qSum",
          ),
        })
        .from(budgetDetailsInFinanceProject)
        .where(inArray(budgetDetailsInFinanceProject.budgetid, budgetIds))
        .groupBy(budgetDetailsInFinanceProject.catid);
      return quarterBudget;
    } else if (quarter == "q3") {
      const quarterBudget = await ctx.db
        .select({
          catid: budgetDetailsInFinanceProject.catid,
          qSum: sql`SUM(${budgetDetailsInFinanceProject.october}+${budgetDetailsInFinanceProject.november}+${budgetDetailsInFinanceProject.december})`.as(
            "qSum",
          ),
        })
        .from(budgetDetailsInFinanceProject)
        .where(inArray(budgetDetailsInFinanceProject.budgetid, budgetIds))
        .groupBy(budgetDetailsInFinanceProject.catid);
      return quarterBudget;
    } else if (quarter == "q4") {
      const quarterBudget = await ctx.db
        .select({
          catid: budgetDetailsInFinanceProject.catid,
          qSum: sql`SUM(${budgetDetailsInFinanceProject.january}+${budgetDetailsInFinanceProject.february}+${budgetDetailsInFinanceProject.march})`.as(
            "qSum",
          ),
        })
        .from(budgetDetailsInFinanceProject)
        .where(inArray(budgetDetailsInFinanceProject.budgetid, budgetIds))
        .groupBy(budgetDetailsInFinanceProject.catid);
      return quarterBudget;
    }
  });
export const getBudgetSum = protectedProcedure
  .input(
    z.object({
      financialYear: z.string(),
      departmentId: z.number().optional().nullable(),
      subDeptId: z.number().optional().nullable(),
      //   quarter: z.enum(["All", "Q1", "Q2", "Q3", "Q4"]),
    }),
  )
  .query(async ({ ctx, input }) => {
    const { financialYear, departmentId, subDeptId } = input;
    const baseConditions = [
      eq(budgetMasterInFinanceProject.financialYear, financialYear),
    ];
    if (departmentId && departmentId != 0) {
      baseConditions.push(
        eq(budgetMasterInFinanceProject.departmentId, departmentId),
      );
    }

    const budgetMasterIds = await ctx.db
      .select({
        id: budgetMasterInFinanceProject.id,
      })
      .from(budgetMasterInFinanceProject)
      .where(and(...baseConditions));
    if (!budgetMasterIds.length) {
      return 0;
    }
    const budgetIds = budgetMasterIds.map((record) => record.id);
    const detailsCondition = [
      inArray(budgetDetailsInFinanceProject.budgetid, budgetIds),
    ];
    if (subDeptId && subDeptId != 0)
      detailsCondition.push(
        eq(budgetDetailsInFinanceProject.subDeptid, subDeptId),
      );
    const quarterBudget = await ctx.db
      .select({
        catid: budgetDetailsInFinanceProject.catid,
        // catName:categoryMasterInFinanceProject.categoryname,
        q1Sum:
          sql`SUM(${budgetDetailsInFinanceProject.april}+${budgetDetailsInFinanceProject.may}+${budgetDetailsInFinanceProject.june})`.as(
            "q1Sum",
          ),
        q2Sum:
          sql`SUM(${budgetDetailsInFinanceProject.july}+${budgetDetailsInFinanceProject.august}+${budgetDetailsInFinanceProject.september})`.as(
            "q2Sum",
          ),
        q3Sum:
          sql`SUM(${budgetDetailsInFinanceProject.october}+${budgetDetailsInFinanceProject.november}+${budgetDetailsInFinanceProject.december})`.as(
            "q3Sum",
          ),
        q4Sum:
          sql`SUM(${budgetDetailsInFinanceProject.january}+${budgetDetailsInFinanceProject.february}+${budgetDetailsInFinanceProject.march})`.as(
            "q4Sum",
          ),
      })
      .from(budgetDetailsInFinanceProject)
      .where(and(...detailsCondition))
      .groupBy(budgetDetailsInFinanceProject.catid);
    console.log(quarterBudget, "quarterBudget");

    const staffConditions = [eq(staffMasterInFinanceProject.isactive, true)];
    if (departmentId && departmentId !== 0) {
      staffConditions.push(
        eq(staffMasterInFinanceProject.department, departmentId),
      );
    }
    if (subDeptId && subDeptId !== 0) {
      staffConditions.push(
        eq(staffMasterInFinanceProject.subDeptid, subDeptId),
      );
    }

    // 2. Run a single COUNT query (no GROUP BY)
    const employeeCount = await ctx.db
      .select({
        total_count: sql<number>`COUNT(${staffMasterInFinanceProject.id})`.as(
          "total_count",
        ),
      })
      .from(staffMasterInFinanceProject)
      .where(and(...staffConditions));
    const budgetData =
      quarterBudget.length > 0
        ? quarterBudget.map((q) => ({
            catid: q.catid,
            budget:
              Number(q.q1Sum) +
                Number(q.q2Sum) +
                Number(q.q3Sum) +
                Number(q.q4Sum) || 0,
            q1: Number(q.q1Sum) || 0,
            q2: Number(q.q2Sum) || 0,
            q3: Number(q.q3Sum) || 0,
            q4: Number(q.q4Sum) || 0,
            employeeCount: employeeCount[0]?.total_count  ?? 0,
          }))
        : [
            {
              // default row when no data
              catid: 0, // or null if you prefer
              budget: 0,
              q1: 0,
              q2: 0,
              q3: 0,
              q4: 0,
              employeeCount: employeeCount[0]?.total_count  ?? 0,
            },
          ];

    return {
      budgetData,
      departmentId,
      subDeptId,
      financialYear,
    };
  });
