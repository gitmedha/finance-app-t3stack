import { protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { and, count, eq, ilike, desc, isNull, sql, isNotNull, inArray} from "drizzle-orm";
import { budgetDetailsInFinanceProject, budgetMasterInFinanceProject, categoryMasterInFinanceProject } from "~/server/db/schema";
import { db } from "~/server/db";


export const getTotalBudgetSum = protectedProcedure
    .input(z.object({
        financialYear: z.string(),
        departmentId:z.number().optional().nullable(),
    }))
    .query(async ({ ctx, input }) => {
        const { financialYear ,departmentId} = input;
        const baseConditions = [
            eq(budgetMasterInFinanceProject.financialYear,financialYear),
        ]
        if(departmentId){
            baseConditions.push(eq(budgetMasterInFinanceProject.departmentId,departmentId))
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
                                ${budgetDetailsInFinanceProject.march})`.as("total"), 
            })
            .from(budgetDetailsInFinanceProject)
            .where(inArray(budgetDetailsInFinanceProject.budgetid, budgetIds));

        return totalSum[0]?.total || 0; 
    });
export const getQuarterBudgetSum = protectedProcedure
    .input(z.object({
        financialYear:z.string(),
        quarter:z.string(),
        departmentId: z.number().optional().nullable(),
        subDeptId: z.number().optional().nullable(),
    }))
    .query(async({ctx,input})=>{
        const { quarter,financialYear,departmentId} = input
        const baseConditions = [
            eq(budgetMasterInFinanceProject.financialYear, financialYear),
        ]
        if (departmentId) {
            baseConditions.push(eq(budgetMasterInFinanceProject.departmentId, departmentId))
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
export const getBudgetSum = protectedProcedure
    .input(z.object({
        financialYear: z.string(),
        departmentId: z.number().optional().nullable(),
        subDeptId: z.number().optional().nullable(),
    }))
    .query(async ({ ctx, input }) => {
        const { financialYear, departmentId, subDeptId } = input
        const baseConditions = [
            eq(budgetMasterInFinanceProject.financialYear, financialYear),
        ]
        if (departmentId) {
            baseConditions.push(eq(budgetMasterInFinanceProject.departmentId, departmentId))
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
            inArray(budgetDetailsInFinanceProject.budgetid, budgetIds)
        ]
        if (subDeptId)
            detailsCondition.push(eq(budgetDetailsInFinanceProject.subDeptid,subDeptId))
            const quarterBudget = await ctx.db
                .select({
                    catid: budgetDetailsInFinanceProject.catid,
                    // catName:categoryMasterInFinanceProject.categoryname,
                    q1Sum: sql`SUM(${budgetDetailsInFinanceProject.april}+${budgetDetailsInFinanceProject.may}+${budgetDetailsInFinanceProject.june})`.as("q1Sum"),
                    q2Sum: sql`SUM(${budgetDetailsInFinanceProject.july}+${budgetDetailsInFinanceProject.august}+${budgetDetailsInFinanceProject.september})`.as("q2Sum"),
                    q3Sum: sql`SUM(${budgetDetailsInFinanceProject.october}+${budgetDetailsInFinanceProject.november}+${budgetDetailsInFinanceProject.december})`.as("q3Sum"),
                    q4Sum: sql`SUM(${budgetDetailsInFinanceProject.january}+${budgetDetailsInFinanceProject.february}+${budgetDetailsInFinanceProject.march})`.as("q4Sum")
                })
                .from(budgetDetailsInFinanceProject)
                .where(and(...detailsCondition))
                .groupBy(
                    budgetDetailsInFinanceProject.catid
                )

        
        return quarterBudget.map((q) => (
            {
                catid: q.catid,
                // catName:q.catName,
                1: Number(q.q1Sum) + Number(q.q2Sum) + Number(q.q3Sum) + Number(q.q4Sum),
                5: Number(q.q1Sum),
                9: Number(q.q2Sum),
                13: Number(q.q3Sum),
                17: Number(q.q4Sum)
            }
        ))
       

    })