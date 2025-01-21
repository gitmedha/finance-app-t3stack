import { protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { and, count, eq, ilike, desc, isNull, sql, isNotNull, inArray} from "drizzle-orm";
import { budgetDetailsInFinanceProject, budgetMasterInFinanceProject } from "drizzle/schema";


export const getTotalBudgetSum = protectedProcedure
    .input(z.object({
        financialYear: z.string()
    }))
    .query(async ({ ctx, input }) => {
        const { financialYear } = input;

        const budgetMasterIds = await ctx.db
            .select({
                id: budgetMasterInFinanceProject.id,
            })
            .from(budgetMasterInFinanceProject)
            .where(eq(budgetMasterInFinanceProject.financialYear, financialYear));
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
                                ${budgetDetailsInFinanceProject.march})`.as("total"), 
            })
            .from(budgetDetailsInFinanceProject)
            .where(inArray(budgetDetailsInFinanceProject.budgetid, budgetIds));

        return totalSum[0]?.total || 0; 
    });
export const getQuarterBudgetSum = protectedProcedure
    .input(z.object({
        financialYear:z.string(),
        quarter:z.string()
    }))
    .query(async({ctx,input})=>{
        const { quarter,financialYear} = input
        const budgetMasterIds = await ctx.db
            .select({
                id: budgetMasterInFinanceProject.id,
            })
            .from(budgetMasterInFinanceProject)
            .where(eq(budgetMasterInFinanceProject.financialYear, financialYear));
        if (!budgetMasterIds.length) {
            return 0;
        }
        const budgetIds = budgetMasterIds.map((record) => record.id);
        if(quarter == "q1"){
            const quarterBudget = await ctx.db
                .select({
                    catid: budgetDetailsInFinanceProject.catid,
                    qSum: sql`SUM(${budgetDetailsInFinanceProject.april}+${budgetDetailsInFinanceProject.may}+${budgetDetailsInFinanceProject.june})`.as("qSum")
                })
                .from(budgetDetailsInFinanceProject)
                .where(inArray(budgetDetailsInFinanceProject.budgetid, budgetIds))
                .groupBy(
                    budgetDetailsInFinanceProject.catid
                );
            return quarterBudget
        }
        else if (quarter == "q2") {
            const quarterBudget = await ctx.db
                .select({
                    catid: budgetDetailsInFinanceProject.catid,
                    qSum: sql`SUM(${budgetDetailsInFinanceProject.july}+${budgetDetailsInFinanceProject.august}+${budgetDetailsInFinanceProject.september})`.as("qSum")
                })
                .from(budgetDetailsInFinanceProject)
                .where(inArray(budgetDetailsInFinanceProject.budgetid, budgetIds))
                .groupBy(
                    budgetDetailsInFinanceProject.catid
                );
            return quarterBudget
        }
        else if(quarter == "q3")
        {
            const quarterBudget = await ctx.db
                .select({
                    catid: budgetDetailsInFinanceProject.catid,
                    qSum: sql`SUM(${budgetDetailsInFinanceProject.october}+${budgetDetailsInFinanceProject.november}+${budgetDetailsInFinanceProject.december})`.as("qSum")
                })
                .from(budgetDetailsInFinanceProject)
                .where(inArray(budgetDetailsInFinanceProject.budgetid, budgetIds))
                .groupBy(
                    budgetDetailsInFinanceProject.catid
                );
            return quarterBudget
        }
        else if (quarter == "q4") {
            const quarterBudget = await ctx.db
                .select({
                    catid: budgetDetailsInFinanceProject.catid,
                    qSum: sql`SUM(${budgetDetailsInFinanceProject.january}+${budgetDetailsInFinanceProject.february}+${budgetDetailsInFinanceProject.march})`.as("qSum")
                })
                .from(budgetDetailsInFinanceProject)
                .where(inArray(budgetDetailsInFinanceProject.budgetid, budgetIds))
                .groupBy(
                    budgetDetailsInFinanceProject.catid
                );
            return quarterBudget
        }
        
    })