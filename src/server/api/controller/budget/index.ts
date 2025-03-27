import { and, eq, isNull, sql, isNotNull, inArray, } from "drizzle-orm";
import { z } from "zod";
import { protectedProcedure } from "~/server/api/trpc";
import { budgetDetailsInFinanceProject, budgetMasterInFinanceProject, categoryHierarchyInFinanceProject, categoryMasterInFinanceProject, salaryDetailsInFinanceProject, staffMasterInFinanceProject, departmentHierarchyInFinanceProject, departmentMasterInFinanceProject } from "~/server/db/schema";


export const getCats = protectedProcedure
    .query(async ({ ctx }) => {
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
            subDeptId: z.number(),
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
            const { deptId, budgetId, catId, subDeptId, data } = input;
            // Map data to include shared fields and default values

            const recordsToInsert = []
            for (const item of data) {
                const baseConditions = [eq(budgetDetailsInFinanceProject.budgetid, budgetId),
                eq(budgetDetailsInFinanceProject.catid, catId),
                eq(budgetDetailsInFinanceProject.subcategoryId, item.subcategoryId),
                eq(budgetDetailsInFinanceProject.activity, item.activity ?? ""),
                eq(budgetDetailsInFinanceProject.subDeptid, subDeptId)
                ]

                const existingRecord = await ctx.db
                    .select()
                    .from(budgetDetailsInFinanceProject)
                    .where(
                        and(...baseConditions))
                if (!existingRecord || existingRecord.length == 0) {
                    recordsToInsert.push({
                        budgetid: budgetId,
                        catid: catId,
                        subDeptid: subDeptId,
                        deptid: deptId,
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
                    })
                }
            }
            // Insert data using Drizzle
            const insertedRecords = await ctx.db.insert(budgetDetailsInFinanceProject).values(recordsToInsert).returning();

            const response = insertedRecords.map((record) => ({
                budgetDetailsId: record.id,
                subcategoryId: record.subcategoryId,
                categoryId: record.catid,
            }));

            return { success: true, message: "Budget details added successfully", data: response };
        } catch (error) {
            console.error("Error in adding budget details:", error);
            throw new Error("Failed to add budget details. Please try again.");
        }
    });

export const getBudgetMaster = protectedProcedure
    .input(
        z.object({
            deptId: z.number(),
            financialYear: z.string()
        }
        ))
    .query(async ({ ctx, input }) => {
        if (input.deptId == 0)
            return { budgetId: 0, status: undefined }
        const budget = await ctx.db
            .select({
                budgetId: budgetMasterInFinanceProject.id,
                status: budgetMasterInFinanceProject.status
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
            budgetId: budget[0] ? budget[0].budgetId : null,
            status: budget[0] ? budget[0].status : undefined
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
            eq(budgetDetailsInFinanceProject.deptid, input.deptId),
            eq(budgetDetailsInFinanceProject.budgetid, input.budgetId),
            eq(budgetDetailsInFinanceProject.catid, input.catId),
        ];

        // Add activity condition if it is not null or undefined
        if (input.activity !== null && input.activity !== undefined && input.activity != "0") {
            baseConditions.push(eq(budgetDetailsInFinanceProject.activity, input.activity));
        }
        let result
        // Execute the query with all conditions
        if (input.activity == "0") {
            result = await ctx.db
                .select({
                    subcategoryId: budgetDetailsInFinanceProject.subcategoryId,
                    budgetId: budgetDetailsInFinanceProject.budgetid,
                    april: sql`SUM(${budgetDetailsInFinanceProject.april})`.as("april"),
                    may: sql`SUM(${budgetDetailsInFinanceProject.may})`.as("may"),
                    june: sql`SUM(${budgetDetailsInFinanceProject.june})`.as("june"),
                    july: sql`SUM(${budgetDetailsInFinanceProject.july})`.as("july"),
                    august: sql`SUM(${budgetDetailsInFinanceProject.august})`.as("august"),
                    september: sql`SUM(${budgetDetailsInFinanceProject.september})`.as("september"),
                    october: sql`SUM(${budgetDetailsInFinanceProject.october})`.as("october"),
                    november: sql`SUM(${budgetDetailsInFinanceProject.november})`.as("november"),
                    december: sql`SUM(${budgetDetailsInFinanceProject.december})`.as("december"),
                    january: sql`SUM(${budgetDetailsInFinanceProject.january})`.as("january"),
                    february: sql`SUM(${budgetDetailsInFinanceProject.february})`.as("february"),
                    march: sql`SUM(${budgetDetailsInFinanceProject.march})`.as("march"),
                    q1: sql`SUM(${budgetDetailsInFinanceProject.q1})`.as("q1"),
                    q2: sql`SUM(${budgetDetailsInFinanceProject.q2})`.as("q2"),
                    q3: sql`SUM(${budgetDetailsInFinanceProject.q3})`.as("q3"),
                    q4: sql`SUM(${budgetDetailsInFinanceProject.q4})`.as("q4"),
                    amount1: sql`SUM(${budgetDetailsInFinanceProject.amount1})`.as("amount1"),
                    amount2: sql`SUM(${budgetDetailsInFinanceProject.amount2})`.as("amount2"),
                    amount3: sql`SUM(${budgetDetailsInFinanceProject.amount3})`.as("amount3"),
                    amount4: sql`SUM(${budgetDetailsInFinanceProject.amount4})`.as("amount4"),
                    rate1: sql`SUM(${budgetDetailsInFinanceProject.rate1})`.as("rate1"),
                    rate2: sql`SUM(${budgetDetailsInFinanceProject.rate2})`.as("rate2"),
                    rate3: sql`SUM(${budgetDetailsInFinanceProject.rate3})`.as("rate3"),
                    rate4: sql`SUM(${budgetDetailsInFinanceProject.rate4})`.as("rate4"),
                    qty1: sql`SUM(${budgetDetailsInFinanceProject.qty1})`.as("qty1"),
                    qty2: sql`SUM(${budgetDetailsInFinanceProject.qty2})`.as("qty2"),
                    qty3: sql`SUM(${budgetDetailsInFinanceProject.qty3})`.as("qty3"),
                    qty4: sql`SUM(${budgetDetailsInFinanceProject.qty4})`.as("qty4"),
                    total: sql`SUM(${budgetDetailsInFinanceProject.total})`.as("total"),
                    id: sql`SUM(${budgetDetailsInFinanceProject.total})`.as("total"),
                })
                .from(budgetDetailsInFinanceProject)
                .where(and(...baseConditions))
                .groupBy(budgetDetailsInFinanceProject.subcategoryId);
        }
        else {
            result = await ctx.db
                .select()
                .from(budgetDetailsInFinanceProject)
                .where(and(...baseConditions));
        }
        return { result, budgeId: input.budgetId };
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


export const getPersonalCatDetials = protectedProcedure
    .input(
        z.object({
            subdeptId: z.number(),
            deptId: z.number(),
            budgetId: z.number(),
            catId: z.number(),
            activity: z.string().optional(),
            financialYear: z.string(),
        })
    )
    .query(async ({ ctx, input }) => {
        try {
            // get sub categories
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
                .where(eq(categoryHierarchyInFinanceProject.parentId, input.catId));
            if (!subCategories)
                throw new Error("Failed to get the subcategories")
            // we going to get the sub departments

            // category budgetDetails call
            const baseConditions = [
                eq(budgetDetailsInFinanceProject.catid, input.catId)
            ];
            const budgetMasterbaseCondition = [
                eq(budgetMasterInFinanceProject.financialYear, input.financialYear),
            ]
            if (input.budgetId != 0)
                baseConditions.push(eq(budgetDetailsInFinanceProject.budgetid, input.budgetId),)
            if (input.deptId != 0) {
                baseConditions.push(eq(budgetDetailsInFinanceProject.deptid, input.deptId))
                budgetMasterbaseCondition.push(eq(budgetMasterInFinanceProject.departmentId, input.deptId))
            }
            if (input.subdeptId != 0)
                baseConditions.push(eq(budgetDetailsInFinanceProject.subDeptid, input.subdeptId))

            // Add activity condition if it is not null or undefined
            if (input.activity !== null && input.activity !== undefined && input.activity != "0") {
                baseConditions.push(eq(budgetDetailsInFinanceProject.activity, input.activity));
            }
            let result
            // Execute the query with all conditions
            if (input.activity == "0") {
                result = await ctx.db
                    .select({
                        subcategoryId: budgetDetailsInFinanceProject.subcategoryId,
                        budgetId: budgetDetailsInFinanceProject.budgetid,
                        april: sql`SUM(${budgetDetailsInFinanceProject.april})`.as("april"),
                        may: sql`SUM(${budgetDetailsInFinanceProject.may})`.as("may"),
                        june: sql`SUM(${budgetDetailsInFinanceProject.june})`.as("june"),
                        july: sql`SUM(${budgetDetailsInFinanceProject.july})`.as("july"),
                        august: sql`SUM(${budgetDetailsInFinanceProject.august})`.as("august"),
                        september: sql`SUM(${budgetDetailsInFinanceProject.september})`.as("september"),
                        october: sql`SUM(${budgetDetailsInFinanceProject.october})`.as("october"),
                        november: sql`SUM(${budgetDetailsInFinanceProject.november})`.as("november"),
                        december: sql`SUM(${budgetDetailsInFinanceProject.december})`.as("december"),
                        january: sql`SUM(${budgetDetailsInFinanceProject.january})`.as("january"),
                        february: sql`SUM(${budgetDetailsInFinanceProject.february})`.as("february"),
                        march: sql`SUM(${budgetDetailsInFinanceProject.march})`.as("march"),
                        q1: sql`SUM(${budgetDetailsInFinanceProject.q1})`.as("q1"),
                        q2: sql`SUM(${budgetDetailsInFinanceProject.q2})`.as("q2"),
                        q3: sql`SUM(${budgetDetailsInFinanceProject.q3})`.as("q3"),
                        q4: sql`SUM(${budgetDetailsInFinanceProject.q4})`.as("q4"),
                        amount1: sql`SUM(${budgetDetailsInFinanceProject.amount1})`.as("amount1"),
                        amount2: sql`SUM(${budgetDetailsInFinanceProject.amount2})`.as("amount2"),
                        amount3: sql`SUM(${budgetDetailsInFinanceProject.amount3})`.as("amount3"),
                        amount4: sql`SUM(${budgetDetailsInFinanceProject.amount4})`.as("amount4"),
                        rate1: sql`SUM(${budgetDetailsInFinanceProject.rate1})`.as("rate1"),
                        rate2: sql`SUM(${budgetDetailsInFinanceProject.rate2})`.as("rate2"),
                        rate3: sql`SUM(${budgetDetailsInFinanceProject.rate3})`.as("rate3"),
                        rate4: sql`SUM(${budgetDetailsInFinanceProject.rate4})`.as("rate4"),
                        qty1: sql`SUM(${budgetDetailsInFinanceProject.qty1})`.as("qty1"),
                        qty2: sql`SUM(${budgetDetailsInFinanceProject.qty2})`.as("qty2"),
                        qty3: sql`SUM(${budgetDetailsInFinanceProject.qty3})`.as("qty3"),
                        qty4: sql`SUM(${budgetDetailsInFinanceProject.qty4})`.as("qty4"),
                        total: sql`SUM(${budgetDetailsInFinanceProject.total})`.as("total"),
                        id: sql`SUM(${budgetDetailsInFinanceProject.total})`.as("total"),
                    })
                    .from(budgetDetailsInFinanceProject)
                    .where(and(...baseConditions))
                    .groupBy(budgetDetailsInFinanceProject.subcategoryId);
            }
            else if (input.deptId == 0 || input.subdeptId == 0) {
                const budgetMasterIds = await ctx.db
                    .select({
                        id: budgetMasterInFinanceProject.id,
                    })
                    .from(budgetMasterInFinanceProject)
                    .where(and(...budgetMasterbaseCondition));
                const budgetIds = budgetMasterIds.map((record) => record.id);
                const budgetRetrivalConditions = [
                    ...baseConditions, inArray(budgetDetailsInFinanceProject.budgetid, budgetIds)
                ]
                result = await ctx.db
                    .select({
                        subcategoryId: budgetDetailsInFinanceProject.subcategoryId,
                        april: sql`SUM(${budgetDetailsInFinanceProject.april})`.as("april"),
                        may: sql`SUM(${budgetDetailsInFinanceProject.may})`.as("may"),
                        june: sql`SUM(${budgetDetailsInFinanceProject.june})`.as("june"),
                        july: sql`SUM(${budgetDetailsInFinanceProject.july})`.as("july"),
                        august: sql`SUM(${budgetDetailsInFinanceProject.august})`.as("august"),
                        september: sql`SUM(${budgetDetailsInFinanceProject.september})`.as("september"),
                        october: sql`SUM(${budgetDetailsInFinanceProject.october})`.as("october"),
                        november: sql`SUM(${budgetDetailsInFinanceProject.november})`.as("november"),
                        december: sql`SUM(${budgetDetailsInFinanceProject.december})`.as("december"),
                        january: sql`SUM(${budgetDetailsInFinanceProject.january})`.as("january"),
                        february: sql`SUM(${budgetDetailsInFinanceProject.february})`.as("february"),
                        march: sql`SUM(${budgetDetailsInFinanceProject.march})`.as("march"),
                        q1: sql`SUM(${budgetDetailsInFinanceProject.q1})`.as("q1"),
                        q2: sql`SUM(${budgetDetailsInFinanceProject.q2})`.as("q2"),
                        q3: sql`SUM(${budgetDetailsInFinanceProject.q3})`.as("q3"),
                        q4: sql`SUM(${budgetDetailsInFinanceProject.q4})`.as("q4"),
                        amount1: sql`SUM(${budgetDetailsInFinanceProject.amount1})`.as("amount1"),
                        amount2: sql`SUM(${budgetDetailsInFinanceProject.amount2})`.as("amount2"),
                        amount3: sql`SUM(${budgetDetailsInFinanceProject.amount3})`.as("amount3"),
                        amount4: sql`SUM(${budgetDetailsInFinanceProject.amount4})`.as("amount4"),
                        rate1: sql`SUM(${budgetDetailsInFinanceProject.rate1})`.as("rate1"),
                        rate2: sql`SUM(${budgetDetailsInFinanceProject.rate2})`.as("rate2"),
                        rate3: sql`SUM(${budgetDetailsInFinanceProject.rate3})`.as("rate3"),
                        rate4: sql`SUM(${budgetDetailsInFinanceProject.rate4})`.as("rate4"),
                        qty1: sql`SUM(${budgetDetailsInFinanceProject.qty1})`.as("qty1"),
                        qty2: sql`SUM(${budgetDetailsInFinanceProject.qty2})`.as("qty2"),
                        qty3: sql`SUM(${budgetDetailsInFinanceProject.qty3})`.as("qty3"),
                        qty4: sql`SUM(${budgetDetailsInFinanceProject.qty4})`.as("qty4"),
                        total: sql`SUM(${budgetDetailsInFinanceProject.total})`.as("total"),
                        id: sql`SUM(${budgetDetailsInFinanceProject.total})`.as("total"),
                    })
                    .from(budgetDetailsInFinanceProject)
                    .where(and(...budgetRetrivalConditions))
                    .groupBy(budgetDetailsInFinanceProject.subcategoryId);
            }
            else {
                result = await ctx.db
                    .select()
                    .from(budgetDetailsInFinanceProject)
                    .where(and(...baseConditions));
            }
            // make a call for staff count
            const levelStatsBaseCondition = [
                // isNotNull(salaryDetailsInFinanceProject.salary),
                eq(staffMasterInFinanceProject.isactive,true)
            ]
            if (input.deptId != 0)
                levelStatsBaseCondition.push(eq(staffMasterInFinanceProject.department, input.deptId))
            if (input.subdeptId != 0)
                levelStatsBaseCondition.push(eq(staffMasterInFinanceProject.subDeptid, input.subdeptId))
            // console.log(levelStatsBaseCondition)
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
                .leftJoin(
                    salaryDetailsInFinanceProject,
                    eq(salaryDetailsInFinanceProject.empId, staffMasterInFinanceProject.id)
                )
                .where(
                    and(...levelStatsBaseCondition)
                )
                .groupBy(staffMasterInFinanceProject.level);

            return {
                subCategories, levelStats, budgetId: input.budgetId, result, subDeptId: input.subdeptId
            };

        } catch (error) {
            console.error("Error in getting staff level count:", error);
            throw new Error("Failed to get staff level count. Please try again.");
        }
    });
export const getProgramActivities = protectedProcedure
    .input(
        z.object({
            deptId: z.number(),
            budgetId: z.number(),
            catId: z.number(),
            activity: z.string().optional(),
            subDeptId: z.number(),
            financialYear: z.string(),
        })
    )
    .query(async ({ ctx, input }) => {
        try {
            // get sub categories
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
                .where(eq(categoryHierarchyInFinanceProject.parentId, input.catId));
            if (!subCategories)
                throw new Error("Failed to get the subcategories")
            // category budgetDetails call
            const baseConditions = [
                eq(budgetDetailsInFinanceProject.catid, input.catId)
            ];
            const budgetMasterbaseCondition = [
                eq(budgetMasterInFinanceProject.financialYear, input.financialYear),
            ]
            if (input.budgetId != 0)
                baseConditions.push(eq(budgetDetailsInFinanceProject.budgetid, input.budgetId),)
            if (input.deptId != 0) {
                baseConditions.push(eq(budgetDetailsInFinanceProject.deptid, input.deptId))
                budgetMasterbaseCondition.push(eq(budgetMasterInFinanceProject.departmentId, input.deptId))
            }
            if (input.subDeptId != 0)
                baseConditions.push(eq(budgetDetailsInFinanceProject.subDeptid, input.subDeptId))


            // Add activity condition if it is not null or undefined
            if (input.activity !== null && input.activity !== undefined && input.activity != "0") {
                baseConditions.push(eq(budgetDetailsInFinanceProject.activity, input.activity));
            }
            let result
            if (input.deptId == 0 || input.subDeptId == 0) {
                const budgetMasterIds = await ctx.db
                    .select({
                        id: budgetMasterInFinanceProject.id,
                    })
                    .from(budgetMasterInFinanceProject)
                    .where(and(...budgetMasterbaseCondition));
                const budgetIds = budgetMasterIds.map((record) => record.id);
                const budgetRetrivalConditions = [
                    ...baseConditions, inArray(budgetDetailsInFinanceProject.budgetid, budgetIds)
                ]
                result = await ctx.db
                    .select({
                        subcategoryId: budgetDetailsInFinanceProject.subcategoryId,
                        april: sql`SUM(${budgetDetailsInFinanceProject.april})`.as("april"),
                        may: sql`SUM(${budgetDetailsInFinanceProject.may})`.as("may"),
                        june: sql`SUM(${budgetDetailsInFinanceProject.june})`.as("june"),
                        july: sql`SUM(${budgetDetailsInFinanceProject.july})`.as("july"),
                        august: sql`SUM(${budgetDetailsInFinanceProject.august})`.as("august"),
                        september: sql`SUM(${budgetDetailsInFinanceProject.september})`.as("september"),
                        october: sql`SUM(${budgetDetailsInFinanceProject.october})`.as("october"),
                        november: sql`SUM(${budgetDetailsInFinanceProject.november})`.as("november"),
                        december: sql`SUM(${budgetDetailsInFinanceProject.december})`.as("december"),
                        january: sql`SUM(${budgetDetailsInFinanceProject.january})`.as("january"),
                        february: sql`SUM(${budgetDetailsInFinanceProject.february})`.as("february"),
                        march: sql`SUM(${budgetDetailsInFinanceProject.march})`.as("march"),
                        q1: sql`SUM(${budgetDetailsInFinanceProject.q1})`.as("q1"),
                        q2: sql`SUM(${budgetDetailsInFinanceProject.q2})`.as("q2"),
                        q3: sql`SUM(${budgetDetailsInFinanceProject.q3})`.as("q3"),
                        q4: sql`SUM(${budgetDetailsInFinanceProject.q4})`.as("q4"),
                        amount1: sql`SUM(${budgetDetailsInFinanceProject.amount1})`.as("amount1"),
                        amount2: sql`SUM(${budgetDetailsInFinanceProject.amount2})`.as("amount2"),
                        amount3: sql`SUM(${budgetDetailsInFinanceProject.amount3})`.as("amount3"),
                        amount4: sql`SUM(${budgetDetailsInFinanceProject.amount4})`.as("amount4"),
                        rate1: sql`SUM(${budgetDetailsInFinanceProject.rate1})`.as("rate1"),
                        rate2: sql`SUM(${budgetDetailsInFinanceProject.rate2})`.as("rate2"),
                        rate3: sql`SUM(${budgetDetailsInFinanceProject.rate3})`.as("rate3"),
                        rate4: sql`SUM(${budgetDetailsInFinanceProject.rate4})`.as("rate4"),
                        qty1: sql`SUM(${budgetDetailsInFinanceProject.qty1})`.as("qty1"),
                        qty2: sql`SUM(${budgetDetailsInFinanceProject.qty2})`.as("qty2"),
                        qty3: sql`SUM(${budgetDetailsInFinanceProject.qty3})`.as("qty3"),
                        qty4: sql`SUM(${budgetDetailsInFinanceProject.qty4})`.as("qty4"),
                        total: sql`SUM(${budgetDetailsInFinanceProject.total})`.as("total"),
                        id: sql`SUM(${budgetDetailsInFinanceProject.total})`.as("total"),
                    })
                    .from(budgetDetailsInFinanceProject)
                    .where(and(...budgetRetrivalConditions))
                    .groupBy(budgetDetailsInFinanceProject.subcategoryId);
            }
            // Execute the query with all conditions
            else if (input.activity == "0") {
                result = await ctx.db
                    .select({
                        subcategoryId: budgetDetailsInFinanceProject.subcategoryId,
                        april: sql`SUM(${budgetDetailsInFinanceProject.april})`.as("april"),
                        may: sql`SUM(${budgetDetailsInFinanceProject.may})`.as("may"),
                        june: sql`SUM(${budgetDetailsInFinanceProject.june})`.as("june"),
                        july: sql`SUM(${budgetDetailsInFinanceProject.july})`.as("july"),
                        august: sql`SUM(${budgetDetailsInFinanceProject.august})`.as("august"),
                        september: sql`SUM(${budgetDetailsInFinanceProject.september})`.as("september"),
                        october: sql`SUM(${budgetDetailsInFinanceProject.october})`.as("october"),
                        november: sql`SUM(${budgetDetailsInFinanceProject.november})`.as("november"),
                        december: sql`SUM(${budgetDetailsInFinanceProject.december})`.as("december"),
                        january: sql`SUM(${budgetDetailsInFinanceProject.january})`.as("january"),
                        february: sql`SUM(${budgetDetailsInFinanceProject.february})`.as("february"),
                        march: sql`SUM(${budgetDetailsInFinanceProject.march})`.as("march"),
                        q1: sql`SUM(${budgetDetailsInFinanceProject.q1})`.as("q1"),
                        q2: sql`SUM(${budgetDetailsInFinanceProject.q2})`.as("q2"),
                        q3: sql`SUM(${budgetDetailsInFinanceProject.q3})`.as("q3"),
                        q4: sql`SUM(${budgetDetailsInFinanceProject.q4})`.as("q4"),
                        amount1: sql`SUM(${budgetDetailsInFinanceProject.amount1})`.as("amount1"),
                        amount2: sql`SUM(${budgetDetailsInFinanceProject.amount2})`.as("amount2"),
                        amount3: sql`SUM(${budgetDetailsInFinanceProject.amount3})`.as("amount3"),
                        amount4: sql`SUM(${budgetDetailsInFinanceProject.amount4})`.as("amount4"),
                        rate1: sql`SUM(${budgetDetailsInFinanceProject.rate1})`.as("rate1"),
                        rate2: sql`SUM(${budgetDetailsInFinanceProject.rate2})`.as("rate2"),
                        rate3: sql`SUM(${budgetDetailsInFinanceProject.rate3})`.as("rate3"),
                        rate4: sql`SUM(${budgetDetailsInFinanceProject.rate4})`.as("rate4"),
                        qty1: sql`SUM(${budgetDetailsInFinanceProject.qty1})`.as("qty1"),
                        qty2: sql`SUM(${budgetDetailsInFinanceProject.qty2})`.as("qty2"),
                        qty3: sql`SUM(${budgetDetailsInFinanceProject.qty3})`.as("qty3"),
                        qty4: sql`SUM(${budgetDetailsInFinanceProject.qty4})`.as("qty4"),
                        total: sql`SUM(${budgetDetailsInFinanceProject.total})`.as("total"),
                        id: sql`SUM(${budgetDetailsInFinanceProject.total})`.as("total"),
                    })
                    .from(budgetDetailsInFinanceProject)
                    .where(and(...baseConditions))
                    .groupBy(budgetDetailsInFinanceProject.subcategoryId);
            }
            else {
                result = await ctx.db
                    .select()
                    .from(budgetDetailsInFinanceProject)
                    .where(and(...baseConditions));
            }
            const activityTotalCondition = [
                eq(budgetDetailsInFinanceProject.catid,input.catId)
            ]
            if(input.deptId == 0)
            {
                const budgetMasterIds = await ctx.db
                    .select({
                        id: budgetMasterInFinanceProject.id,
                    })
                    .from(budgetMasterInFinanceProject)
                    .where(and(...budgetMasterbaseCondition));
                const budgetIds = budgetMasterIds.map((record) => record.id);
                activityTotalCondition.push(inArray(budgetDetailsInFinanceProject.budgetid, budgetIds))
            }
            else{
                activityTotalCondition.push(eq(budgetDetailsInFinanceProject.deptid,input.deptId))
            }
            if(input.subDeptId != 0)
                activityTotalCondition.push(eq(budgetDetailsInFinanceProject.subDeptid,input.subDeptId))
            const activityTotals = await ctx.db.select({
                q1: sql`SUM(${budgetDetailsInFinanceProject.q1})`.as("q1"),
                q2: sql`SUM(${budgetDetailsInFinanceProject.q2})`.as("q2"),
                q3: sql`SUM(${budgetDetailsInFinanceProject.q3})`.as("q3"),
                q4: sql`SUM(${budgetDetailsInFinanceProject.q4})`.as("q4"),
                activityId:budgetDetailsInFinanceProject.activity
            }).from(budgetDetailsInFinanceProject)
            .where(and(...activityTotalCondition))
            .groupBy(budgetDetailsInFinanceProject.activity)
            return {
                subCategories, budgetId: input.budgetId, result, subDeptId: input.subDeptId, activityTotals
            };

        } catch (error) {
            console.error("Error in getting staff level count:", error);
            throw new Error("Failed to get staff level count. Please try again.");
        }
    });
export const getTravelCatDetials = protectedProcedure
    .input(
        z.object({
            deptId: z.number(),
            budgetId: z.number(),
            catId: z.number(),
            travel_typeid: z.number().optional(),
            searchSubCatId: z.number(),
            subDeptId: z.number(),
            financialYear: z.string(),
        })
    )
    .query(async ({ ctx, input }) => {
        try {
            // get sub categories
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
                .where(eq(categoryHierarchyInFinanceProject.parentId, input.searchSubCatId));
            if (!subCategories)
                throw new Error("Failed to get the subcategories")
            // category budgetDetails call
            const baseConditions = [
                eq(budgetDetailsInFinanceProject.catid, input.catId)
            ];
            const budgetMasterbaseCondition = [
                eq(budgetMasterInFinanceProject.financialYear, input.financialYear),
            ]
            if (input.budgetId != 0)
                baseConditions.push(eq(budgetDetailsInFinanceProject.budgetid, input.budgetId),)
            if (input.deptId != 0) {
                baseConditions.push(eq(budgetDetailsInFinanceProject.deptid, input.deptId))
                budgetMasterbaseCondition.push(eq(budgetMasterInFinanceProject.departmentId, input.deptId))
            }
            if (input.subDeptId != 0)
                baseConditions.push(eq(budgetDetailsInFinanceProject.subDeptid, input.subDeptId))
            // Add activity condition if it is not null or undefined
            if (input.travel_typeid !== null && input.travel_typeid !== undefined && input.travel_typeid != 0) {
                baseConditions.push(eq(budgetDetailsInFinanceProject.travelTypeid, input.travel_typeid));
            }
            let result
            // Execute the query with all conditions
            if (input.deptId == 0 || input.subDeptId == 0) {
                const budgetMasterIds = await ctx.db
                    .select({
                        id: budgetMasterInFinanceProject.id,
                    })
                    .from(budgetMasterInFinanceProject)
                    .where(and(...budgetMasterbaseCondition));
                const budgetIds = budgetMasterIds.map((record) => record.id);
                const budgetRetrivalConditions = [
                    ...baseConditions, inArray(budgetDetailsInFinanceProject.budgetid, budgetIds)
                ]
                result = await ctx.db
                    .select({
                        subcategoryId: budgetDetailsInFinanceProject.subcategoryId,
                        april: sql`SUM(${budgetDetailsInFinanceProject.april})`.as("april"),
                        may: sql`SUM(${budgetDetailsInFinanceProject.may})`.as("may"),
                        june: sql`SUM(${budgetDetailsInFinanceProject.june})`.as("june"),
                        july: sql`SUM(${budgetDetailsInFinanceProject.july})`.as("july"),
                        august: sql`SUM(${budgetDetailsInFinanceProject.august})`.as("august"),
                        september: sql`SUM(${budgetDetailsInFinanceProject.september})`.as("september"),
                        october: sql`SUM(${budgetDetailsInFinanceProject.october})`.as("october"),
                        november: sql`SUM(${budgetDetailsInFinanceProject.november})`.as("november"),
                        december: sql`SUM(${budgetDetailsInFinanceProject.december})`.as("december"),
                        january: sql`SUM(${budgetDetailsInFinanceProject.january})`.as("january"),
                        february: sql`SUM(${budgetDetailsInFinanceProject.february})`.as("february"),
                        march: sql`SUM(${budgetDetailsInFinanceProject.march})`.as("march"),
                        q1: sql`SUM(${budgetDetailsInFinanceProject.q1})`.as("q1"),
                        q2: sql`SUM(${budgetDetailsInFinanceProject.q2})`.as("q2"),
                        q3: sql`SUM(${budgetDetailsInFinanceProject.q3})`.as("q3"),
                        q4: sql`SUM(${budgetDetailsInFinanceProject.q4})`.as("q4"),
                        amount1: sql`SUM(${budgetDetailsInFinanceProject.amount1})`.as("amount1"),
                        amount2: sql`SUM(${budgetDetailsInFinanceProject.amount2})`.as("amount2"),
                        amount3: sql`SUM(${budgetDetailsInFinanceProject.amount3})`.as("amount3"),
                        amount4: sql`SUM(${budgetDetailsInFinanceProject.amount4})`.as("amount4"),
                        rate1: sql`SUM(${budgetDetailsInFinanceProject.rate1})`.as("rate1"),
                        rate2: sql`SUM(${budgetDetailsInFinanceProject.rate2})`.as("rate2"),
                        rate3: sql`SUM(${budgetDetailsInFinanceProject.rate3})`.as("rate3"),
                        rate4: sql`SUM(${budgetDetailsInFinanceProject.rate4})`.as("rate4"),
                        qty1: sql`SUM(${budgetDetailsInFinanceProject.qty1})`.as("qty1"),
                        qty2: sql`SUM(${budgetDetailsInFinanceProject.qty2})`.as("qty2"),
                        qty3: sql`SUM(${budgetDetailsInFinanceProject.qty3})`.as("qty3"),
                        qty4: sql`SUM(${budgetDetailsInFinanceProject.qty4})`.as("qty4"),
                        total: sql`SUM(${budgetDetailsInFinanceProject.total})`.as("total"),
                        id: sql`SUM(${budgetDetailsInFinanceProject.total})`.as("total"),
                    })
                    .from(budgetDetailsInFinanceProject)
                    .where(and(...budgetRetrivalConditions))
                    .groupBy(budgetDetailsInFinanceProject.subcategoryId);
            }
            else if (input.travel_typeid == 0) {
                result = await ctx.db
                    .select({
                        subcategoryId: budgetDetailsInFinanceProject.subcategoryId,
                        april: sql`SUM(${budgetDetailsInFinanceProject.april})`.as("april"),
                        may: sql`SUM(${budgetDetailsInFinanceProject.may})`.as("may"),
                        june: sql`SUM(${budgetDetailsInFinanceProject.june})`.as("june"),
                        july: sql`SUM(${budgetDetailsInFinanceProject.july})`.as("july"),
                        august: sql`SUM(${budgetDetailsInFinanceProject.august})`.as("august"),
                        september: sql`SUM(${budgetDetailsInFinanceProject.september})`.as("september"),
                        october: sql`SUM(${budgetDetailsInFinanceProject.october})`.as("october"),
                        november: sql`SUM(${budgetDetailsInFinanceProject.november})`.as("november"),
                        december: sql`SUM(${budgetDetailsInFinanceProject.december})`.as("december"),
                        january: sql`SUM(${budgetDetailsInFinanceProject.january})`.as("january"),
                        february: sql`SUM(${budgetDetailsInFinanceProject.february})`.as("february"),
                        march: sql`SUM(${budgetDetailsInFinanceProject.march})`.as("march"),
                        q1: sql`SUM(${budgetDetailsInFinanceProject.q1})`.as("q1"),
                        q2: sql`SUM(${budgetDetailsInFinanceProject.q2})`.as("q2"),
                        q3: sql`SUM(${budgetDetailsInFinanceProject.q3})`.as("q3"),
                        q4: sql`SUM(${budgetDetailsInFinanceProject.q4})`.as("q4"),
                        amount1: sql`SUM(${budgetDetailsInFinanceProject.amount1})`.as("amount1"),
                        amount2: sql`SUM(${budgetDetailsInFinanceProject.amount2})`.as("amount2"),
                        amount3: sql`SUM(${budgetDetailsInFinanceProject.amount3})`.as("amount3"),
                        amount4: sql`SUM(${budgetDetailsInFinanceProject.amount4})`.as("amount4"),
                        rate1: sql`SUM(${budgetDetailsInFinanceProject.rate1})`.as("rate1"),
                        rate2: sql`SUM(${budgetDetailsInFinanceProject.rate2})`.as("rate2"),
                        rate3: sql`SUM(${budgetDetailsInFinanceProject.rate3})`.as("rate3"),
                        rate4: sql`SUM(${budgetDetailsInFinanceProject.rate4})`.as("rate4"),
                        qty1: sql`SUM(${budgetDetailsInFinanceProject.qty1})`.as("qty1"),
                        qty2: sql`SUM(${budgetDetailsInFinanceProject.qty2})`.as("qty2"),
                        qty3: sql`SUM(${budgetDetailsInFinanceProject.qty3})`.as("qty3"),
                        qty4: sql`SUM(${budgetDetailsInFinanceProject.qty4})`.as("qty4"),
                        total: sql`SUM(${budgetDetailsInFinanceProject.total})`.as("total"),
                        id: sql`SUM(${budgetDetailsInFinanceProject.total})`.as("total"),
                    })
                    .from(budgetDetailsInFinanceProject)
                    .where(and(...baseConditions))
                    .groupBy(budgetDetailsInFinanceProject.subcategoryId);
            }
            else {
                result = await ctx.db
                    .select()
                    .from(budgetDetailsInFinanceProject)
                    .where(and(...baseConditions));
            }
            // retriew the personal data also 
            const personalData = await ctx.db
                .select()
                .from(budgetDetailsInFinanceProject)
                .where(and(eq(budgetDetailsInFinanceProject.deptid, input.deptId),
                    eq(budgetDetailsInFinanceProject.budgetid, input.budgetId),
                    eq(budgetDetailsInFinanceProject.catid, input.searchSubCatId),
                    eq(budgetDetailsInFinanceProject.subDeptid, input.subDeptId)),

                )
            // make a call for staff count
            const levelStatsBaseCondition = [
                // isNotNull(salaryDetailsInFinanceProject.salary),
                eq(staffMasterInFinanceProject.isactive, true)
            ]
            if (input.deptId != 0)
                levelStatsBaseCondition.push(eq(staffMasterInFinanceProject.department, input.deptId))
            if (input.subDeptId != 0)
                levelStatsBaseCondition.push(eq(staffMasterInFinanceProject.subDeptid, input.subDeptId))
            const levelStats = await ctx.db
                .select({
                    level: staffMasterInFinanceProject.level,
                    employeeCount: sql<number>`COUNT(${staffMasterInFinanceProject.id})`.as("employee_count"),
                })
                .from(staffMasterInFinanceProject)
                .leftJoin(
                    salaryDetailsInFinanceProject,
                    eq(salaryDetailsInFinanceProject.empId, staffMasterInFinanceProject.id)
                )
                .where(
                    and(...levelStatsBaseCondition)
                )
                .groupBy(staffMasterInFinanceProject.level);
            const travelTypesTotalCondition = [
                eq(budgetDetailsInFinanceProject.catid, input.catId)
            ]
            if (input.deptId == 0) {
                const budgetMasterIds = await ctx.db
                    .select({
                        id: budgetMasterInFinanceProject.id,
                    })
                    .from(budgetMasterInFinanceProject)
                    .where(and(...budgetMasterbaseCondition));
                const budgetIds = budgetMasterIds.map((record) => record.id);
                travelTypesTotalCondition.push(inArray(budgetDetailsInFinanceProject.budgetid, budgetIds))
            }
            else {
                travelTypesTotalCondition.push(eq(budgetDetailsInFinanceProject.deptid, input.deptId))
            }
            if (input.subDeptId != 0)
                travelTypesTotalCondition.push(eq(budgetDetailsInFinanceProject.subDeptid, input.subDeptId))
            const travelTypesTotal = await ctx.db.select({
                q1: sql`SUM(${budgetDetailsInFinanceProject.q1})`.as("q1"),
                q2: sql`SUM(${budgetDetailsInFinanceProject.q2})`.as("q2"),
                q3: sql`SUM(${budgetDetailsInFinanceProject.q3})`.as("q3"),
                q4: sql`SUM(${budgetDetailsInFinanceProject.q4})`.as("q4"),
                travelTypeId: budgetDetailsInFinanceProject.travelTypeid
            }).from(budgetDetailsInFinanceProject)
                .where(and(...travelTypesTotalCondition))
                .groupBy(budgetDetailsInFinanceProject.travelTypeid)

            return {
                subCategories, levelStats, budgetId: input.budgetId, result, personalData, subDeptId: input.subDeptId, travelTypesTotal
            };

        } catch (error) {
            console.error("Error in getting staff level count:", error);
            throw new Error("Failed to get staff level count. Please try again.");
        }
    });
export const getProgramOfficeData = protectedProcedure
    .input(
        z.object({
            deptId: z.number(),
            budgetId: z.number(),
            catId: z.number(),
            activity: z.string().optional(),
            subDeptId: z.number(),
            financialYear: z.string(),
        })
    )
    .query(async ({ ctx, input }) => {
        try {
            // get sub categories
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
                .where(eq(categoryHierarchyInFinanceProject.parentId, input.catId));
            if (!subCategories)
                throw new Error("Failed to get the subcategories")
            // category budgetDetails call
            const baseConditions = [
                eq(budgetDetailsInFinanceProject.catid, input.catId)
            ];
            const budgetMasterbaseCondition = [
                eq(budgetMasterInFinanceProject.financialYear, input.financialYear),
            ]
            if (input.budgetId != 0)
                baseConditions.push(eq(budgetDetailsInFinanceProject.budgetid, input.budgetId),)
            if (input.deptId != 0) {
                baseConditions.push(eq(budgetDetailsInFinanceProject.deptid, input.deptId))
                budgetMasterbaseCondition.push(eq(budgetMasterInFinanceProject.departmentId, input.deptId))
            }
            if (input.subDeptId != 0)
                baseConditions.push(eq(budgetDetailsInFinanceProject.subDeptid, input.subDeptId))

            // Add activity condition if it is not null or undefined
            if (input.activity !== null && input.activity !== undefined && input.activity != "0") {
                baseConditions.push(eq(budgetDetailsInFinanceProject.activity, input.activity));
            }
            let result
            // Execute the query with all conditions
            if (input.activity == "0") {
                result = await ctx.db
                    .select({
                        subcategoryId: budgetDetailsInFinanceProject.subcategoryId,
                        april: sql`SUM(${budgetDetailsInFinanceProject.april})`.as("april"),
                        may: sql`SUM(${budgetDetailsInFinanceProject.may})`.as("may"),
                        june: sql`SUM(${budgetDetailsInFinanceProject.june})`.as("june"),
                        july: sql`SUM(${budgetDetailsInFinanceProject.july})`.as("july"),
                        august: sql`SUM(${budgetDetailsInFinanceProject.august})`.as("august"),
                        september: sql`SUM(${budgetDetailsInFinanceProject.september})`.as("september"),
                        october: sql`SUM(${budgetDetailsInFinanceProject.october})`.as("october"),
                        november: sql`SUM(${budgetDetailsInFinanceProject.november})`.as("november"),
                        december: sql`SUM(${budgetDetailsInFinanceProject.december})`.as("december"),
                        january: sql`SUM(${budgetDetailsInFinanceProject.january})`.as("january"),
                        february: sql`SUM(${budgetDetailsInFinanceProject.february})`.as("february"),
                        march: sql`SUM(${budgetDetailsInFinanceProject.march})`.as("march"),
                        q1: sql`SUM(${budgetDetailsInFinanceProject.q1})`.as("q1"),
                        q2: sql`SUM(${budgetDetailsInFinanceProject.q2})`.as("q2"),
                        q3: sql`SUM(${budgetDetailsInFinanceProject.q3})`.as("q3"),
                        q4: sql`SUM(${budgetDetailsInFinanceProject.q4})`.as("q4"),
                        amount1: sql`SUM(${budgetDetailsInFinanceProject.amount1})`.as("amount1"),
                        amount2: sql`SUM(${budgetDetailsInFinanceProject.amount2})`.as("amount2"),
                        amount3: sql`SUM(${budgetDetailsInFinanceProject.amount3})`.as("amount3"),
                        amount4: sql`SUM(${budgetDetailsInFinanceProject.amount4})`.as("amount4"),
                        rate1: sql`SUM(${budgetDetailsInFinanceProject.rate1})`.as("rate1"),
                        rate2: sql`SUM(${budgetDetailsInFinanceProject.rate2})`.as("rate2"),
                        rate3: sql`SUM(${budgetDetailsInFinanceProject.rate3})`.as("rate3"),
                        rate4: sql`SUM(${budgetDetailsInFinanceProject.rate4})`.as("rate4"),
                        qty1: sql`SUM(${budgetDetailsInFinanceProject.qty1})`.as("qty1"),
                        qty2: sql`SUM(${budgetDetailsInFinanceProject.qty2})`.as("qty2"),
                        qty3: sql`SUM(${budgetDetailsInFinanceProject.qty3})`.as("qty3"),
                        qty4: sql`SUM(${budgetDetailsInFinanceProject.qty4})`.as("qty4"),
                        total: sql`SUM(${budgetDetailsInFinanceProject.total})`.as("total"),
                        id: sql`SUM(${budgetDetailsInFinanceProject.total})`.as("total"),
                    })
                    .from(budgetDetailsInFinanceProject)
                    .where(and(...baseConditions))
                    .groupBy(budgetDetailsInFinanceProject.subcategoryId);
            }
            else if (input.deptId == 0 || input.subDeptId == 0) {
                const budgetMasterIds = await ctx.db
                    .select({
                        id: budgetMasterInFinanceProject.id,
                    })
                    .from(budgetMasterInFinanceProject)
                    .where(and(...budgetMasterbaseCondition));
                const budgetIds = budgetMasterIds.map((record) => record.id);
                const budgetRetrivalConditions = [
                    ...baseConditions, inArray(budgetDetailsInFinanceProject.budgetid, budgetIds)
                ]
                result = await ctx.db
                    .select({
                        subcategoryId: budgetDetailsInFinanceProject.subcategoryId,
                        april: sql`SUM(${budgetDetailsInFinanceProject.april})`.as("april"),
                        may: sql`SUM(${budgetDetailsInFinanceProject.may})`.as("may"),
                        june: sql`SUM(${budgetDetailsInFinanceProject.june})`.as("june"),
                        july: sql`SUM(${budgetDetailsInFinanceProject.july})`.as("july"),
                        august: sql`SUM(${budgetDetailsInFinanceProject.august})`.as("august"),
                        september: sql`SUM(${budgetDetailsInFinanceProject.september})`.as("september"),
                        october: sql`SUM(${budgetDetailsInFinanceProject.october})`.as("october"),
                        november: sql`SUM(${budgetDetailsInFinanceProject.november})`.as("november"),
                        december: sql`SUM(${budgetDetailsInFinanceProject.december})`.as("december"),
                        january: sql`SUM(${budgetDetailsInFinanceProject.january})`.as("january"),
                        february: sql`SUM(${budgetDetailsInFinanceProject.february})`.as("february"),
                        march: sql`SUM(${budgetDetailsInFinanceProject.march})`.as("march"),
                        q1: sql`SUM(${budgetDetailsInFinanceProject.q1})`.as("q1"),
                        q2: sql`SUM(${budgetDetailsInFinanceProject.q2})`.as("q2"),
                        q3: sql`SUM(${budgetDetailsInFinanceProject.q3})`.as("q3"),
                        q4: sql`SUM(${budgetDetailsInFinanceProject.q4})`.as("q4"),
                        amount1: sql`SUM(${budgetDetailsInFinanceProject.amount1})`.as("amount1"),
                        amount2: sql`SUM(${budgetDetailsInFinanceProject.amount2})`.as("amount2"),
                        amount3: sql`SUM(${budgetDetailsInFinanceProject.amount3})`.as("amount3"),
                        amount4: sql`SUM(${budgetDetailsInFinanceProject.amount4})`.as("amount4"),
                        rate1: sql`SUM(${budgetDetailsInFinanceProject.rate1})`.as("rate1"),
                        rate2: sql`SUM(${budgetDetailsInFinanceProject.rate2})`.as("rate2"),
                        rate3: sql`SUM(${budgetDetailsInFinanceProject.rate3})`.as("rate3"),
                        rate4: sql`SUM(${budgetDetailsInFinanceProject.rate4})`.as("rate4"),
                        qty1: sql`SUM(${budgetDetailsInFinanceProject.qty1})`.as("qty1"),
                        qty2: sql`SUM(${budgetDetailsInFinanceProject.qty2})`.as("qty2"),
                        qty3: sql`SUM(${budgetDetailsInFinanceProject.qty3})`.as("qty3"),
                        qty4: sql`SUM(${budgetDetailsInFinanceProject.qty4})`.as("qty4"),
                        total: sql`SUM(${budgetDetailsInFinanceProject.total})`.as("total"),
                        id: sql`SUM(${budgetDetailsInFinanceProject.total})`.as("total"),
                    })
                    .from(budgetDetailsInFinanceProject)
                    .where(and(...budgetRetrivalConditions))
                    .groupBy(budgetDetailsInFinanceProject.subcategoryId);
            }
            else {
                result = await ctx.db
                    .select()
                    .from(budgetDetailsInFinanceProject)
                    .where(and(...baseConditions));
            }

            return {
                subCategories, budgetId: input.budgetId, result, subDeptId: input.subDeptId
            };

        } catch (error) {
            console.error("Error in getting staff level count:", error);
            throw new Error("Failed to get staff level count. Please try again.");
        }
    });
export const getCapitalCostData = protectedProcedure
    .input(
        z.object({
            deptId: z.number(),
            budgetId: z.number(),
            catId: z.number(),
            activity: z.string().optional(),
            subDeptId: z.number(),
            financialYear: z.string(),
        })
    )
    .query(async ({ ctx, input }) => {
        try {
            // get sub categories
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
                .where(eq(categoryHierarchyInFinanceProject.parentId, input.catId));
            if (!subCategories)
                throw new Error("Failed to get the subcategories")
            // category budgetDetails call
            const baseConditions = [
                eq(budgetDetailsInFinanceProject.catid, input.catId)
            ];
            const budgetMasterbaseCondition = [
                eq(budgetMasterInFinanceProject.financialYear, input.financialYear),
            ]
            if (input.budgetId != 0)
                baseConditions.push(eq(budgetDetailsInFinanceProject.budgetid, input.budgetId),)
            if (input.deptId != 0) {
                baseConditions.push(eq(budgetDetailsInFinanceProject.deptid, input.deptId))
                budgetMasterbaseCondition.push(eq(budgetMasterInFinanceProject.departmentId, input.deptId))
            }
            if (input.subDeptId != 0)
                baseConditions.push(eq(budgetDetailsInFinanceProject.subDeptid, input.subDeptId))

            // Add activity condition if it is not null or undefined
            if (input.activity !== null && input.activity !== undefined && input.activity != "0") {
                baseConditions.push(eq(budgetDetailsInFinanceProject.activity, input.activity));
            }
            let result
            // Execute the query with all conditions
            if (input.activity == "0") {
                result = await ctx.db
                    .select({
                        subcategoryId: budgetDetailsInFinanceProject.subcategoryId,
                        april: sql`SUM(${budgetDetailsInFinanceProject.april})`.as("april"),
                        may: sql`SUM(${budgetDetailsInFinanceProject.may})`.as("may"),
                        june: sql`SUM(${budgetDetailsInFinanceProject.june})`.as("june"),
                        july: sql`SUM(${budgetDetailsInFinanceProject.july})`.as("july"),
                        august: sql`SUM(${budgetDetailsInFinanceProject.august})`.as("august"),
                        september: sql`SUM(${budgetDetailsInFinanceProject.september})`.as("september"),
                        october: sql`SUM(${budgetDetailsInFinanceProject.october})`.as("october"),
                        november: sql`SUM(${budgetDetailsInFinanceProject.november})`.as("november"),
                        december: sql`SUM(${budgetDetailsInFinanceProject.december})`.as("december"),
                        january: sql`SUM(${budgetDetailsInFinanceProject.january})`.as("january"),
                        february: sql`SUM(${budgetDetailsInFinanceProject.february})`.as("february"),
                        march: sql`SUM(${budgetDetailsInFinanceProject.march})`.as("march"),
                        q1: sql`SUM(${budgetDetailsInFinanceProject.q1})`.as("q1"),
                        q2: sql`SUM(${budgetDetailsInFinanceProject.q2})`.as("q2"),
                        q3: sql`SUM(${budgetDetailsInFinanceProject.q3})`.as("q3"),
                        q4: sql`SUM(${budgetDetailsInFinanceProject.q4})`.as("q4"),
                        amount1: sql`SUM(${budgetDetailsInFinanceProject.amount1})`.as("amount1"),
                        amount2: sql`SUM(${budgetDetailsInFinanceProject.amount2})`.as("amount2"),
                        amount3: sql`SUM(${budgetDetailsInFinanceProject.amount3})`.as("amount3"),
                        amount4: sql`SUM(${budgetDetailsInFinanceProject.amount4})`.as("amount4"),
                        rate1: sql`SUM(${budgetDetailsInFinanceProject.rate1})`.as("rate1"),
                        rate2: sql`SUM(${budgetDetailsInFinanceProject.rate2})`.as("rate2"),
                        rate3: sql`SUM(${budgetDetailsInFinanceProject.rate3})`.as("rate3"),
                        rate4: sql`SUM(${budgetDetailsInFinanceProject.rate4})`.as("rate4"),
                        qty1: sql`SUM(${budgetDetailsInFinanceProject.qty1})`.as("qty1"),
                        qty2: sql`SUM(${budgetDetailsInFinanceProject.qty2})`.as("qty2"),
                        qty3: sql`SUM(${budgetDetailsInFinanceProject.qty3})`.as("qty3"),
                        qty4: sql`SUM(${budgetDetailsInFinanceProject.qty4})`.as("qty4"),
                        total: sql`SUM(${budgetDetailsInFinanceProject.total})`.as("total"),
                        id: sql`SUM(${budgetDetailsInFinanceProject.total})`.as("total"),
                    })
                    .from(budgetDetailsInFinanceProject)
                    .where(and(...baseConditions))
                    .groupBy(budgetDetailsInFinanceProject.subcategoryId);
            }
            else if (input.deptId == 0 || input.subDeptId == 0) {
                const budgetMasterIds = await ctx.db
                    .select({
                        id: budgetMasterInFinanceProject.id,
                    })
                    .from(budgetMasterInFinanceProject)
                    .where(and(...budgetMasterbaseCondition));
                const budgetIds = budgetMasterIds.map((record) => record.id);
                const budgetRetrivalConditions = [
                    ...baseConditions, inArray(budgetDetailsInFinanceProject.budgetid, budgetIds)
                ]
                result = await ctx.db
                    .select({
                        subcategoryId: budgetDetailsInFinanceProject.subcategoryId,
                        april: sql`SUM(${budgetDetailsInFinanceProject.april})`.as("april"),
                        may: sql`SUM(${budgetDetailsInFinanceProject.may})`.as("may"),
                        june: sql`SUM(${budgetDetailsInFinanceProject.june})`.as("june"),
                        july: sql`SUM(${budgetDetailsInFinanceProject.july})`.as("july"),
                        august: sql`SUM(${budgetDetailsInFinanceProject.august})`.as("august"),
                        september: sql`SUM(${budgetDetailsInFinanceProject.september})`.as("september"),
                        october: sql`SUM(${budgetDetailsInFinanceProject.october})`.as("october"),
                        november: sql`SUM(${budgetDetailsInFinanceProject.november})`.as("november"),
                        december: sql`SUM(${budgetDetailsInFinanceProject.december})`.as("december"),
                        january: sql`SUM(${budgetDetailsInFinanceProject.january})`.as("january"),
                        february: sql`SUM(${budgetDetailsInFinanceProject.february})`.as("february"),
                        march: sql`SUM(${budgetDetailsInFinanceProject.march})`.as("march"),
                        q1: sql`SUM(${budgetDetailsInFinanceProject.q1})`.as("q1"),
                        q2: sql`SUM(${budgetDetailsInFinanceProject.q2})`.as("q2"),
                        q3: sql`SUM(${budgetDetailsInFinanceProject.q3})`.as("q3"),
                        q4: sql`SUM(${budgetDetailsInFinanceProject.q4})`.as("q4"),
                        amount1: sql`SUM(${budgetDetailsInFinanceProject.amount1})`.as("amount1"),
                        amount2: sql`SUM(${budgetDetailsInFinanceProject.amount2})`.as("amount2"),
                        amount3: sql`SUM(${budgetDetailsInFinanceProject.amount3})`.as("amount3"),
                        amount4: sql`SUM(${budgetDetailsInFinanceProject.amount4})`.as("amount4"),
                        rate1: sql`SUM(${budgetDetailsInFinanceProject.rate1})`.as("rate1"),
                        rate2: sql`SUM(${budgetDetailsInFinanceProject.rate2})`.as("rate2"),
                        rate3: sql`SUM(${budgetDetailsInFinanceProject.rate3})`.as("rate3"),
                        rate4: sql`SUM(${budgetDetailsInFinanceProject.rate4})`.as("rate4"),
                        qty1: sql`SUM(${budgetDetailsInFinanceProject.qty1})`.as("qty1"),
                        qty2: sql`SUM(${budgetDetailsInFinanceProject.qty2})`.as("qty2"),
                        qty3: sql`SUM(${budgetDetailsInFinanceProject.qty3})`.as("qty3"),
                        qty4: sql`SUM(${budgetDetailsInFinanceProject.qty4})`.as("qty4"),
                        total: sql`SUM(${budgetDetailsInFinanceProject.total})`.as("total"),
                        id: sql`SUM(${budgetDetailsInFinanceProject.total})`.as("total"),
                    })
                    .from(budgetDetailsInFinanceProject)
                    .where(and(...budgetRetrivalConditions))
                    .groupBy(budgetDetailsInFinanceProject.subcategoryId);
            }
            else {
                result = await ctx.db
                    .select()
                    .from(budgetDetailsInFinanceProject)
                    .where(and(...baseConditions));
            }

            return {
                subCategories, budgetId: input.budgetId, result, subDeptId: input.subDeptId
            };

        } catch (error) {
            console.error("Error in getting staff level count:", error);
            throw new Error("Failed to get staff level count. Please try again.");
        }
    });
export const getOverHeadsData = protectedProcedure
    .input(
        z.object({
            deptId: z.number(),
            budgetId: z.number(),
            catId: z.number(),
            activity: z.string().optional(),
            subDeptId: z.number(),
            financialYear: z.string(),
        })
    )
    .query(async ({ ctx, input }) => {
        try {
            // get sub categories
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
                .where(eq(categoryHierarchyInFinanceProject.parentId, input.catId));
            if (!subCategories)
                throw new Error("Failed to get the subcategories")
            // category budgetDetails call
            const baseConditions = [
                eq(budgetDetailsInFinanceProject.catid, input.catId)
            ];
            const budgetMasterbaseCondition = [
                eq(budgetMasterInFinanceProject.financialYear, input.financialYear),
            ]
            if (input.budgetId != 0)
                baseConditions.push(eq(budgetDetailsInFinanceProject.budgetid, input.budgetId),)
            if (input.deptId != 0) {
                baseConditions.push(eq(budgetDetailsInFinanceProject.deptid, input.deptId))
                budgetMasterbaseCondition.push(eq(budgetMasterInFinanceProject.departmentId, input.deptId))
            }
            if (input.subDeptId != 0)
                baseConditions.push(eq(budgetDetailsInFinanceProject.subDeptid, input.subDeptId))

            // Add activity condition if it is not null or undefined
            if (input.activity !== null && input.activity !== undefined && input.activity != "0") {
                baseConditions.push(eq(budgetDetailsInFinanceProject.activity, input.activity));
            }
            let result
            // Execute the query with all conditions
            if (input.activity == "0") {
                result = await ctx.db
                    .select({
                        subcategoryId: budgetDetailsInFinanceProject.subcategoryId,
                        april: sql`SUM(${budgetDetailsInFinanceProject.april})`.as("april"),
                        may: sql`SUM(${budgetDetailsInFinanceProject.may})`.as("may"),
                        june: sql`SUM(${budgetDetailsInFinanceProject.june})`.as("june"),
                        july: sql`SUM(${budgetDetailsInFinanceProject.july})`.as("july"),
                        august: sql`SUM(${budgetDetailsInFinanceProject.august})`.as("august"),
                        september: sql`SUM(${budgetDetailsInFinanceProject.september})`.as("september"),
                        october: sql`SUM(${budgetDetailsInFinanceProject.october})`.as("october"),
                        november: sql`SUM(${budgetDetailsInFinanceProject.november})`.as("november"),
                        december: sql`SUM(${budgetDetailsInFinanceProject.december})`.as("december"),
                        january: sql`SUM(${budgetDetailsInFinanceProject.january})`.as("january"),
                        february: sql`SUM(${budgetDetailsInFinanceProject.february})`.as("february"),
                        march: sql`SUM(${budgetDetailsInFinanceProject.march})`.as("march"),
                        q1: sql`SUM(${budgetDetailsInFinanceProject.q1})`.as("q1"),
                        q2: sql`SUM(${budgetDetailsInFinanceProject.q2})`.as("q2"),
                        q3: sql`SUM(${budgetDetailsInFinanceProject.q3})`.as("q3"),
                        q4: sql`SUM(${budgetDetailsInFinanceProject.q4})`.as("q4"),
                        amount1: sql`SUM(${budgetDetailsInFinanceProject.amount1})`.as("amount1"),
                        amount2: sql`SUM(${budgetDetailsInFinanceProject.amount2})`.as("amount2"),
                        amount3: sql`SUM(${budgetDetailsInFinanceProject.amount3})`.as("amount3"),
                        amount4: sql`SUM(${budgetDetailsInFinanceProject.amount4})`.as("amount4"),
                        rate1: sql`SUM(${budgetDetailsInFinanceProject.rate1})`.as("rate1"),
                        rate2: sql`SUM(${budgetDetailsInFinanceProject.rate2})`.as("rate2"),
                        rate3: sql`SUM(${budgetDetailsInFinanceProject.rate3})`.as("rate3"),
                        rate4: sql`SUM(${budgetDetailsInFinanceProject.rate4})`.as("rate4"),
                        qty1: sql`SUM(${budgetDetailsInFinanceProject.qty1})`.as("qty1"),
                        qty2: sql`SUM(${budgetDetailsInFinanceProject.qty2})`.as("qty2"),
                        qty3: sql`SUM(${budgetDetailsInFinanceProject.qty3})`.as("qty3"),
                        qty4: sql`SUM(${budgetDetailsInFinanceProject.qty4})`.as("qty4"),
                        total: sql`SUM(${budgetDetailsInFinanceProject.total})`.as("total"),
                        id: sql`SUM(${budgetDetailsInFinanceProject.total})`.as("total"),
                    })
                    .from(budgetDetailsInFinanceProject)
                    .where(and(...baseConditions))
                    .groupBy(budgetDetailsInFinanceProject.subcategoryId);
            }
            else if (input.deptId == 0 || input.subDeptId == 0) {
                const budgetMasterIds = await ctx.db
                    .select({
                        id: budgetMasterInFinanceProject.id,
                    })
                    .from(budgetMasterInFinanceProject)
                    .where(and(...budgetMasterbaseCondition));
                const budgetIds = budgetMasterIds.map((record) => record.id);
                const budgetRetrivalConditions = [
                    ...baseConditions, inArray(budgetDetailsInFinanceProject.budgetid, budgetIds)
                ]
                result = await ctx.db
                    .select({
                        subcategoryId: budgetDetailsInFinanceProject.subcategoryId,
                        april: sql`SUM(${budgetDetailsInFinanceProject.april})`.as("april"),
                        may: sql`SUM(${budgetDetailsInFinanceProject.may})`.as("may"),
                        june: sql`SUM(${budgetDetailsInFinanceProject.june})`.as("june"),
                        july: sql`SUM(${budgetDetailsInFinanceProject.july})`.as("july"),
                        august: sql`SUM(${budgetDetailsInFinanceProject.august})`.as("august"),
                        september: sql`SUM(${budgetDetailsInFinanceProject.september})`.as("september"),
                        october: sql`SUM(${budgetDetailsInFinanceProject.october})`.as("october"),
                        november: sql`SUM(${budgetDetailsInFinanceProject.november})`.as("november"),
                        december: sql`SUM(${budgetDetailsInFinanceProject.december})`.as("december"),
                        january: sql`SUM(${budgetDetailsInFinanceProject.january})`.as("january"),
                        february: sql`SUM(${budgetDetailsInFinanceProject.february})`.as("february"),
                        march: sql`SUM(${budgetDetailsInFinanceProject.march})`.as("march"),
                        q1: sql`SUM(${budgetDetailsInFinanceProject.q1})`.as("q1"),
                        q2: sql`SUM(${budgetDetailsInFinanceProject.q2})`.as("q2"),
                        q3: sql`SUM(${budgetDetailsInFinanceProject.q3})`.as("q3"),
                        q4: sql`SUM(${budgetDetailsInFinanceProject.q4})`.as("q4"),
                        amount1: sql`SUM(${budgetDetailsInFinanceProject.amount1})`.as("amount1"),
                        amount2: sql`SUM(${budgetDetailsInFinanceProject.amount2})`.as("amount2"),
                        amount3: sql`SUM(${budgetDetailsInFinanceProject.amount3})`.as("amount3"),
                        amount4: sql`SUM(${budgetDetailsInFinanceProject.amount4})`.as("amount4"),
                        rate1: sql`SUM(${budgetDetailsInFinanceProject.rate1})`.as("rate1"),
                        rate2: sql`SUM(${budgetDetailsInFinanceProject.rate2})`.as("rate2"),
                        rate3: sql`SUM(${budgetDetailsInFinanceProject.rate3})`.as("rate3"),
                        rate4: sql`SUM(${budgetDetailsInFinanceProject.rate4})`.as("rate4"),
                        qty1: sql`SUM(${budgetDetailsInFinanceProject.qty1})`.as("qty1"),
                        qty2: sql`SUM(${budgetDetailsInFinanceProject.qty2})`.as("qty2"),
                        qty3: sql`SUM(${budgetDetailsInFinanceProject.qty3})`.as("qty3"),
                        qty4: sql`SUM(${budgetDetailsInFinanceProject.qty4})`.as("qty4"),
                        total: sql`SUM(${budgetDetailsInFinanceProject.total})`.as("total"),
                        id: sql`SUM(${budgetDetailsInFinanceProject.total})`.as("total"),
                    })
                    .from(budgetDetailsInFinanceProject)
                    .where(and(...budgetRetrivalConditions))
                    .groupBy(budgetDetailsInFinanceProject.subcategoryId);
            }
            else {
                result = await ctx.db
                    .select()
                    .from(budgetDetailsInFinanceProject)
                    .where(and(...baseConditions));
            }

            return {
                subCategories, budgetId: input.budgetId, result, subDeptId: input.subDeptId
            };

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
// i am just updating the status without checking do we have all subcategory and activiy data
export const updateStatusBudgetDetails = protectedProcedure
    .input(z.object({
        budgetId: z.number(),
        status: z.string(),
        userId: z.number()
    }))
    .mutation(async ({ ctx, input }) => {
        const { status, budgetId, userId } = input
        const updatedStatus = await ctx.db
            .update(budgetMasterInFinanceProject)
            .set({ status, approvedBy: userId })
            .where(eq(budgetMasterInFinanceProject.id, budgetId))
        if (updatedStatus)
            return { message: "status update successfull" }
        else
            return { message: "status update was not successfull" }
    })
export const savePersonalBudgetDetails = protectedProcedure
    .input(
        z.object({
            deptId: z.number(),
            budgetId: z.number(),
            catId: z.number(),
            travelCatId: z.number(),
            subDeptId: z.number(),
            data: z.array(
                z.object({
                    budgetid: z.number(),
                    subDeptId: z.number(),
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
            const { deptId, budgetId, catId, travelCatId, data } = input;
            // Map data to include shared fields and default values
            const recordsToInsert = []
            for (const item of data) {
                const existingRecord = await ctx.db
                    .select()
                    .from(budgetDetailsInFinanceProject)
                    .where(
                        and(
                            eq(budgetDetailsInFinanceProject.budgetid, budgetId),
                            eq(budgetDetailsInFinanceProject.catid, catId),
                            eq(budgetDetailsInFinanceProject.subcategoryId, item.subcategoryId),
                            eq(budgetDetailsInFinanceProject.activity, item.activity ?? ""),
                            eq(budgetDetailsInFinanceProject.subDeptid, item.subDeptId)
                        ))
                if (!existingRecord || existingRecord.length == 0) {
                    recordsToInsert.push({
                        budgetid: budgetId,
                        catid: catId,
                        deptid: deptId,
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
                        isactive: true,
                        createdBy: item.createdBy,
                        createdAt: item.createdAt,
                        updatedAt: null,
                        updatedBy: null,
                        subDeptid: item.subDeptId,
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
                    })
                }
            }
            // Insert data using Drizzle
            const insertedRecords = await ctx.db.insert(budgetDetailsInFinanceProject).values(recordsToInsert).returning();

            const response = insertedRecords.map((record) => ({
                budgetDetailsId: record.id,
                subcategoryId: record.subcategoryId,
                categoryId: record.catid,
            }));
            // if the travel data present then we going to update that from here only 
            const travelData = await ctx.db
                .select()
                .from(budgetDetailsInFinanceProject)
                .where(and(
                    eq(budgetDetailsInFinanceProject.budgetid, budgetId),
                    eq(budgetDetailsInFinanceProject.catid, travelCatId),
                    eq(budgetDetailsInFinanceProject.subcategoryId, input.subDeptId)
                ))
            // here we need to update the values
            if (travelData && travelData.length > 0) {
                for (const item of data) {
                    const updates = {
                        currency: item.currency,
                        notes: item.notes ?? null,
                        description: item.description ?? null,
                        updatedBy: item.createdBy,
                        updatedAt: item.createdAt,
                        qty: item.qty ?? 0,
                        qty1: item.qty1 ?? 0,
                        qty2: item.qty2 ?? 0,
                        qty3: item.qty3 ?? 0,
                        qty4: item.qty4 ?? 0,
                    };
                    await ctx.db
                        .update(budgetDetailsInFinanceProject)
                        .set(updates)
                        .where(and(
                            eq(budgetDetailsInFinanceProject.budgetid, budgetId),
                            eq(budgetDetailsInFinanceProject.subcategoryId, item.subcategoryId),
                            eq(budgetDetailsInFinanceProject.catid, travelCatId),
                            eq(budgetDetailsInFinanceProject.subDeptid, input.subDeptId)
                        ));
                }
            }
            return { success: true, message: "Budget details added successfully", data: response };
        } catch (error) {
            console.error("Error in adding budget details:", error);
            throw new Error("Failed to add budget details. Please try again.");
        }
    });
export const updatePersonalBudgetDetails = protectedProcedure
    .input(
        z.object({
            deptId: z.number(),
            budgetId: z.number(),
            catId: z.number(),
            travelCatId: z.number(),
            subDeptId: z.number(),
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
            const { data, budgetId, travelCatId } = input;
            console.log(budgetId, travelCatId, input.subDeptId)

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
            const travelData = await ctx.db
                .select()
                .from(budgetDetailsInFinanceProject)
                .where(and(
                    eq(budgetDetailsInFinanceProject.budgetid, budgetId),
                    eq(budgetDetailsInFinanceProject.catid, travelCatId),
                    eq(budgetDetailsInFinanceProject.subDeptid, input.subDeptId)
                ))
            console.log(travelData)
            // here we need to update the values
            if (travelData && travelData.length > 0) {
                for (const item of data) {
                    const updates = {
                        currency: item.currency,
                        notes: item.notes ?? null,
                        description: item.description ?? null,
                        updatedBy: item.updatedBy,
                        updatedAt: item.updatedAt,
                        qty: item.qty ?? 0,
                        qty1: item.qty1 ?? 0,
                        qty2: item.qty2 ?? 0,
                        qty3: item.qty3 ?? 0,
                        qty4: item.qty4 ?? 0,
                    };
                    await ctx.db
                        .update(budgetDetailsInFinanceProject)
                        .set(updates)
                        .where(and(
                            eq(budgetDetailsInFinanceProject.budgetid, budgetId),
                            eq(budgetDetailsInFinanceProject.subcategoryId, item.subcategoryId),
                            eq(budgetDetailsInFinanceProject.catid, travelCatId),
                            eq(budgetDetailsInFinanceProject.subDeptid, input.subDeptId)
                        ));
                }
            }

            return { success: true, message: "Budget details updated successfully" };
        } catch (error) {
            console.error("Error in updating budget details:", error);
            throw new Error("Failed to update budget details. Please try again.");
        }
    });

export const getSubDepts = protectedProcedure
    .input(z.object({
        deptId: z.number()
    }))
    .query(async ({ ctx, input }) => {
        const { deptId } = input
        const baseConditions = []
        if (deptId != 0) {
            baseConditions.push(eq(departmentHierarchyInFinanceProject.parentId, deptId))
        }
        const subdepartments = await ctx.db
            .select({
                id: departmentMasterInFinanceProject.id,
                name: departmentMasterInFinanceProject.departmentname
            })
            .from(departmentMasterInFinanceProject)
            .innerJoin(departmentHierarchyInFinanceProject, eq(departmentHierarchyInFinanceProject.deptId, departmentMasterInFinanceProject.id))
            .where(and(...baseConditions))
        return { subdepartments }
    })
export const saveTravelBudgetDetails = protectedProcedure
    .input(
        z.object({
            deptId: z.number(),
            budgetId: z.number(),
            catId: z.number(),
            subDeptId: z.number(),
            travel_typeid: z.number(),
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
            const { deptId, budgetId, catId, subDeptId, travel_typeid,data } = input;
            // Map data to include shared fields and default values

            const recordsToInsert = []
            for (const item of data) {
                const baseConditions = [eq(budgetDetailsInFinanceProject.budgetid, budgetId),
                eq(budgetDetailsInFinanceProject.catid, catId),
                eq(budgetDetailsInFinanceProject.subcategoryId, item.subcategoryId),
                eq(budgetDetailsInFinanceProject.activity, item.activity ?? ""),
                eq(budgetDetailsInFinanceProject.subDeptid, subDeptId)
                ]

                const existingRecord = await ctx.db
                    .select()
                    .from(budgetDetailsInFinanceProject)
                    .where(
                        and(...baseConditions))
                if (!existingRecord || existingRecord.length == 0) {
                    recordsToInsert.push({
                        travelTypeid: travel_typeid,
                        budgetid: budgetId,
                        catid: catId,
                        subDeptid: input.subDeptId,
                        deptid: deptId,
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
                    })
                }
            }
            // Insert data using Drizzle
            const insertedRecords = await ctx.db.insert(budgetDetailsInFinanceProject).values(recordsToInsert).returning();

            const response = insertedRecords.map((record) => ({
                budgetDetailsId: record.id,
                subcategoryId: record.subcategoryId,
                categoryId: record.catid,
            }));

            return { success: true, message: "Budget details added successfully", data: response };
        } catch (error) {
            console.error("Error in adding budget details:", error);
            throw new Error("Failed to add budget details. Please try again.");
        }
    });
























