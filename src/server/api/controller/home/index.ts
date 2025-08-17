import { protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { and, eq, sql, inArray, lte, or, gte, isNull, SQLWrapper } from "drizzle-orm";
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
      financialYear: z.string(),            // e.g. "2024-25"
      departmentId: z.number().optional().nullable(),
      subDeptId: z.number().optional().nullable(),
      quarter: z.enum(["All", "Q1", "Q2", "Q3", "Q4"]),
    })
  )
  .query(async ({ ctx, input }) => {
    const { financialYear, departmentId, subDeptId, quarter } = input;

    // ─── 1. Parse financialYear into calendar years ─────────────────────────
    // "2024-25" → fyStart = "2024", fyEnd = "2025"
    const [fyStart, fyEndSuffix] = financialYear.split("-");
    const fyEnd =
      fyEndSuffix?.length === 2 ? `20${fyEndSuffix}` : fyEndSuffix;

    // ─── 2. Compute the ISO date range for the requested quarter ────────────
    let periodStart: string, periodEnd: string;
    switch (quarter) {
      case "Q1":
        periodStart = `${fyStart}-04-01`;
        periodEnd   = `${fyStart}-06-30`;
        break;
      case "Q2":
        periodStart = `${fyStart}-07-01`;
        periodEnd   = `${fyStart}-09-30`;
        break;
      case "Q3":
        periodStart = `${fyStart}-10-01`;
        periodEnd   = `${fyStart}-12-31`;
        break;
      case "Q4":
        periodStart = `${fyEnd}-01-01`;
        periodEnd   = `${fyEnd}-03-31`;
        break;
      default:  // "All"
        periodStart = `${fyStart}-04-01`;
        periodEnd   = `${fyEnd}-03-31`;
    }

    // ─── 3. Fetch matching budget master IDs ─────────────────────────────────
    const bmWhere = [ eq(budgetMasterInFinanceProject.financialYear, financialYear) ];
    if (departmentId && departmentId !== 0) {
      bmWhere.push(
        eq(budgetMasterInFinanceProject.departmentId, departmentId)
      );
    }
    const bmRows = await ctx.db
      .select({ id: budgetMasterInFinanceProject.id })
      .from(budgetMasterInFinanceProject)
      .where(and(...bmWhere));

    // If no budgets found, return empty response
    if (bmRows.length === 0) {
      return { budgetData: [], departmentId, subDeptId, financialYear };
    }
    const budgetIds = bmRows.map((r) => r.id);

    // ─── 4. Sum up budget details for each category ──────────────────────────
    const bdWhere: (SQLWrapper | undefined)[] = [ inArray(budgetDetailsInFinanceProject.budgetid, budgetIds) ];
    if (subDeptId && subDeptId !== 0) {
      bdWhere.push(
        eq(budgetDetailsInFinanceProject.subDeptid, subDeptId)
      );
    }
    const quarterBudget = await ctx.db
      .select({
        catid: budgetDetailsInFinanceProject.catid,
        q1Sum: sql`
          SUM(${budgetDetailsInFinanceProject.april}
            + ${budgetDetailsInFinanceProject.may}
            + ${budgetDetailsInFinanceProject.june})
        `.as("q1Sum"),
        q2Sum: sql`
          SUM(${budgetDetailsInFinanceProject.july}
            + ${budgetDetailsInFinanceProject.august}
            + ${budgetDetailsInFinanceProject.september})
        `.as("q2Sum"),
        q3Sum: sql`
          SUM(${budgetDetailsInFinanceProject.october}
            + ${budgetDetailsInFinanceProject.november}
            + ${budgetDetailsInFinanceProject.december})
        `.as("q3Sum"),
        q4Sum: sql`
          SUM(${budgetDetailsInFinanceProject.january}
            + ${budgetDetailsInFinanceProject.february}
            + ${budgetDetailsInFinanceProject.march})
        `.as("q4Sum"),
      })
      .from(budgetDetailsInFinanceProject)
      .where(and(...bdWhere))
      .groupBy(budgetDetailsInFinanceProject.catid);

    // ─── 5. Count staff on-roll during the period ────────────────────────────
    const stWhere: (SQLWrapper | undefined)[] = [
      eq(staffMasterInFinanceProject.isactive, true),
      // employed on or before periodEnd
      lte(staffMasterInFinanceProject.dateOfJoining, periodEnd),
      // and either resigned after periodStart or never resigned
      or(
        gte(staffMasterInFinanceProject.dateOfResigning, periodStart),
        isNull(staffMasterInFinanceProject.dateOfResigning)
      ),
    ];
    if (departmentId && departmentId !== 0) {
      stWhere.push(
        eq(staffMasterInFinanceProject.department, departmentId)
      );
    }
    if (subDeptId && subDeptId !== 0) {
      stWhere.push(
        eq(staffMasterInFinanceProject.subDeptid, subDeptId)
      );
    }

    const [row]  = await ctx.db
      .select({
        total_count: sql<number>`
          COUNT(${staffMasterInFinanceProject.id})
        `.as("total_count"),
      })
      .from(staffMasterInFinanceProject)
      .where(and(...stWhere));

      // total_count is now a plain number
const employeeCount = row?.total_count ?? 0;

    // ─── 6. Assemble final budgetData array ─────────────────────────────────
    const budgetData =
      quarterBudget.length > 0
        ? quarterBudget.map((r) => {
            const q1 = Number(r.q1Sum) || 0;
            const q2 = Number(r.q2Sum) || 0;
            const q3 = Number(r.q3Sum) || 0;
            const q4 = Number(r.q4Sum) || 0;
            return {
              catid: r.catid,
              budget: q1 + q2 + q3 + q4,
              q1, q2, q3, q4,
              employeeCount,
            };
          })
        : [
            {
              catid: 0,
              budget: 0,
              q1: 0,
              q2: 0,
              q3: 0,
              q4: 0,
              employeeCount,
            },
          ];
    console.log(budgetData, "budgetData");
    // ─── 7. Return the aggregated result ────────────────────────────────────
    return {
      budgetData,
      departmentId,
      subDeptId,
      financialYear,
    };
  });
