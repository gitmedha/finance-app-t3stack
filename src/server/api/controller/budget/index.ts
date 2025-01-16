import { and, count, eq, ilike, desc, isNull, sql, isNotNull, } from "drizzle-orm";
import { z } from "zod";
import { protectedProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import { budgetDetailsInFinanceProject, budgetMasterInFinanceProject, categoryHierarchyInFinanceProject, categoryMasterInFinanceProject, salaryDetailsInFinanceProject, staffMasterInFinanceProject } from "~/server/db/schema";


export const getCats = protectedProcedure
    .query(async ({ ctx, input }) => {
        const categories = await ctx.db
            .select({
                categoryId: categoryMasterInFinanceProject.id,
                categoryName: categoryMasterInFinanceProject.categoryname,
            })
            .from(categoryMasterInFinanceProject)
            // this is null because we are doing giving type as null in the db
            .where(isNull(categoryMasterInFinanceProject.type))
        return { categories }
    })
export const getSubCats = protectedProcedure
    .input(
        z.object({
            categoryId: z.number()
        }
        ))
    .query(async ({ ctx, input }) => {
        const subCategories = await ctx.db
            .select({
                subCategoryId: categoryHierarchyInFinanceProject.catId,
                subCategoryName: categoryMasterInFinanceProject.categoryname,
            })
            .from(categoryHierarchyInFinanceProject)
            .innerJoin(
                categoryMasterInFinanceProject,
                eq(categoryHierarchyInFinanceProject.catId, categoryMasterInFinanceProject.id)
            )
            .where(eq(categoryHierarchyInFinanceProject.parentId, input.categoryId));
        return {
            subCategories
        };
    });
export const createBudget = protectedProcedure
    .input(
        z.object({
            name: z.string().optional(),
            financialYear: z.string(),
            notes: z.string().optional(),
            description: z.string().optional(),
            createdBy: z.number(),
            departmentId: z.number(),
            createdAt: z.string(),
        })
    )
    .mutation(async ({ ctx, input }) => {
        try {
            const result = await ctx.db
                .insert(budgetMasterInFinanceProject)
                .values({
                    financialYear: input.financialYear,
                    isactive: true,
                    description: input.description ?? "", // Default to empty string if undefined
                    createdBy: input.createdBy,
                    notes: input.notes ?? "", // Default to empty string if undefined
                    name: input.name ?? `budget for year ${input.financialYear}`, // 
                    departmentId: input.departmentId,
                    createdAt: input.createdAt,
                })
                .returning({
                    id: budgetMasterInFinanceProject.id,
                });
            console.log(result)
            return result;
        } catch (error) {
            console.error("Error in creating budget:", error);
            throw new Error("Failed to add budget. Please try again.");
        }
    });
export const addBudgetDetails = protectedProcedure
    .input(
        z.object({
            deptId: z.number(),
            budgetId: z.number(),
            catId: z.number(),
            data: z.array(
                z.object({
                    budgetid: z.number(),
                    catid: z.number(),
                    subcategoryId: z.number(),
                    unit: z.number(),
                    rate: z.string(),
                    total: z.string(),
                    currency: z.string(),
                    notes: z.string().optional(),
                    description: z.string().optional(),
                    april: z.string(),
                    may: z.string(),
                    june: z.string(),
                    july: z.string(),
                    august: z.string(),
                    september: z.string(),
                    october: z.string(),
                    november: z.string(),
                    december: z.string(),
                    january: z.string(),
                    february: z.string(),
                    march: z.string(),
                    activity: z.string().optional(),
                    deptId: z.number(),
                    clusterId: z.number().optional(),
                    createdBy: z.number(),
                    createdAt: z.string(),
                    qty: z.number().optional(),
                    qty1: z.number().optional(),
                    rate1: z.string().optional(),
                    amount1: z.string().optional(),
                    qty2: z.number().optional(),
                    rate2: z.string().optional(),
                    amount2: z.string().optional(),
                    qty3: z.number().optional(),
                    rate3: z.string().optional(),
                    amount3: z.string().optional(),
                    qty4: z.number().optional(),
                    rate4: z.string().optional(),
                    amount4: z.string().optional(),
                })
            ),
        })
    )
    .mutation(async ({ ctx, input }) => {
        try {
            // Extract data from input
            const { deptId, budgetId, catId, data } = input;

            // Map data to include shared fields and default values
            const recordsToInsert = data.map((item) => ({
                budgetid: budgetId,
                catid: catId,
                deptId,
                subcategoryId: item.subcategoryId,
                unit: item.unit,
                rate: item.rate,
                total: item.total,
                currency: item.currency,
                notes: item.notes ?? null,
                description: item.description ?? null,
                april: item.april.trim() === "" ? "0" : item.april, // Default to "0" if empty
                may: item.may.trim() === "" ? "0" : item.may,
                june: item.june.trim() === "" ? "0" : item.june,
                july: item.july.trim() === "" ? "0" : item.july,
                august: item.august.trim() === "" ? "0" : item.august,
                september: item.september.trim() === "" ? "0" : item.september,
                october: item.october.trim() === "" ? "0" : item.october,
                november: item.november.trim() === "" ? "0" : item.november,
                december: item.december.trim() === "" ? "0" : item.december,
                january: item.january.trim() === "" ? "0" : item.january,
                february: item.february.trim() === "" ? "0" : item.february,
                march: item.march.trim() === "" ? "0" : item.march,
                activity: item.activity ?? null,
                clusterId: item.clusterId ?? null,
                isactive: true,
                createdBy: item.createdBy,
                createdAt: item.createdAt,
                updatedAt: null,
                updatedBy: null,
                qqty: item.qty ?? 0,
                qty1: item.qty1 ?? 0,
                rate1: item.rate1?.trim() === "" ? "0" : item.rate1,
                amount1: item.amount1?.trim() === "" ? "0" : item.amount1,
                qty2: item.qty2 ?? 0,
                rate2: item.rate2?.trim() === "" ? "0" : item.rate2,
                amount2: item.amount2?.trim() === "" ? "0" : item.amount2,
                qty3: item.qty3 ?? 0,
                rate3: item.rate3?.trim() === "" ? "0" : item.rate3,
                amount3: item.amount3?.trim() === "" ? "0" : item.amount3,
                qty4: item.qty4 ?? 0,
                rate4: item.rate4?.trim() === "" ? "0" : item.rate4,
                amount4: item.amount4?.trim() === "" ? "0" : item.amount4,
                q1: (
                    parseInt(item.april.trim() === "" ? "0" : item.april) +
                    parseInt(item.may.trim() === "" ? "0" : item.may) +
                    parseInt(item.june.trim() === "" ? "0" : item.june)
                ).toString(),
                q2: (
                    parseInt(item.july.trim() === "" ? "0" : item.july) +
                    parseInt(item.august.trim() === "" ? "0" : item.august) +
                    parseInt(item.september.trim() === "" ? "0" : item.september)
                ).toString(),
                q3: (
                    parseInt(item.october.trim() === "" ? "0" : item.october) +
                    parseInt(item.november.trim() === "" ? "0" : item.november) +
                    parseInt(item.december.trim() === "" ? "0" : item.december)
                ).toString(),
                q4: (
                    parseInt(item.january.trim() === "" ? "0" : item.january) +
                    parseInt(item.february.trim() === "" ? "0" : item.february) +
                    parseInt(item.march.trim() === "" ? "0" : item.march)
                ).toString(),
            }));


            // Insert data using Drizzle
            await ctx.db.insert(budgetDetailsInFinanceProject).values(recordsToInsert);

            return { success: true, message: "Budget details added successfully" };
        } catch (error) {
            console.error("Error in adding budget details:", error);
            throw new Error("Failed to add budget details. Please try again.");
        }
    });

export const getBudgetMaster = protectedProcedure
    .input(
        z.object({
            deptId: z.number(),
            financialYear:z.string()
        }
        ))
    .query(async ({ ctx, input }) => {
        const budget = await ctx.db
            .select({
                budgetId: budgetMasterInFinanceProject.id,
            })
            .from(budgetMasterInFinanceProject)
            .where(
                and(
                    eq(budgetMasterInFinanceProject.departmentId, input.deptId),
                    eq(budgetMasterInFinanceProject.financialYear, input.financialYear)
                )
            )
            .limit(1);
        return {
            budgetId:budget [0]? budget[0].budgetId : null
        };
    });
export const getCatsBudgetDetails = protectedProcedure
    .input(
        z.object({
            deptId: z.number(),
            budgetId: z.number(),
            catId: z.number(),
            activity: z.string().optional(),
        })
    )
    .query(async ({ ctx, input }) => {
        const baseConditions = [
            eq(budgetDetailsInFinanceProject.deptId, input.deptId),
            eq(budgetDetailsInFinanceProject.budgetid, input.budgetId),
            eq(budgetDetailsInFinanceProject.catid, input.catId),
        ];

        // Add activity condition if it is not null or undefined
        if (input.activity !== null && input.activity !== undefined) {
            baseConditions.push(eq(budgetDetailsInFinanceProject.activity, input.activity));
        } 

        // Execute the query with all conditions
        const result = await ctx.db
            .select()
            .from(budgetDetailsInFinanceProject)
            .where(and(...baseConditions));

        return result;
    });

export const getLevelStaffCount = protectedProcedure
    .input(
        z.object({
            deptId: z.number(), 
        })
    )
    .query(async ({ ctx, input }) => {
        try {
            const levelStats = await ctx.db
                .select({
                    level: staffMasterInFinanceProject.level,
                    employeeCount: sql<number>`COUNT(${staffMasterInFinanceProject.id})`.as("employee_count"),
                    salarySum: sql<number>`SUM(${salaryDetailsInFinanceProject.salary})`.as("salary_sum"),
                    insuranceSum: sql<number>`SUM(${salaryDetailsInFinanceProject.insurance})`.as("insurance_sum"),
                    bonusSum: sql<number>`SUM(${salaryDetailsInFinanceProject.bonus})`.as("bonus_sum"),
                    gratuitySum: sql<number>`SUM(${salaryDetailsInFinanceProject.gratuity})`.as("gratuity_sum"),
                    epfSum: sql<number>`SUM(${salaryDetailsInFinanceProject.epf})`.as("epf_sum"),
                    pgwPldSum: sql<number>`SUM(${salaryDetailsInFinanceProject.pgwPld})`.as("pgw_pld_sum"),
                })
                .from(staffMasterInFinanceProject)
                .innerJoin(
                    salaryDetailsInFinanceProject,
                    eq(salaryDetailsInFinanceProject.empId, staffMasterInFinanceProject.id)
                )
                .where(
                    and(
                        eq(staffMasterInFinanceProject.department, input.deptId),
                        isNotNull(salaryDetailsInFinanceProject.salary)
                    )
                )
                .groupBy(staffMasterInFinanceProject.level);

            return levelStats;

        } catch (error) {
            console.error("Error in getting staff level count:", error);
            throw new Error("Failed to get staff level count. Please try again.");
        }
    });


export const updateBudgetDetails = protectedProcedure
    .input(
        z.object({
            deptId: z.number(),
            budgetId: z.number(),
            catId: z.number(),
            data: z.array(
                z.object({
                    budgetDetailsId: z.number(),
                    subcategoryId: z.number(),
                    unit: z.number(),
                    rate: z.string(),
                    total: z.string(),
                    currency: z.string(),
                    notes: z.string().optional(),
                    description: z.string().optional(),
                    april: z.string(),
                    may: z.string(),
                    june: z.string(),
                    july: z.string(),
                    august: z.string(),
                    september: z.string(),
                    october: z.string(),
                    november: z.string(),
                    december: z.string(),
                    january: z.string(),
                    february: z.string(),
                    march: z.string(),
                    activity: z.string().optional(),
                    clusterId: z.number().optional(),
                    updatedBy: z.number(),
                    updatedAt: z.string(),
                    qty: z.number().optional(),
                    qty1: z.number().optional(),
                    rate1: z.string().optional(),
                    amount1: z.string().optional(),
                    qty2: z.number().optional(),
                    rate2: z.string().optional(),
                    amount2: z.string().optional(),
                    qty3: z.number().optional(),
                    rate3: z.string().optional(),
                    amount3: z.string().optional(),
                    qty4: z.number().optional(),
                    rate4: z.string().optional(),
                    amount4: z.string().optional(),
                })
            ),
        })
    )
    .mutation(async ({ ctx, input }) => {
        try {
            const { data } = input;

            // Perform updates for each budget detail record
            for (const item of data) {
                const updates = {
                    subcategoryId: item.subcategoryId,
                    unit: item.unit,
                    rate: item.rate,
                    total: item.total,
                    currency: item.currency,
                    notes: item.notes ?? null,
                    description: item.description ?? null,
                    april: item.april.trim() === "" ? "0" : item.april,
                    may: item.may.trim() === "" ? "0" : item.may,
                    june: item.june.trim() === "" ? "0" : item.june,
                    july: item.july.trim() === "" ? "0" : item.july,
                    august: item.august.trim() === "" ? "0" : item.august,
                    september: item.september.trim() === "" ? "0" : item.september,
                    october: item.october.trim() === "" ? "0" : item.october,
                    november: item.november.trim() === "" ? "0" : item.november,
                    december: item.december.trim() === "" ? "0" : item.december,
                    january: item.january.trim() === "" ? "0" : item.january,
                    february: item.february.trim() === "" ? "0" : item.february,
                    march: item.march.trim() === "" ? "0" : item.march,
                    activity: item.activity ?? null,
                    clusterId: item.clusterId ?? null,
                    updatedBy: item.updatedBy,
                    updatedAt: item.updatedAt,
                    qty: item.qty ?? 0,
                    qty1: item.qty1 ?? 0,
                    rate1: item.rate1?.trim() === "" ? "0" : item.rate1,
                    amount1: item.amount1?.trim() === "" ? "0" : item.amount1,
                    qty2: item.qty2 ?? 0,
                    rate2: item.rate2?.trim() === "" ? "0" : item.rate2,
                    amount2: item.amount2?.trim() === "" ? "0" : item.amount2,
                    qty3: item.qty3 ?? 0,
                    rate3: item.rate3?.trim() === "" ? "0" : item.rate3,
                    amount3: item.amount3?.trim() === "" ? "0" : item.amount3,
                    qty4: item.qty4 ?? 0,
                    rate4: item.rate4?.trim() === "" ? "0" : item.rate4,
                    amount4: item.amount4?.trim() === "" ? "0" : item.amount4,
                    q1: (
                        parseInt(item.april.trim() === "" ? "0" : item.april) +
                        parseInt(item.may.trim() === "" ? "0" : item.may) +
                        parseInt(item.june.trim() === "" ? "0" : item.june)
                    ).toString(),
                    q2: (
                        parseInt(item.july.trim() === "" ? "0" : item.july) +
                        parseInt(item.august.trim() === "" ? "0" : item.august) +
                        parseInt(item.september.trim() === "" ? "0" : item.september)
                    ).toString(),
                    q3: (
                        parseInt(item.october.trim() === "" ? "0" : item.october) +
                        parseInt(item.november.trim() === "" ? "0" : item.november) +
                        parseInt(item.december.trim() === "" ? "0" : item.december)
                    ).toString(),
                    q4: (
                        parseInt(item.january.trim() === "" ? "0" : item.january) +
                        parseInt(item.february.trim() === "" ? "0" : item.february) +
                        parseInt(item.march.trim() === "" ? "0" : item.march)
                    ).toString(),
                };

                // Update record in the database
                await ctx.db
                    .update(budgetDetailsInFinanceProject)
                    .set(updates)
                    .where(eq(budgetDetailsInFinanceProject.id, item.budgetDetailsId));
            }

            return { success: true, message: "Budget details updated successfully" };
        } catch (error) {
            console.error("Error in updating budget details:", error);
            throw new Error("Failed to update budget details. Please try again.");
        }
    });



























