import { and, eq, isNull, sql, isNotNull, inArray } from "drizzle-orm";
import { z } from "zod";
import { protectedProcedure } from "~/server/api/trpc";
import {
  budgetDetailsInFinanceProject,
  budgetMasterInFinanceProject,
  categoryHierarchyInFinanceProject,
  categoryMasterInFinanceProject,
  salaryDetailsInFinanceProject,
  staffMasterInFinanceProject,
  departmentHierarchyInFinanceProject,
  departmentMasterInFinanceProject,
} from "~/server/db/schema";

export const getCats = protectedProcedure.query(async ({ ctx }) => {
  const categories = await ctx.db
    .select({
      categoryId: categoryMasterInFinanceProject.id,
      categoryName: categoryMasterInFinanceProject.categoryname,
    })
    .from(categoryMasterInFinanceProject)
    // this is null because we are doing giving type as null in the db
    .where(isNull(categoryMasterInFinanceProject.type));
  return { categories };
});
export const getSubCats = protectedProcedure
  .input(
    z.object({
      categoryId: z.number(),
    }),
  )
  .query(async ({ ctx, input }) => {
    const subCategories = await ctx.db
      .select({
        subCategoryId: categoryHierarchyInFinanceProject.catId,
        subCategoryName: categoryMasterInFinanceProject.categoryname,
      })
      .from(categoryHierarchyInFinanceProject)
      .innerJoin(
        categoryMasterInFinanceProject,
        eq(
          categoryHierarchyInFinanceProject.catId,
          categoryMasterInFinanceProject.id,
        ),
      )
      .where(eq(categoryHierarchyInFinanceProject.parentId, input.categoryId));
    return {
      subCategories,
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
    }),
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
.input(z.object({
    data: z.array(
      z.object({
        budgetid: z.number(),
        catid: z.number(),
        subcategoryId: z.number(),
        activity: z.string(),
        unit: z.number(),
        rate: z.string(),
        total: z.string(),
        currency: z.string(),
        notes: z.string().optional(),
        description: z.string().optional(),
        aprQty: z.number().optional(),
        aprRate: z.number().optional(),
        aprAmt: z.number().optional(),
        april: z.number(),
        mayQty: z.number().optional(),
        mayRate: z.number().optional(),
        mayAmt: z.number().optional(),
        may: z.number(),
        junQty: z.number().optional(),
        junRate: z.number().optional(),
        junAmt: z.number().optional(),
        june: z.number(),
        julQty: z.number().optional(),
        julRate: z.number().optional(),
        julAmt: z.number().optional(),
        july: z.number(),
        augQty: z.number().optional(),
        augRate: z.number().optional(),
        augAmt: z.number().optional(),
        august: z.number(),
        sepQty: z.number().optional(),
        sepRate: z.number().optional(),
        sepAmt: z.number().optional(),
        september: z.number(),
        octQty: z.number().optional(),
        octRate: z.number().optional(),
        octAmt: z.number().optional(),
        october: z.number(),
        novQty: z.number().optional(),
        novRate: z.number().optional(),
        novAmt: z.number().optional(),
        november: z.number(),
        decQty: z.number().optional(),
        decRate: z.number().optional(),
        decAmt: z.number().optional(),
        december: z.number(),
        janQty: z.number().optional(),
        janRate: z.number().optional(),
        janAmt: z.number().optional(),
        january: z.number(),
        febQty: z.number().optional(),
        febRate: z.number().optional(),
        febAmt: z.number().optional(),
        february: z.number(),
        marQty: z.number().optional(),
        marRate: z.number().optional(),
        marAmt: z.number().optional(),
        march: z.number(),
        deptId: z.number(),
        subDeptId: z.number(),
        createdBy: z.number(),
        createdAt: z.string()
      }),
    ),
  }))
  .mutation(async ({ ctx, input }) => {
    
    try {
        console.log(input, "addBudgetDetails input");
      // Extract data from input
      const { data } = input;
      // Map data to include shared fields and default values
      console.log(data, "addBudgetDetails data");
      const recordsToInsert = [];
      for (const item of data) {
        const baseConditions = [
          eq(budgetDetailsInFinanceProject.budgetid, item.budgetid),
          eq(budgetDetailsInFinanceProject.catid, item.catid),
          eq(budgetDetailsInFinanceProject.subcategoryId, item.subcategoryId),
          eq(budgetDetailsInFinanceProject.activity, item.activity ?? ""),
          eq(budgetDetailsInFinanceProject.subDeptid, item.subDeptId),
          eq(budgetDetailsInFinanceProject.activity, item.activity),
        ];

        const existingRecord = await ctx.db
          .select()
          .from(budgetDetailsInFinanceProject)
          .where(and(...baseConditions));
        if (!existingRecord || existingRecord.length == 0) {
          recordsToInsert.push({
            budgetid: item.budgetid,
            catid: item.catid,
            subDeptid: item.subDeptId,
            deptid: item.deptId,
            subcategoryId: item.subcategoryId,
            activity: item.activity,
            unit: item.unit,
            rate: item.rate,
            total: item.total,
            currency: item.currency,
            notes: item.notes ?? null,
            description: item.description ?? null,
            aprQty: item.aprQty ?? 0,
            aprRate: item.aprRate !== undefined ? String(item.aprRate) : "0",
            aprAmt: item.aprAmt !== undefined ? String(item.aprAmt) : "0",
            april: item.april !== undefined ? String(item.april) : "0",
            mayQty: item.mayQty ?? 0,
            mayRate: item.mayRate !== undefined ? String(item.mayRate) : "0",
            mayAmt: item.mayAmt !== undefined ? String(item.mayAmt) : "0",
            may: item.may !== undefined ? String(item.may) : "0",
            junQty: item.junQty ?? 0,
            junRate: item.junRate !== undefined ? String(item.junRate) : "0",
            junAmt: item.junAmt !== undefined ? String(item.junAmt) : "0",
            june: item.june !== undefined ? String(item.june) : "0",
            julQty: item.julQty ?? 0,
            julRate: item.julRate !== undefined ? String(item.julRate) : "0",
            julAmt: item.julAmt !== undefined ? String(item.julAmt) : "0",
            july: item.july !== undefined ? String(item.july) : "0",
            augQty: item.augQty ?? 0,
            augRate: item.augRate !== undefined ? String(item.augRate) : "0",
            augAmt: item.augAmt !== undefined ? String(item.augAmt) : "0",
            august: item.august !== undefined ? String(item.august) : "0",
            sepQty: item.sepQty ?? 0,
            sepRate: item.sepRate !== undefined ? String(item.sepRate) : "0",
            sepAmt: item.sepAmt !== undefined ? String(item.sepAmt) : "0",
            september:
              item.september !== undefined ? String(item.september) : "0",
            octQty: item.octQty ?? 0,
            octRate: item.octRate !== undefined ? String(item.octRate) : "0",
            octAmt: item.octAmt !== undefined ? String(item.octAmt) : "0",
            october: item.october !== undefined ? String(item.october) : "0",
            novQty: item.novQty ?? 0,
            novRate: item.novRate !== undefined ? String(item.novRate) : "0",
            novAmt: item.novAmt !== undefined ? String(item.novAmt) : "0",
            november: item.november !== undefined ? String(item.november) : "0",
            decQty: item.decQty ?? 0,
            decRate: item.decRate !== undefined ? String(item.decRate) : "0",
            decAmt: item.decAmt !== undefined ? String(item.decAmt) : "0",
            december: item.december !== undefined ? String(item.december) : "0",
            janQty: item.janQty ?? 0,
            janRate: item.janRate !== undefined ? String(item.janRate) : "0",
            janAmt: item.janAmt !== undefined ? String(item.janAmt) : "0",
            january: item.january !== undefined ? String(item.january) : "0",
            febQty: item.febQty ?? 0,
            febRate: item.febRate !== undefined ? String(item.febRate) : "0",
            febAmt: item.febAmt !== undefined ? String(item.febAmt) : "0",
            february: item.february !== undefined ? String(item.february) : "0",
            marQty: item.marQty ?? 0,
            marRate: item.marRate !== undefined ? String(item.marRate) : "0",
            marAmt: item.marAmt !== undefined ? String(item.marAmt) : "0",
            march: item.march !== undefined ? String(item.march) : "0",
            isactive: true,
            createdBy: item.createdBy,
            createdAt: item.createdAt,
            updatedAt: null,
            updatedBy: null,
            q1: (
              (item.april ?? 0) +
              (item.may ?? 0) +
              (item.june ?? 0)
            ).toString(),
            q2: (
              (item.july ?? 0) +
              (item.august ?? 0) +
              (item.september ?? 0)
            ).toString(),
            q3: (
              (item.october ?? 0) +
              (item.november ?? 0) +
              (item.december ?? 0)
            ).toString(),
            q4: (
              (item.january ?? 0) +
              (item.february ?? 0) +
              (item.march ?? 0)
            ).toString()
          });
        }
      }
      // Insert data using Drizzle
      const insertedRecords = await ctx.db
        .insert(budgetDetailsInFinanceProject)
        .values(recordsToInsert)
        .returning();

      const response = insertedRecords.map((record) => ({
        budgetDetailsId: record.id,
        subcategoryId: record.subcategoryId,
        categoryId: record.catid,
      }));

      return {
        success: true,
        message: "Budget details added successfully",
        data: response,
      };
    } catch (error) {
      console.error("Error in adding budget details:", error);
      throw new Error("Failed to add budget details. Please try again.");
    }
  });

export const getBudgetMaster = protectedProcedure
  .input(
    z.object({
      deptId: z.number(),
      financialYear: z.string(),
    }),
  )
  .query(async ({ ctx, input }) => {
    if (input.deptId == 0) return { budgetId: 0, status: undefined };
    const budget = await ctx.db
      .select({
        budgetId: budgetMasterInFinanceProject.id,
        status: budgetMasterInFinanceProject.status,
      })
      .from(budgetMasterInFinanceProject)
      .where(
        and(
          eq(budgetMasterInFinanceProject.departmentId, input.deptId),
          eq(budgetMasterInFinanceProject.financialYear, input.financialYear),
        ),
      )
      .limit(1);
    return {
      budgetId: budget[0] ? budget[0].budgetId : null,
      status: budget[0] ? budget[0].status : undefined,
    };
  });
export const getCatsBudgetDetails = protectedProcedure
  .input(
    z.object({
      deptId: z.number(),
      budgetId: z.number(),
      catId: z.number(),
      activity: z.string().optional(),
    }),
  )
  .query(async ({ ctx, input }) => {
    const baseConditions = [
      eq(budgetDetailsInFinanceProject.deptid, input.deptId),
      eq(budgetDetailsInFinanceProject.budgetid, input.budgetId),
      eq(budgetDetailsInFinanceProject.catid, input.catId),
    ];

    // Add activity condition if it is not null or undefined
    if (
      input.activity !== null &&
      input.activity !== undefined &&
      input.activity != "0"
    ) {
      baseConditions.push(
        eq(budgetDetailsInFinanceProject.activity, input.activity),
      );
    }
    let result;
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
          august: sql`SUM(${budgetDetailsInFinanceProject.august})`.as(
            "august",
          ),
          september: sql`SUM(${budgetDetailsInFinanceProject.september})`.as(
            "september",
          ),
          october: sql`SUM(${budgetDetailsInFinanceProject.october})`.as(
            "october",
          ),
          november: sql`SUM(${budgetDetailsInFinanceProject.november})`.as(
            "november",
          ),
          december: sql`SUM(${budgetDetailsInFinanceProject.december})`.as(
            "december",
          ),
          january: sql`SUM(${budgetDetailsInFinanceProject.january})`.as(
            "january",
          ),
          february: sql`SUM(${budgetDetailsInFinanceProject.february})`.as(
            "february",
          ),
          march: sql`SUM(${budgetDetailsInFinanceProject.march})`.as("march"),
          q1: sql`SUM(${budgetDetailsInFinanceProject.q1})`.as("q1"),
          q2: sql`SUM(${budgetDetailsInFinanceProject.q2})`.as("q2"),
          q3: sql`SUM(${budgetDetailsInFinanceProject.q3})`.as("q3"),
          q4: sql`SUM(${budgetDetailsInFinanceProject.q4})`.as("q4"),
          amount1: sql`SUM(${budgetDetailsInFinanceProject.amount1})`.as(
            "amount1",
          ),
          amount2: sql`SUM(${budgetDetailsInFinanceProject.amount2})`.as(
            "amount2",
          ),
          amount3: sql`SUM(${budgetDetailsInFinanceProject.amount3})`.as(
            "amount3",
          ),
          amount4: sql`SUM(${budgetDetailsInFinanceProject.amount4})`.as(
            "amount4",
          ),
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
    } else {
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
    }),
  )
  .query(async ({ ctx, input }) => {
    try {
      const levelStats = await ctx.db
        .select({
          level: staffMasterInFinanceProject.level,
          employeeCount:
            sql<number>`COUNT(${staffMasterInFinanceProject.id})`.as(
              "employee_count",
            ),
          salarySum:
            sql<number>`SUM(${salaryDetailsInFinanceProject.salary})`.as(
              "salary_sum",
            ),
          insuranceSum:
            sql<number>`SUM(${salaryDetailsInFinanceProject.insurance})`.as(
              "insurance_sum",
            ),
          bonusSum: sql<number>`SUM(${salaryDetailsInFinanceProject.bonus})`.as(
            "bonus_sum",
          ),
          gratuitySum:
            sql<number>`SUM(${salaryDetailsInFinanceProject.gratuity})`.as(
              "gratuity_sum",
            ),
          epfSum: sql<number>`SUM(${salaryDetailsInFinanceProject.epf})`.as(
            "epf_sum",
          ),
          pgwPldSum:
            sql<number>`SUM(${salaryDetailsInFinanceProject.pgwPld})`.as(
              "pgw_pld_sum",
            ),
        })
        .from(staffMasterInFinanceProject)
        .innerJoin(
          salaryDetailsInFinanceProject,
          eq(
            salaryDetailsInFinanceProject.empId,
            staffMasterInFinanceProject.id,
          ),
        )
        .where(
          and(
            eq(staffMasterInFinanceProject.department, input.deptId),
            isNotNull(salaryDetailsInFinanceProject.salary),
          ),
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
    }),
  )
  .query(async ({ ctx, input }) => {
    try {
      console.log(input, "input");

      // get sub categories
      const subCategories = await ctx.db
        .select({
          subCategoryId: categoryHierarchyInFinanceProject.catId,
          subCategoryName: categoryMasterInFinanceProject.categoryname,
        })
        .from(categoryHierarchyInFinanceProject)
        .innerJoin(
          categoryMasterInFinanceProject,
          eq(
            categoryHierarchyInFinanceProject.catId,
            categoryMasterInFinanceProject.id,
          ),
        )
        .where(eq(categoryHierarchyInFinanceProject.parentId, input.catId));
      if (!subCategories) throw new Error("Failed to get the subcategories");
      // we going to get the sub departments

      // category budgetDetails call
      const baseConditions = [
        eq(budgetDetailsInFinanceProject.catid, input.catId),
      ];
      const budgetMasterbaseCondition = [
        eq(budgetMasterInFinanceProject.financialYear, input.financialYear),
        eq(budgetMasterInFinanceProject.isactive, true),
      ];
      if (input.budgetId != 0)
        baseConditions.push(
          eq(budgetDetailsInFinanceProject.budgetid, input.budgetId),
        );
      if (input.deptId != 0) {
        baseConditions.push(
          eq(budgetDetailsInFinanceProject.deptid, input.deptId),
        );
        budgetMasterbaseCondition.push(
          eq(budgetMasterInFinanceProject.departmentId, input.deptId),
        );
      }
      if (input.subdeptId != 0)
        baseConditions.push(
          eq(budgetDetailsInFinanceProject.subDeptid, input.subdeptId),
        );

      // Add activity condition if it is not null or undefined
      if (
        input.activity !== null &&
        input.activity !== undefined &&
        input.activity != "0"
      ) {
        baseConditions.push(
          eq(budgetDetailsInFinanceProject.activity, input.activity),
        );
      }
      let result;
      // Execute the query with all conditions
      if (input.activity == "0") {
        result = await ctx.db
          .select({
            // budgetDetailsIds: sql`ARRAY_AGG(${budgetDetailsInFinanceProject.id})`.as("budgetDetailsIds"),
            subcategoryId: budgetDetailsInFinanceProject.subcategoryId,
            budgetId: budgetDetailsInFinanceProject.budgetid,
            april: sql`SUM(${budgetDetailsInFinanceProject.april})`.as("april"),
            may: sql`SUM(${budgetDetailsInFinanceProject.may})`.as("may"),
            june: sql`SUM(${budgetDetailsInFinanceProject.june})`.as("june"),
            july: sql`SUM(${budgetDetailsInFinanceProject.july})`.as("july"),
            august: sql`SUM(${budgetDetailsInFinanceProject.august})`.as(
              "august",
            ),
            september: sql`SUM(${budgetDetailsInFinanceProject.september})`.as(
              "september",
            ),
            october: sql`SUM(${budgetDetailsInFinanceProject.october})`.as(
              "october",
            ),
            november: sql`SUM(${budgetDetailsInFinanceProject.november})`.as(
              "november",
            ),
            december: sql`SUM(${budgetDetailsInFinanceProject.december})`.as(
              "december",
            ),
            january: sql`SUM(${budgetDetailsInFinanceProject.january})`.as(
              "january",
            ),
            february: sql`SUM(${budgetDetailsInFinanceProject.february})`.as(
              "february",
            ),
            march: sql`SUM(${budgetDetailsInFinanceProject.march})`.as("march"),
            q1: sql`SUM(${budgetDetailsInFinanceProject.q1})`.as("q1"),
            q2: sql`SUM(${budgetDetailsInFinanceProject.q2})`.as("q2"),
            q3: sql`SUM(${budgetDetailsInFinanceProject.q3})`.as("q3"),
            q4: sql`SUM(${budgetDetailsInFinanceProject.q4})`.as("q4"),
            amount1: sql`SUM(${budgetDetailsInFinanceProject.amount1})`.as(
              "amount1",
            ),
            amount2: sql`SUM(${budgetDetailsInFinanceProject.amount2})`.as(
              "amount2",
            ),
            amount3: sql`SUM(${budgetDetailsInFinanceProject.amount3})`.as(
              "amount3",
            ),
            amount4: sql`SUM(${budgetDetailsInFinanceProject.amount4})`.as(
              "amount4",
            ),
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
      } else if (input.deptId == 0 || input.subdeptId == 0) {
        const budgetMasterIds = await ctx.db
          .select({
            id: budgetMasterInFinanceProject.id,
          })
          .from(budgetMasterInFinanceProject)
          .where(and(...budgetMasterbaseCondition));
        const budgetIds = budgetMasterIds.map((record) => record.id);
        const budgetRetrivalConditions = [
          ...baseConditions,
          inArray(budgetDetailsInFinanceProject.budgetid, budgetIds),
          eq(budgetDetailsInFinanceProject.isactive, true),
        ];
        result = await ctx.db
          .select({
            // budgetDetailsIds: sql`ARRAY_AGG(${budgetDetailsInFinanceProject.id})`.as("budgetDetailsIds"),
            subcategoryId: budgetDetailsInFinanceProject.subcategoryId,
            april: sql`SUM(${budgetDetailsInFinanceProject.april})`.as("april"),
            may: sql`SUM(${budgetDetailsInFinanceProject.may})`.as("may"),
            june: sql`SUM(${budgetDetailsInFinanceProject.june})`.as("june"),
            july: sql`SUM(${budgetDetailsInFinanceProject.july})`.as("july"),
            august: sql`SUM(${budgetDetailsInFinanceProject.august})`.as(
              "august",
            ),
            september: sql`SUM(${budgetDetailsInFinanceProject.september})`.as(
              "september",
            ),
            october: sql`SUM(${budgetDetailsInFinanceProject.october})`.as(
              "october",
            ),
            november: sql`SUM(${budgetDetailsInFinanceProject.november})`.as(
              "november",
            ),
            december: sql`SUM(${budgetDetailsInFinanceProject.december})`.as(
              "december",
            ),
            january: sql`SUM(${budgetDetailsInFinanceProject.january})`.as(
              "january",
            ),
            february: sql`SUM(${budgetDetailsInFinanceProject.february})`.as(
              "february",
            ),
            march: sql`SUM(${budgetDetailsInFinanceProject.march})`.as("march"),
            q1: sql`SUM(${budgetDetailsInFinanceProject.q1})`.as("q1"),
            q2: sql`SUM(${budgetDetailsInFinanceProject.q2})`.as("q2"),
            q3: sql`SUM(${budgetDetailsInFinanceProject.q3})`.as("q3"),
            q4: sql`SUM(${budgetDetailsInFinanceProject.q4})`.as("q4"),
            amount1: sql`SUM(${budgetDetailsInFinanceProject.amount1})`.as(
              "amount1",
            ),
            amount2: sql`SUM(${budgetDetailsInFinanceProject.amount2})`.as(
              "amount2",
            ),
            amount3: sql`SUM(${budgetDetailsInFinanceProject.amount3})`.as(
              "amount3",
            ),
            amount4: sql`SUM(${budgetDetailsInFinanceProject.amount4})`.as(
              "amount4",
            ),
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
      } else {
        result = await ctx.db
          .select()
          .from(budgetDetailsInFinanceProject)
          .where(and(...baseConditions));
      }
      // make a call for staff count
      const levelStatsBaseCondition = [
        // isNotNull(salaryDetailsInFinanceProject.salary),
        eq(staffMasterInFinanceProject.isactive, true),
      ];
      if (input.deptId != 0)
        levelStatsBaseCondition.push(
          eq(staffMasterInFinanceProject.department, input.deptId),
        );
      if (input.subdeptId != 0)
        levelStatsBaseCondition.push(
          eq(staffMasterInFinanceProject.subDeptid, input.subdeptId),
        );
      // console.log(levelStatsBaseCondition)
      const levelStats = await ctx.db
        .select({
          level: staffMasterInFinanceProject.level,
          employeeCount:
            sql<number>`COUNT(${staffMasterInFinanceProject.id})`.as(
              "employee_count",
            ),
          salarySum:
            sql<number>`SUM(${salaryDetailsInFinanceProject.salary})`.as(
              "salary_sum",
            ),
          insuranceSum:
            sql<number>`SUM(${salaryDetailsInFinanceProject.insurance})`.as(
              "insurance_sum",
            ),
          bonusSum: sql<number>`SUM(${salaryDetailsInFinanceProject.bonus})`.as(
            "bonus_sum",
          ),
          gratuitySum:
            sql<number>`SUM(${salaryDetailsInFinanceProject.gratuity})`.as(
              "gratuity_sum",
            ),
          epfSum: sql<number>`SUM(${salaryDetailsInFinanceProject.epf})`.as(
            "epf_sum",
          ),
          pgwPldSum:
            sql<number>`SUM(${salaryDetailsInFinanceProject.pgwPld})`.as(
              "pgw_pld_sum",
            ),
        })
        .from(staffMasterInFinanceProject)
        .leftJoin(
          salaryDetailsInFinanceProject,
          eq(
            salaryDetailsInFinanceProject.empId,
            staffMasterInFinanceProject.id,
          ),
        )
        .where(and(...levelStatsBaseCondition))
        .groupBy(staffMasterInFinanceProject.level);

      return {
        subCategories,
        levelStats,
        budgetId: input.budgetId,
        result,
        subDeptId: input.subdeptId,
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
    }),
  )
  .query(async ({ ctx, input }) => {
    console.log(input, "get programinput");
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
          eq(
            categoryHierarchyInFinanceProject.catId,
            categoryMasterInFinanceProject.id,
          ),
        )
        .where(eq(categoryHierarchyInFinanceProject.parentId, input.catId));
      if (!subCategories) throw new Error("Failed to get the subcategories");
      // category budgetDetails call
      const baseConditions = [
        eq(budgetDetailsInFinanceProject.catid, input.catId),
      ];
      const budgetMasterbaseCondition = [
        eq(budgetMasterInFinanceProject.financialYear, input.financialYear),
      ];
      if (input.budgetId != 0)
        baseConditions.push(
          eq(budgetDetailsInFinanceProject.budgetid, input.budgetId),
        );
      if (input.deptId != 0) {
        baseConditions.push(
          eq(budgetDetailsInFinanceProject.deptid, input.deptId),
        );
        budgetMasterbaseCondition.push(
          eq(budgetMasterInFinanceProject.departmentId, input.deptId),
        );
      }
      if (input.subDeptId != 0)
        baseConditions.push(
          eq(budgetDetailsInFinanceProject.subDeptid, input.subDeptId),
        );

      // Add activity condition if it is not null or undefined
      if (
        input.activity !== null &&
        input.activity !== undefined &&
        input.activity != "0"
      ) {
        baseConditions.push(
          eq(budgetDetailsInFinanceProject.activity, input.activity),
        );
      }
      let result;
      if (input.deptId == 0 || input.subDeptId == 0) {
        const budgetMasterIds = await ctx.db
          .select({
            id: budgetMasterInFinanceProject.id,
          })
          .from(budgetMasterInFinanceProject)
          .where(and(...budgetMasterbaseCondition));
        const budgetIds = budgetMasterIds.map((record) => record.id);
        const budgetRetrivalConditions = [
          ...baseConditions,
          inArray(budgetDetailsInFinanceProject.budgetid, budgetIds),
        ];
        result = await ctx.db
          .select({
            subcategoryId: budgetDetailsInFinanceProject.subcategoryId,
            april: sql`SUM(${budgetDetailsInFinanceProject.april})`.as("april"),
            may: sql`SUM(${budgetDetailsInFinanceProject.may})`.as("may"),
            june: sql`SUM(${budgetDetailsInFinanceProject.june})`.as("june"),
            july: sql`SUM(${budgetDetailsInFinanceProject.july})`.as("july"),
            august: sql`SUM(${budgetDetailsInFinanceProject.august})`.as(
              "august",
            ),
            september: sql`SUM(${budgetDetailsInFinanceProject.september})`.as(
              "september",
            ),
            october: sql`SUM(${budgetDetailsInFinanceProject.october})`.as(
              "october",
            ),
            november: sql`SUM(${budgetDetailsInFinanceProject.november})`.as(
              "november",
            ),
            december: sql`SUM(${budgetDetailsInFinanceProject.december})`.as(
              "december",
            ),
            january: sql`SUM(${budgetDetailsInFinanceProject.january})`.as(
              "january",
            ),
            february: sql`SUM(${budgetDetailsInFinanceProject.february})`.as(
              "february",
            ),
            march: sql`SUM(${budgetDetailsInFinanceProject.march})`.as("march"),
            q1: sql`SUM(${budgetDetailsInFinanceProject.q1})`.as("q1"),
            q2: sql`SUM(${budgetDetailsInFinanceProject.q2})`.as("q2"),
            q3: sql`SUM(${budgetDetailsInFinanceProject.q3})`.as("q3"),
            q4: sql`SUM(${budgetDetailsInFinanceProject.q4})`.as("q4"),
            total: sql`SUM(${budgetDetailsInFinanceProject.total})`.as("total"),
            aprQty: sql`SUM(${budgetDetailsInFinanceProject.aprQty})`.as(
              "aprQty",
            ),
            aprRate: sql`SUM(${budgetDetailsInFinanceProject.aprRate})`.as(
              "aprRate",
            ),
            aprAmt: sql`SUM(${budgetDetailsInFinanceProject.aprAmt})`.as(
              "aprAmt",
            ),
            mayQty: sql`SUM(${budgetDetailsInFinanceProject.mayQty})`.as(
              "mayQty",
            ),
            mayRate: sql`SUM(${budgetDetailsInFinanceProject.mayRate})`.as(
              "mayRate",
            ),
            mayAmt: sql`SUM(${budgetDetailsInFinanceProject.mayAmt})`.as(
              "mayAmt",
            ),
            junQty: sql`SUM(${budgetDetailsInFinanceProject.junQty})`.as(
              "junQty",
            ),
            junRate: sql`SUM(${budgetDetailsInFinanceProject.junRate})`.as(
              "junRate",
            ),
            junAmt: sql`SUM(${budgetDetailsInFinanceProject.junAmt})`.as(
              "junAmt",
            ),
            julQty: sql`SUM(${budgetDetailsInFinanceProject.julQty})`.as(
              "julQty",
            ),
            julRate: sql`SUM(${budgetDetailsInFinanceProject.julRate})`.as(
              "julRate",
            ),
            julAmt: sql`SUM(${budgetDetailsInFinanceProject.julAmt})`.as(
              "julAmt",
            ),
            augQty: sql`SUM(${budgetDetailsInFinanceProject.augQty})`.as(
              "augQty",
            ),
            augRate: sql`SUM(${budgetDetailsInFinanceProject.augRate})`.as(
              "augRate",
            ),
            augAmt: sql`SUM(${budgetDetailsInFinanceProject.augAmt})`.as(
              "augAmt",
            ),
            sepQty: sql`SUM(${budgetDetailsInFinanceProject.sepQty})`.as(
              "sepQty",
            ),
            sepRate: sql`SUM(${budgetDetailsInFinanceProject.sepRate})`.as(
              "sepRate",
            ),
            sepAmt: sql`SUM(${budgetDetailsInFinanceProject.sepAmt})`.as(
              "sepAmt",
            ),
            octQty: sql`SUM(${budgetDetailsInFinanceProject.octQty})`.as(
              "octQty",
            ),
            octRate: sql`SUM(${budgetDetailsInFinanceProject.octRate})`.as(
              "octRate",
            ),
            octAmt: sql`SUM(${budgetDetailsInFinanceProject.octAmt})`.as(
              "octAmt",
            ),
            novQty: sql`SUM(${budgetDetailsInFinanceProject.novQty})`.as(
              "novQty",
            ),
            novRate: sql`SUM(${budgetDetailsInFinanceProject.novRate})`.as(
              "novRate",
            ),
            novAmt: sql`SUM(${budgetDetailsInFinanceProject.novAmt})`.as(
              "novAmt",
            ),
            decQty: sql`SUM(${budgetDetailsInFinanceProject.decQty})`.as(
              "decQty",
            ),
            decRate: sql`SUM(${budgetDetailsInFinanceProject.decRate})`.as(
              "decRate",
            ),
            decAmt: sql`SUM(${budgetDetailsInFinanceProject.decAmt})`.as(
              "decAmt",
            ),
            janQty: sql`SUM(${budgetDetailsInFinanceProject.janQty})`.as(
              "janQty",
            ),
            janRate: sql`SUM(${budgetDetailsInFinanceProject.janRate})`.as(
              "janRate",
            ),
            janAmt: sql`SUM(${budgetDetailsInFinanceProject.janAmt})`.as(
              "janAmt",
            ),
            febQty: sql`SUM(${budgetDetailsInFinanceProject.febQty})`.as(
              "febQty",
            ),
            febRate: sql`SUM(${budgetDetailsInFinanceProject.febRate})`.as(
              "febRate",
            ),
            febAmt: sql`SUM(${budgetDetailsInFinanceProject.febAmt})`.as(
              "febAmt",
            ),
            marQty: sql`SUM(${budgetDetailsInFinanceProject.marQty})`.as(
              "marQty",
            ),
            marRate: sql`SUM(${budgetDetailsInFinanceProject.marRate})`.as(
              "marRate",
            ),
            marAmt: sql`SUM(${budgetDetailsInFinanceProject.marAmt})`.as(
              "marAmt",
            ),
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
            august: sql`SUM(${budgetDetailsInFinanceProject.august})`.as(
              "august",
            ),
            september: sql`SUM(${budgetDetailsInFinanceProject.september})`.as(
              "september",
            ),
            october: sql`SUM(${budgetDetailsInFinanceProject.october})`.as(
              "october",
            ),
            november: sql`SUM(${budgetDetailsInFinanceProject.november})`.as(
              "november",
            ),
            december: sql`SUM(${budgetDetailsInFinanceProject.december})`.as(
              "december",
            ),
            january: sql`SUM(${budgetDetailsInFinanceProject.january})`.as(
              "january",
            ),
            february: sql`SUM(${budgetDetailsInFinanceProject.february})`.as(
              "february",
            ),
            march: sql`SUM(${budgetDetailsInFinanceProject.march})`.as("march"),
            q1: sql`SUM(${budgetDetailsInFinanceProject.q1})`.as("q1"),
            q2: sql`SUM(${budgetDetailsInFinanceProject.q2})`.as("q2"),
            q3: sql`SUM(${budgetDetailsInFinanceProject.q3})`.as("q3"),
            q4: sql`SUM(${budgetDetailsInFinanceProject.q4})`.as("q4"),
            total: sql`SUM(${budgetDetailsInFinanceProject.total})`.as("total"),
            id: sql`SUM(${budgetDetailsInFinanceProject.total})`.as("total"),
            aprQty: sql`SUM(${budgetDetailsInFinanceProject.aprQty})`.as(
              "aprQty",
            ),
            aprRate: sql`SUM(${budgetDetailsInFinanceProject.aprRate})`.as(
              "aprRate",
            ),
            aprAmt: sql`SUM(${budgetDetailsInFinanceProject.aprAmt})`.as(
              "aprAmt",
            ),
            mayQty: sql`SUM(${budgetDetailsInFinanceProject.mayQty})`.as(
              "mayQty",
            ),
            mayRate: sql`SUM(${budgetDetailsInFinanceProject.mayRate})`.as(
              "mayRate",
            ),
            mayAmt: sql`SUM(${budgetDetailsInFinanceProject.mayAmt})`.as(
              "mayAmt",
            ),
            junQty: sql`SUM(${budgetDetailsInFinanceProject.junQty})`.as(
              "junQty",
            ),
            junRate: sql`SUM(${budgetDetailsInFinanceProject.junRate})`.as(
              "junRate",
            ),
            junAmt: sql`SUM(${budgetDetailsInFinanceProject.junAmt})`.as(
              "junAmt",
            ),
            julQty: sql`SUM(${budgetDetailsInFinanceProject.julQty})`.as(
              "julQty",
            ),
            julRate: sql`SUM(${budgetDetailsInFinanceProject.julRate})`.as(
              "julRate",
            ),
            julAmt: sql`SUM(${budgetDetailsInFinanceProject.julAmt})`.as(
              "julAmt",
            ),
            augQty: sql`SUM(${budgetDetailsInFinanceProject.augQty})`.as(
              "augQty",
            ),
            augRate: sql`SUM(${budgetDetailsInFinanceProject.augRate})`.as(
              "augRate",
            ),
            augAmt: sql`SUM(${budgetDetailsInFinanceProject.augAmt})`.as(
              "augAmt",
            ),
            sepQty: sql`SUM(${budgetDetailsInFinanceProject.sepQty})`.as(
              "sepQty",
            ),
            sepRate: sql`SUM(${budgetDetailsInFinanceProject.sepRate})`.as(
              "sepRate",
            ),
            sepAmt: sql`SUM(${budgetDetailsInFinanceProject.sepAmt})`.as(
              "sepAmt",
            ),
            octQty: sql`SUM(${budgetDetailsInFinanceProject.octQty})`.as(
              "octQty",
            ),
            octRate: sql`SUM(${budgetDetailsInFinanceProject.octRate})`.as(
              "octRate",
            ),
            octAmt: sql`SUM(${budgetDetailsInFinanceProject.octAmt})`.as(
              "octAmt",
            ),
            novQty: sql`SUM(${budgetDetailsInFinanceProject.novQty})`.as(
              "novQty",
            ),
            novRate: sql`SUM(${budgetDetailsInFinanceProject.novRate})`.as(
              "novRate",
            ),
            novAmt: sql`SUM(${budgetDetailsInFinanceProject.novAmt})`.as(
              "novAmt",
            ),
            decQty: sql`SUM(${budgetDetailsInFinanceProject.decQty})`.as(
              "decQty",
            ),
            decRate: sql`SUM(${budgetDetailsInFinanceProject.decRate})`.as(
              "decRate",
            ),
            decAmt: sql`SUM(${budgetDetailsInFinanceProject.decAmt})`.as(
              "decAmt",
            ),
            janQty: sql`SUM(${budgetDetailsInFinanceProject.janQty})`.as(
              "janQty",
            ),
            janRate: sql`SUM(${budgetDetailsInFinanceProject.janRate})`.as(
              "janRate",
            ),
            janAmt: sql`SUM(${budgetDetailsInFinanceProject.janAmt})`.as(
              "janAmt",
            ),
            febQty: sql`SUM(${budgetDetailsInFinanceProject.febQty})`.as(
              "febQty",
            ),
            febRate: sql`SUM(${budgetDetailsInFinanceProject.febRate})`.as(
              "febRate",
            ),
            febAmt: sql`SUM(${budgetDetailsInFinanceProject.febAmt})`.as(
              "febAmt",
            ),
            marQty: sql`SUM(${budgetDetailsInFinanceProject.marQty})`.as(
              "marQty",
            ),
            marRate: sql`SUM(${budgetDetailsInFinanceProject.marRate})`.as(
              "marRate",
            ),
            marAmt: sql`SUM(${budgetDetailsInFinanceProject.marAmt})`.as(
              "marAmt",
            ),
          })
          .from(budgetDetailsInFinanceProject)
          .where(and(...baseConditions))
          .groupBy(budgetDetailsInFinanceProject.subcategoryId);
          console.log("Result for activity == 0:", result);
          console.log(baseConditions, "baseConditions");
      } else {
        result = await ctx.db
          .select()
          .from(budgetDetailsInFinanceProject)
          .where(and(...baseConditions));
          console.log("Result for activity != 0:", result);
      }
      const activityTotalCondition = [
        eq(budgetDetailsInFinanceProject.catid, input.catId),
      ];
      if (input.deptId == 0) {
        const budgetMasterIds = await ctx.db
          .select({
            id: budgetMasterInFinanceProject.id,
          })
          .from(budgetMasterInFinanceProject)
          .where(and(...budgetMasterbaseCondition));
        const budgetIds = budgetMasterIds.map((record) => record.id);
        activityTotalCondition.push(
          inArray(budgetDetailsInFinanceProject.budgetid, budgetIds),
        );
      } else {
        activityTotalCondition.push(
          eq(budgetDetailsInFinanceProject.deptid, input.deptId),
        );
      }
      if (input.subDeptId != 0)
        activityTotalCondition.push(
          eq(budgetDetailsInFinanceProject.subDeptid, input.subDeptId),
        );
      const activityTotals = await ctx.db
        .select({
          q1: sql`SUM(${budgetDetailsInFinanceProject.q1})`.as("q1"),
          q2: sql`SUM(${budgetDetailsInFinanceProject.q2})`.as("q2"),
          q3: sql`SUM(${budgetDetailsInFinanceProject.q3})`.as("q3"),
          q4: sql`SUM(${budgetDetailsInFinanceProject.q4})`.as("q4"),
          activityId: budgetDetailsInFinanceProject.activity,
        })
        .from(budgetDetailsInFinanceProject)
        .where(and(...activityTotalCondition))
        .groupBy(budgetDetailsInFinanceProject.activity);
        console.log(result, "result");
      return {
        subCategories,
        budgetId: input.budgetId,
        result,
        subDeptId: input.subDeptId,
        activityTotals,
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
    }),
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
          eq(
            categoryHierarchyInFinanceProject.catId,
            categoryMasterInFinanceProject.id,
          ),
        )
        .where(
          and(
            eq(
              categoryHierarchyInFinanceProject.parentId,
              input.searchSubCatId,
            ),
            inArray(categoryHierarchyInFinanceProject.catId, [26, 27, 28, 29]),
          ),
        );
      if (!subCategories) throw new Error("Failed to get the subcategories");
      // category budgetDetails call
      const baseConditions = [
        eq(budgetDetailsInFinanceProject.catid, input.catId),
      ];
      const budgetMasterbaseCondition = [
        eq(budgetMasterInFinanceProject.financialYear, input.financialYear),
      ];
      if (input.budgetId != 0)
        baseConditions.push(
          eq(budgetDetailsInFinanceProject.budgetid, input.budgetId),
        );
      if (input.deptId != 0) {
        baseConditions.push(
          eq(budgetDetailsInFinanceProject.deptid, input.deptId),
        );
        budgetMasterbaseCondition.push(
          eq(budgetMasterInFinanceProject.departmentId, input.deptId),
        );
      }
      if (input.subDeptId != 0)
        baseConditions.push(
          eq(budgetDetailsInFinanceProject.subDeptid, input.subDeptId),
        );
      // Add activity condition if it is not null or undefined
      if (
        input.travel_typeid !== null &&
        input.travel_typeid !== undefined &&
        input.travel_typeid != 0
      ) {
        baseConditions.push(
          eq(budgetDetailsInFinanceProject.travelTypeid, input.travel_typeid),
        );
      }
      let result;
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
          ...baseConditions,
          inArray(budgetDetailsInFinanceProject.budgetid, budgetIds),
        ];
        result = await ctx.db
          .select({
            subcategoryId: budgetDetailsInFinanceProject.subcategoryId,
            april: sql`SUM(${budgetDetailsInFinanceProject.april})`.as("april"),
            may: sql`SUM(${budgetDetailsInFinanceProject.may})`.as("may"),
            june: sql`SUM(${budgetDetailsInFinanceProject.june})`.as("june"),
            july: sql`SUM(${budgetDetailsInFinanceProject.july})`.as("july"),
            august: sql`SUM(${budgetDetailsInFinanceProject.august})`.as(
              "august",
            ),
            september: sql`SUM(${budgetDetailsInFinanceProject.september})`.as(
              "september",
            ),
            october: sql`SUM(${budgetDetailsInFinanceProject.october})`.as(
              "october",
            ),
            november: sql`SUM(${budgetDetailsInFinanceProject.november})`.as(
              "november",
            ),
            december: sql`SUM(${budgetDetailsInFinanceProject.december})`.as(
              "december",
            ),
            january: sql`SUM(${budgetDetailsInFinanceProject.january})`.as(
              "january",
            ),
            february: sql`SUM(${budgetDetailsInFinanceProject.february})`.as(
              "february",
            ),
            march: sql`SUM(${budgetDetailsInFinanceProject.march})`.as("march"),
            q1: sql`SUM(${budgetDetailsInFinanceProject.q1})`.as("q1"),
            q2: sql`SUM(${budgetDetailsInFinanceProject.q2})`.as("q2"),
            q3: sql`SUM(${budgetDetailsInFinanceProject.q3})`.as("q3"),
            q4: sql`SUM(${budgetDetailsInFinanceProject.q4})`.as("q4"),
            aprQty: sql`SUM(${budgetDetailsInFinanceProject.aprQty})`.as(
              "aprQty",
            ),
            aprRate: sql`SUM(${budgetDetailsInFinanceProject.aprRate})`.as(
              "aprRate",
            ),
            aprAmt: sql`SUM(${budgetDetailsInFinanceProject.aprAmt})`.as(
              "aprAmt",
            ),
            mayQty: sql`SUM(${budgetDetailsInFinanceProject.mayQty})`.as(
              "mayQty",
            ),
            mayRate: sql`SUM(${budgetDetailsInFinanceProject.mayRate})`.as(
              "mayRate",
            ),
            mayAmt: sql`SUM(${budgetDetailsInFinanceProject.mayAmt})`.as(
              "mayAmt",
            ),
            junQty: sql`SUM(${budgetDetailsInFinanceProject.junQty})`.as(
              "junQty",
            ),
            junRate: sql`SUM(${budgetDetailsInFinanceProject.junRate})`.as(
              "junRate",
            ),
            junAmt: sql`SUM(${budgetDetailsInFinanceProject.junAmt})`.as(
              "junAmt",
            ),
            julQty: sql`SUM(${budgetDetailsInFinanceProject.julQty})`.as(
              "julQty",
            ),
            julRate: sql`SUM(${budgetDetailsInFinanceProject.julRate})`.as(
              "julRate",
            ),
            julAmt: sql`SUM(${budgetDetailsInFinanceProject.julAmt})`.as(
              "julAmt",
            ),
            augQty: sql`SUM(${budgetDetailsInFinanceProject.augQty})`.as(
              "augQty",
            ),
            augRate: sql`SUM(${budgetDetailsInFinanceProject.augRate})`.as(
              "augRate",
            ),
            augAmt: sql`SUM(${budgetDetailsInFinanceProject.augAmt})`.as(
              "augAmt",
            ),
            sepQty: sql`SUM(${budgetDetailsInFinanceProject.sepQty})`.as(
              "sepQty",
            ),
            sepRate: sql`SUM(${budgetDetailsInFinanceProject.sepRate})`.as(
              "sepRate",
            ),
            sepAmt: sql`SUM(${budgetDetailsInFinanceProject.sepAmt})`.as(
              "sepAmt",
            ),
            octQty: sql`SUM(${budgetDetailsInFinanceProject.octQty})`.as(
              "octQty",
            ),
            octRate: sql`SUM(${budgetDetailsInFinanceProject.octRate})`.as(
              "octRate",
            ),
            octAmt: sql`SUM(${budgetDetailsInFinanceProject.octAmt})`.as(
              "octAmt",
            ),
            novQty: sql`SUM(${budgetDetailsInFinanceProject.novQty})`.as(
              "novQty",
            ),
            novRate: sql`SUM(${budgetDetailsInFinanceProject.novRate})`.as(
              "novRate",
            ),
            novAmt: sql`SUM(${budgetDetailsInFinanceProject.novAmt})`.as(
              "novAmt",
            ),
            decQty: sql`SUM(${budgetDetailsInFinanceProject.decQty})`.as(
              "decQty",
            ),
            decRate: sql`SUM(${budgetDetailsInFinanceProject.decRate})`.as(
              "decRate",
            ),
            decAmt: sql`SUM(${budgetDetailsInFinanceProject.decAmt})`.as(
              "decAmt",
            ),
            janQty: sql`SUM(${budgetDetailsInFinanceProject.janQty})`.as(
              "janQty",
            ),
            janRate: sql`SUM(${budgetDetailsInFinanceProject.janRate})`.as(
              "janRate",
            ),
            janAmt: sql`SUM(${budgetDetailsInFinanceProject.janAmt})`.as(
              "janAmt",
            ),
            febQty: sql`SUM(${budgetDetailsInFinanceProject.febQty})`.as(
              "febQty",
            ),
            febRate: sql`SUM(${budgetDetailsInFinanceProject.febRate})`.as(
              "febRate",
            ),
            febAmt: sql`SUM(${budgetDetailsInFinanceProject.febAmt})`.as(
              "febAmt",
            ),
            marQty: sql`SUM(${budgetDetailsInFinanceProject.marQty})`.as(
              "marQty",
            ),
            marRate: sql`SUM(${budgetDetailsInFinanceProject.marRate})`.as(
              "marRate",
            ),
            marAmt: sql`SUM(${budgetDetailsInFinanceProject.marAmt})`.as(
              "marAmt",
            ),
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
            august: sql`SUM(${budgetDetailsInFinanceProject.august})`.as(
              "august",
            ),
            september: sql`SUM(${budgetDetailsInFinanceProject.september})`.as(
              "september",
            ),
            october: sql`SUM(${budgetDetailsInFinanceProject.october})`.as(
              "october",
            ),
            november: sql`SUM(${budgetDetailsInFinanceProject.november})`.as(
              "november",
            ),
            december: sql`SUM(${budgetDetailsInFinanceProject.december})`.as(
              "december",
            ),
            january: sql`SUM(${budgetDetailsInFinanceProject.january})`.as(
              "january",
            ),
            february: sql`SUM(${budgetDetailsInFinanceProject.february})`.as(
              "february",
            ),
            march: sql`SUM(${budgetDetailsInFinanceProject.march})`.as("march"),
            q1: sql`SUM(${budgetDetailsInFinanceProject.q1})`.as("q1"),
            q2: sql`SUM(${budgetDetailsInFinanceProject.q2})`.as("q2"),
            q3: sql`SUM(${budgetDetailsInFinanceProject.q3})`.as("q3"),
            q4: sql`SUM(${budgetDetailsInFinanceProject.q4})`.as("q4"),
            aprQty: sql`SUM(${budgetDetailsInFinanceProject.aprQty})`.as(
              "aprQty",
            ),
            aprRate: sql`SUM(${budgetDetailsInFinanceProject.aprRate})`.as(
              "aprRate",
            ),
            aprAmt: sql`SUM(${budgetDetailsInFinanceProject.aprAmt})`.as(
              "aprAmt",
            ),
            mayQty: sql`SUM(${budgetDetailsInFinanceProject.mayQty})`.as(
              "mayQty",
            ),
            mayRate: sql`SUM(${budgetDetailsInFinanceProject.mayRate})`.as(
              "mayRate",
            ),
            mayAmt: sql`SUM(${budgetDetailsInFinanceProject.mayAmt})`.as(
              "mayAmt",
            ),
            junQty: sql`SUM(${budgetDetailsInFinanceProject.junQty})`.as(
              "junQty",
            ),
            junRate: sql`SUM(${budgetDetailsInFinanceProject.junRate})`.as(
              "junRate",
            ),
            junAmt: sql`SUM(${budgetDetailsInFinanceProject.junAmt})`.as(
              "junAmt",
            ),
            julQty: sql`SUM(${budgetDetailsInFinanceProject.julQty})`.as(
              "julQty",
            ),
            julRate: sql`SUM(${budgetDetailsInFinanceProject.julRate})`.as(
              "julRate",
            ),
            julAmt: sql`SUM(${budgetDetailsInFinanceProject.julAmt})`.as(
              "julAmt",
            ),
            augQty: sql`SUM(${budgetDetailsInFinanceProject.augQty})`.as(
              "augQty",
            ),
            augRate: sql`SUM(${budgetDetailsInFinanceProject.augRate})`.as(
              "augRate",
            ),
            augAmt: sql`SUM(${budgetDetailsInFinanceProject.augAmt})`.as(
              "augAmt",
            ),
            sepQty: sql`SUM(${budgetDetailsInFinanceProject.sepQty})`.as(
              "sepQty",
            ),
            sepRate: sql`SUM(${budgetDetailsInFinanceProject.sepRate})`.as(
              "sepRate",
            ),
            sepAmt: sql`SUM(${budgetDetailsInFinanceProject.sepAmt})`.as(
              "sepAmt",
            ),
            octQty: sql`SUM(${budgetDetailsInFinanceProject.octQty})`.as(
              "octQty",
            ),
            octRate: sql`SUM(${budgetDetailsInFinanceProject.octRate})`.as(
              "octRate",
            ),
            octAmt: sql`SUM(${budgetDetailsInFinanceProject.octAmt})`.as(
              "octAmt",
            ),
            novQty: sql`SUM(${budgetDetailsInFinanceProject.novQty})`.as(
              "novQty",
            ),
            novRate: sql`SUM(${budgetDetailsInFinanceProject.novRate})`.as(
              "novRate",
            ),
            novAmt: sql`SUM(${budgetDetailsInFinanceProject.novAmt})`.as(
              "novAmt",
            ),
            decQty: sql`SUM(${budgetDetailsInFinanceProject.decQty})`.as(
              "decQty",
            ),
            decRate: sql`SUM(${budgetDetailsInFinanceProject.decRate})`.as(
              "decRate",
            ),
            decAmt: sql`SUM(${budgetDetailsInFinanceProject.decAmt})`.as(
              "decAmt",
            ),
            janQty: sql`SUM(${budgetDetailsInFinanceProject.janQty})`.as(
              "janQty",
            ),
            janRate: sql`SUM(${budgetDetailsInFinanceProject.janRate})`.as(
              "janRate",
            ),
            janAmt: sql`SUM(${budgetDetailsInFinanceProject.janAmt})`.as(
              "janAmt",
            ),
            febQty: sql`SUM(${budgetDetailsInFinanceProject.febQty})`.as(
              "febQty",
            ),
            febRate: sql`SUM(${budgetDetailsInFinanceProject.febRate})`.as(
              "febRate",
            ),
            febAmt: sql`SUM(${budgetDetailsInFinanceProject.febAmt})`.as(
              "febAmt",
            ),
            marQty: sql`SUM(${budgetDetailsInFinanceProject.marQty})`.as(
              "marQty",
            ),
            marRate: sql`SUM(${budgetDetailsInFinanceProject.marRate})`.as(
              "marRate",
            ),
            marAmt: sql`SUM(${budgetDetailsInFinanceProject.marAmt})`.as(
              "marAmt",
            ),
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
        .where(
          and(
            eq(budgetDetailsInFinanceProject.deptid, input.deptId),
            eq(budgetDetailsInFinanceProject.budgetid, input.budgetId),
            eq(budgetDetailsInFinanceProject.catid, input.searchSubCatId),
            eq(budgetDetailsInFinanceProject.subDeptid, input.subDeptId),
          ),
        );
      // make a call for staff count
      const levelStatsBaseCondition = [
        // isNotNull(salaryDetailsInFinanceProject.salary),
        eq(staffMasterInFinanceProject.isactive, true),
      ];
      if (input.deptId != 0)
        levelStatsBaseCondition.push(
          eq(staffMasterInFinanceProject.department, input.deptId),
        );
      if (input.subDeptId != 0)
        levelStatsBaseCondition.push(
          eq(staffMasterInFinanceProject.subDeptid, input.subDeptId),
        );
      const levelStats = await ctx.db
        .select({
          level: staffMasterInFinanceProject.level,
          employeeCount:
            sql<number>`COUNT(${staffMasterInFinanceProject.id})`.as(
              "employee_count",
            ),
        })
        .from(staffMasterInFinanceProject)
        .leftJoin(
          salaryDetailsInFinanceProject,
          eq(
            salaryDetailsInFinanceProject.empId,
            staffMasterInFinanceProject.id,
          ),
        )
        .where(and(...levelStatsBaseCondition))
        .groupBy(staffMasterInFinanceProject.level);
      const travelTypesTotalCondition = [
        eq(budgetDetailsInFinanceProject.catid, input.catId),
      ];
      if (input.deptId == 0) {
        const budgetMasterIds = await ctx.db
          .select({
            id: budgetMasterInFinanceProject.id,
          })
          .from(budgetMasterInFinanceProject)
          .where(and(...budgetMasterbaseCondition));
        const budgetIds = budgetMasterIds.map((record) => record.id);
        travelTypesTotalCondition.push(
          inArray(budgetDetailsInFinanceProject.budgetid, budgetIds),
        );
      } else {
        travelTypesTotalCondition.push(
          eq(budgetDetailsInFinanceProject.deptid, input.deptId),
        );
      }
      if (input.subDeptId != 0)
        travelTypesTotalCondition.push(
          eq(budgetDetailsInFinanceProject.subDeptid, input.subDeptId),
        );
      const travelTypesTotal = await ctx.db
        .select({
          q1: sql`SUM(${budgetDetailsInFinanceProject.q1})`.as("q1"),
          q2: sql`SUM(${budgetDetailsInFinanceProject.q2})`.as("q2"),
          q3: sql`SUM(${budgetDetailsInFinanceProject.q3})`.as("q3"),
          q4: sql`SUM(${budgetDetailsInFinanceProject.q4})`.as("q4"),
          travelTypeId: budgetDetailsInFinanceProject.travelTypeid,
        })
        .from(budgetDetailsInFinanceProject)
        .where(and(...travelTypesTotalCondition))
        .groupBy(budgetDetailsInFinanceProject.travelTypeid);

      return {
        subCategories,
        levelStats,
        budgetId: input.budgetId,
        result,
        personalData,
        subDeptId: input.subDeptId,
        travelTypesTotal,
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
    }),
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
          eq(
            categoryHierarchyInFinanceProject.catId,
            categoryMasterInFinanceProject.id,
          ),
        )
        .where(eq(categoryHierarchyInFinanceProject.parentId, input.catId));
      if (!subCategories) throw new Error("Failed to get the subcategories");
      // category budgetDetails call
      const baseConditions = [
        eq(budgetDetailsInFinanceProject.catid, input.catId),
      ];
      const budgetMasterbaseCondition = [
        eq(budgetMasterInFinanceProject.financialYear, input.financialYear),
      ];
      if (input.budgetId != 0)
        baseConditions.push(
          eq(budgetDetailsInFinanceProject.budgetid, input.budgetId),
        );
      if (input.deptId != 0) {
        baseConditions.push(
          eq(budgetDetailsInFinanceProject.deptid, input.deptId),
        );
        budgetMasterbaseCondition.push(
          eq(budgetMasterInFinanceProject.departmentId, input.deptId),
        );
      }
      if (input.subDeptId != 0)
        baseConditions.push(
          eq(budgetDetailsInFinanceProject.subDeptid, input.subDeptId),
        );

      // Add activity condition if it is not null or undefined
      if (
        input.activity !== null &&
        input.activity !== undefined &&
        input.activity != "0"
      ) {
        baseConditions.push(
          eq(budgetDetailsInFinanceProject.activity, input.activity),
        );
      }
      let result;
      // Execute the query with all conditions
      if (input.activity == "0") {
        result = await ctx.db
          .select({
            subcategoryId: budgetDetailsInFinanceProject.subcategoryId,
            april: sql`SUM(${budgetDetailsInFinanceProject.april})`.as("april"),
            may: sql`SUM(${budgetDetailsInFinanceProject.may})`.as("may"),
            june: sql`SUM(${budgetDetailsInFinanceProject.june})`.as("june"),
            july: sql`SUM(${budgetDetailsInFinanceProject.july})`.as("july"),
            august: sql`SUM(${budgetDetailsInFinanceProject.august})`.as(
              "august",
            ),
            september: sql`SUM(${budgetDetailsInFinanceProject.september})`.as(
              "september",
            ),
            october: sql`SUM(${budgetDetailsInFinanceProject.october})`.as(
              "october",
            ),
            november: sql`SUM(${budgetDetailsInFinanceProject.november})`.as(
              "november",
            ),
            december: sql`SUM(${budgetDetailsInFinanceProject.december})`.as(
              "december",
            ),
            january: sql`SUM(${budgetDetailsInFinanceProject.january})`.as(
              "january",
            ),
            february: sql`SUM(${budgetDetailsInFinanceProject.february})`.as(
              "february",
            ),
            march: sql`SUM(${budgetDetailsInFinanceProject.march})`.as("march"),
            q1: sql`SUM(${budgetDetailsInFinanceProject.q1})`.as("q1"),
            q2: sql`SUM(${budgetDetailsInFinanceProject.q2})`.as("q2"),
            q3: sql`SUM(${budgetDetailsInFinanceProject.q3})`.as("q3"),
            q4: sql`SUM(${budgetDetailsInFinanceProject.q4})`.as("q4"),
            amount1: sql`SUM(${budgetDetailsInFinanceProject.amount1})`.as(
              "amount1",
            ),
            amount2: sql`SUM(${budgetDetailsInFinanceProject.amount2})`.as(
              "amount2",
            ),
            amount3: sql`SUM(${budgetDetailsInFinanceProject.amount3})`.as(
              "amount3",
            ),
            amount4: sql`SUM(${budgetDetailsInFinanceProject.amount4})`.as(
              "amount4",
            ),
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
      } else if (input.deptId == 0 || input.subDeptId == 0) {
        const budgetMasterIds = await ctx.db
          .select({
            id: budgetMasterInFinanceProject.id,
          })
          .from(budgetMasterInFinanceProject)
          .where(and(...budgetMasterbaseCondition));
        const budgetIds = budgetMasterIds.map((record) => record.id);
        const budgetRetrivalConditions = [
          ...baseConditions,
          inArray(budgetDetailsInFinanceProject.budgetid, budgetIds),
        ];
        result = await ctx.db
          .select({
            subcategoryId: budgetDetailsInFinanceProject.subcategoryId,
            april: sql`SUM(${budgetDetailsInFinanceProject.april})`.as("april"),
            may: sql`SUM(${budgetDetailsInFinanceProject.may})`.as("may"),
            june: sql`SUM(${budgetDetailsInFinanceProject.june})`.as("june"),
            july: sql`SUM(${budgetDetailsInFinanceProject.july})`.as("july"),
            august: sql`SUM(${budgetDetailsInFinanceProject.august})`.as(
              "august",
            ),
            september: sql`SUM(${budgetDetailsInFinanceProject.september})`.as(
              "september",
            ),
            october: sql`SUM(${budgetDetailsInFinanceProject.october})`.as(
              "october",
            ),
            november: sql`SUM(${budgetDetailsInFinanceProject.november})`.as(
              "november",
            ),
            december: sql`SUM(${budgetDetailsInFinanceProject.december})`.as(
              "december",
            ),
            january: sql`SUM(${budgetDetailsInFinanceProject.january})`.as(
              "january",
            ),
            february: sql`SUM(${budgetDetailsInFinanceProject.february})`.as(
              "february",
            ),
            march: sql`SUM(${budgetDetailsInFinanceProject.march})`.as("march"),
            q1: sql`SUM(${budgetDetailsInFinanceProject.q1})`.as("q1"),
            q2: sql`SUM(${budgetDetailsInFinanceProject.q2})`.as("q2"),
            q3: sql`SUM(${budgetDetailsInFinanceProject.q3})`.as("q3"),
            q4: sql`SUM(${budgetDetailsInFinanceProject.q4})`.as("q4"),
            amount1: sql`SUM(${budgetDetailsInFinanceProject.amount1})`.as(
              "amount1",
            ),
            amount2: sql`SUM(${budgetDetailsInFinanceProject.amount2})`.as(
              "amount2",
            ),
            amount3: sql`SUM(${budgetDetailsInFinanceProject.amount3})`.as(
              "amount3",
            ),
            amount4: sql`SUM(${budgetDetailsInFinanceProject.amount4})`.as(
              "amount4",
            ),
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
      } else {
        result = await ctx.db
          .select()
          .from(budgetDetailsInFinanceProject)
          .where(and(...baseConditions));
      }
      console.log(result, " get program result");
      return {
        subCategories,
        budgetId: input.budgetId,
        result,
        subDeptId: input.subDeptId,
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
    }),
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
          eq(
            categoryHierarchyInFinanceProject.catId,
            categoryMasterInFinanceProject.id,
          ),
        )
        .where(eq(categoryHierarchyInFinanceProject.parentId, input.catId));
      if (!subCategories) throw new Error("Failed to get the subcategories");
      // category budgetDetails call
      const baseConditions = [
        eq(budgetDetailsInFinanceProject.catid, input.catId),
      ];
      const budgetMasterbaseCondition = [
        eq(budgetMasterInFinanceProject.financialYear, input.financialYear),
      ];
      if (input.budgetId != 0)
        baseConditions.push(
          eq(budgetDetailsInFinanceProject.budgetid, input.budgetId),
        );
      if (input.deptId != 0) {
        baseConditions.push(
          eq(budgetDetailsInFinanceProject.deptid, input.deptId),
        );
        budgetMasterbaseCondition.push(
          eq(budgetMasterInFinanceProject.departmentId, input.deptId),
        );
      }
      if (input.subDeptId != 0)
        baseConditions.push(
          eq(budgetDetailsInFinanceProject.subDeptid, input.subDeptId),
        );

      // Add activity condition if it is not null or undefined
      if (
        input.activity !== null &&
        input.activity !== undefined &&
        input.activity != "0"
      ) {
        baseConditions.push(
          eq(budgetDetailsInFinanceProject.activity, input.activity),
        );
      }
      let result;
      // Execute the query with all conditions
      if (input.activity == "0") {
        result = await ctx.db
          .select({
            subcategoryId: budgetDetailsInFinanceProject.subcategoryId,
            april: sql`SUM(${budgetDetailsInFinanceProject.april})`.as("april"),
            may: sql`SUM(${budgetDetailsInFinanceProject.may})`.as("may"),
            june: sql`SUM(${budgetDetailsInFinanceProject.june})`.as("june"),
            july: sql`SUM(${budgetDetailsInFinanceProject.july})`.as("july"),
            august: sql`SUM(${budgetDetailsInFinanceProject.august})`.as(
              "august",
            ),
            september: sql`SUM(${budgetDetailsInFinanceProject.september})`.as(
              "september",
            ),
            october: sql`SUM(${budgetDetailsInFinanceProject.october})`.as(
              "october",
            ),
            november: sql`SUM(${budgetDetailsInFinanceProject.november})`.as(
              "november",
            ),
            december: sql`SUM(${budgetDetailsInFinanceProject.december})`.as(
              "december",
            ),
            january: sql`SUM(${budgetDetailsInFinanceProject.january})`.as(
              "january",
            ),
            february: sql`SUM(${budgetDetailsInFinanceProject.february})`.as(
              "february",
            ),
            march: sql`SUM(${budgetDetailsInFinanceProject.march})`.as("march"),
            q1: sql`SUM(${budgetDetailsInFinanceProject.q1})`.as("q1"),
            q2: sql`SUM(${budgetDetailsInFinanceProject.q2})`.as("q2"),
            q3: sql`SUM(${budgetDetailsInFinanceProject.q3})`.as("q3"),
            q4: sql`SUM(${budgetDetailsInFinanceProject.q4})`.as("q4"),
            amount1: sql`SUM(${budgetDetailsInFinanceProject.amount1})`.as(
              "amount1",
            ),
            amount2: sql`SUM(${budgetDetailsInFinanceProject.amount2})`.as(
              "amount2",
            ),
            amount3: sql`SUM(${budgetDetailsInFinanceProject.amount3})`.as(
              "amount3",
            ),
            amount4: sql`SUM(${budgetDetailsInFinanceProject.amount4})`.as(
              "amount4",
            ),
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
      } else if (input.deptId == 0 || input.subDeptId == 0) {
        const budgetMasterIds = await ctx.db
          .select({
            id: budgetMasterInFinanceProject.id,
          })
          .from(budgetMasterInFinanceProject)
          .where(and(...budgetMasterbaseCondition));
        const budgetIds = budgetMasterIds.map((record) => record.id);
        const budgetRetrivalConditions = [
          ...baseConditions,
          inArray(budgetDetailsInFinanceProject.budgetid, budgetIds),
        ];
        result = await ctx.db
          .select({
            subcategoryId: budgetDetailsInFinanceProject.subcategoryId,
            april: sql`SUM(${budgetDetailsInFinanceProject.april})`.as("april"),
            may: sql`SUM(${budgetDetailsInFinanceProject.may})`.as("may"),
            june: sql`SUM(${budgetDetailsInFinanceProject.june})`.as("june"),
            july: sql`SUM(${budgetDetailsInFinanceProject.july})`.as("july"),
            august: sql`SUM(${budgetDetailsInFinanceProject.august})`.as(
              "august",
            ),
            september: sql`SUM(${budgetDetailsInFinanceProject.september})`.as(
              "september",
            ),
            october: sql`SUM(${budgetDetailsInFinanceProject.october})`.as(
              "october",
            ),
            november: sql`SUM(${budgetDetailsInFinanceProject.november})`.as(
              "november",
            ),
            december: sql`SUM(${budgetDetailsInFinanceProject.december})`.as(
              "december",
            ),
            january: sql`SUM(${budgetDetailsInFinanceProject.january})`.as(
              "january",
            ),
            february: sql`SUM(${budgetDetailsInFinanceProject.february})`.as(
              "february",
            ),
            march: sql`SUM(${budgetDetailsInFinanceProject.march})`.as("march"),
            q1: sql`SUM(${budgetDetailsInFinanceProject.q1})`.as("q1"),
            q2: sql`SUM(${budgetDetailsInFinanceProject.q2})`.as("q2"),
            q3: sql`SUM(${budgetDetailsInFinanceProject.q3})`.as("q3"),
            q4: sql`SUM(${budgetDetailsInFinanceProject.q4})`.as("q4"),
            amount1: sql`SUM(${budgetDetailsInFinanceProject.amount1})`.as(
              "amount1",
            ),
            amount2: sql`SUM(${budgetDetailsInFinanceProject.amount2})`.as(
              "amount2",
            ),
            amount3: sql`SUM(${budgetDetailsInFinanceProject.amount3})`.as(
              "amount3",
            ),
            amount4: sql`SUM(${budgetDetailsInFinanceProject.amount4})`.as(
              "amount4",
            ),
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
      } else {
        result = await ctx.db
          .select()
          .from(budgetDetailsInFinanceProject)
          .where(and(...baseConditions));
      }

      return {
        subCategories,
        budgetId: input.budgetId,
        result,
        subDeptId: input.subDeptId,
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
    }),
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
          eq(
            categoryHierarchyInFinanceProject.catId,
            categoryMasterInFinanceProject.id,
          ),
        )
        .where(eq(categoryHierarchyInFinanceProject.parentId, input.catId));
      if (!subCategories) throw new Error("Failed to get the subcategories");
      // category budgetDetails call
      const baseConditions = [
        eq(budgetDetailsInFinanceProject.catid, input.catId),
      ];
      const budgetMasterbaseCondition = [
        eq(budgetMasterInFinanceProject.financialYear, input.financialYear),
      ];
      if (input.budgetId != 0)
        baseConditions.push(
          eq(budgetDetailsInFinanceProject.budgetid, input.budgetId),
        );
      if (input.deptId != 0) {
        baseConditions.push(
          eq(budgetDetailsInFinanceProject.deptid, input.deptId),
        );
        budgetMasterbaseCondition.push(
          eq(budgetMasterInFinanceProject.departmentId, input.deptId),
        );
      }
      if (input.subDeptId != 0)
        baseConditions.push(
          eq(budgetDetailsInFinanceProject.subDeptid, input.subDeptId),
        );

      // Add activity condition if it is not null or undefined
      if (
        input.activity !== null &&
        input.activity !== undefined &&
        input.activity != "0"
      ) {
        baseConditions.push(
          eq(budgetDetailsInFinanceProject.activity, input.activity),
        );
      }
      let result;
      // Execute the query with all conditions
      if (input.activity == "0") {
        result = await ctx.db
          .select({
            subcategoryId: budgetDetailsInFinanceProject.subcategoryId,
            april: sql`SUM(${budgetDetailsInFinanceProject.april})`.as("april"),
            may: sql`SUM(${budgetDetailsInFinanceProject.may})`.as("may"),
            june: sql`SUM(${budgetDetailsInFinanceProject.june})`.as("june"),
            july: sql`SUM(${budgetDetailsInFinanceProject.july})`.as("july"),
            august: sql`SUM(${budgetDetailsInFinanceProject.august})`.as(
              "august",
            ),
            september: sql`SUM(${budgetDetailsInFinanceProject.september})`.as(
              "september",
            ),
            october: sql`SUM(${budgetDetailsInFinanceProject.october})`.as(
              "october",
            ),
            november: sql`SUM(${budgetDetailsInFinanceProject.november})`.as(
              "november",
            ),
            december: sql`SUM(${budgetDetailsInFinanceProject.december})`.as(
              "december",
            ),
            january: sql`SUM(${budgetDetailsInFinanceProject.january})`.as(
              "january",
            ),
            february: sql`SUM(${budgetDetailsInFinanceProject.february})`.as(
              "february",
            ),
            march: sql`SUM(${budgetDetailsInFinanceProject.march})`.as("march"),
            q1: sql`SUM(${budgetDetailsInFinanceProject.q1})`.as("q1"),
            q2: sql`SUM(${budgetDetailsInFinanceProject.q2})`.as("q2"),
            q3: sql`SUM(${budgetDetailsInFinanceProject.q3})`.as("q3"),
            q4: sql`SUM(${budgetDetailsInFinanceProject.q4})`.as("q4"),
            amount1: sql`SUM(${budgetDetailsInFinanceProject.amount1})`.as(
              "amount1",
            ),
            amount2: sql`SUM(${budgetDetailsInFinanceProject.amount2})`.as(
              "amount2",
            ),
            amount3: sql`SUM(${budgetDetailsInFinanceProject.amount3})`.as(
              "amount3",
            ),
            amount4: sql`SUM(${budgetDetailsInFinanceProject.amount4})`.as(
              "amount4",
            ),
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
      } else if (input.deptId == 0 || input.subDeptId == 0) {
        const budgetMasterIds = await ctx.db
          .select({
            id: budgetMasterInFinanceProject.id,
          })
          .from(budgetMasterInFinanceProject)
          .where(and(...budgetMasterbaseCondition));
        const budgetIds = budgetMasterIds.map((record) => record.id);
        const budgetRetrivalConditions = [
          ...baseConditions,
          inArray(budgetDetailsInFinanceProject.budgetid, budgetIds),
        ];
        result = await ctx.db
          .select({
            subcategoryId: budgetDetailsInFinanceProject.subcategoryId,
            april: sql`SUM(${budgetDetailsInFinanceProject.april})`.as("april"),
            may: sql`SUM(${budgetDetailsInFinanceProject.may})`.as("may"),
            june: sql`SUM(${budgetDetailsInFinanceProject.june})`.as("june"),
            july: sql`SUM(${budgetDetailsInFinanceProject.july})`.as("july"),
            august: sql`SUM(${budgetDetailsInFinanceProject.august})`.as(
              "august",
            ),
            september: sql`SUM(${budgetDetailsInFinanceProject.september})`.as(
              "september",
            ),
            october: sql`SUM(${budgetDetailsInFinanceProject.october})`.as(
              "october",
            ),
            november: sql`SUM(${budgetDetailsInFinanceProject.november})`.as(
              "november",
            ),
            december: sql`SUM(${budgetDetailsInFinanceProject.december})`.as(
              "december",
            ),
            january: sql`SUM(${budgetDetailsInFinanceProject.january})`.as(
              "january",
            ),
            february: sql`SUM(${budgetDetailsInFinanceProject.february})`.as(
              "february",
            ),
            march: sql`SUM(${budgetDetailsInFinanceProject.march})`.as("march"),
            q1: sql`SUM(${budgetDetailsInFinanceProject.q1})`.as("q1"),
            q2: sql`SUM(${budgetDetailsInFinanceProject.q2})`.as("q2"),
            q3: sql`SUM(${budgetDetailsInFinanceProject.q3})`.as("q3"),
            q4: sql`SUM(${budgetDetailsInFinanceProject.q4})`.as("q4"),
            amount1: sql`SUM(${budgetDetailsInFinanceProject.amount1})`.as(
              "amount1",
            ),
            amount2: sql`SUM(${budgetDetailsInFinanceProject.amount2})`.as(
              "amount2",
            ),
            amount3: sql`SUM(${budgetDetailsInFinanceProject.amount3})`.as(
              "amount3",
            ),
            amount4: sql`SUM(${budgetDetailsInFinanceProject.amount4})`.as(
              "amount4",
            ),
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
      } else {
        result = await ctx.db
          .select()
          .from(budgetDetailsInFinanceProject)
          .where(and(...baseConditions));
      }

      return {
        subCategories,
        budgetId: input.budgetId,
        result,
        subDeptId: input.subDeptId,
      };
    } catch (error) {
      console.error("Error in getting staff level count:", error);
      throw new Error("Failed to get staff level count. Please try again.");
    }
  });
export const updateBudgetDetails = protectedProcedure
.input(
    z.object({
      data: z.array(
        z.object({
          budgetDetailsId: z.number(),
          budgetid: z.number(),
          catid: z.number(),
          subDeptId: z.number(),
          subcategoryId: z.number(),
          activity: z.string(),
          unit: z.number(),
          rate: z.string(),
          total: z.string(),
          currency: z.string(),
          notes: z.string().optional(),
          description: z.string().optional(),
          aprQty: z.number().optional(),
          aprRate: z.number().optional(),
          aprAmt: z.number().optional(),
          april: z.number(),
          mayQty: z.number().optional(),
          mayRate: z.number().optional(),
          mayAmt: z.number().optional(),
          may: z.number(),
          junQty: z.number().optional(),
          junRate: z.number().optional(),
          junAmt: z.number().optional(),
          june: z.number(),
          julQty: z.number().optional(),
          julRate: z.number().optional(),
          julAmt: z.number().optional(),
          july: z.number(),
          augQty: z.number().optional(),
          augRate: z.number().optional(),
          augAmt: z.number().optional(),
          august: z.number(),
          sepQty: z.number().optional(),
          sepRate: z.number().optional(),
          sepAmt: z.number().optional(),
          september: z.number(),
          octQty: z.number().optional(),
          octRate: z.number().optional(),
          octAmt: z.number().optional(),
          october: z.number(),
          novQty: z.number().optional(),
          novRate: z.number().optional(),
          novAmt: z.number().optional(),
          november: z.number(),
          decQty: z.number().optional(),
          decRate: z.number().optional(),
          decAmt: z.number().optional(),
          december: z.number(),
          janQty: z.number().optional(),
          janRate: z.number().optional(),
          janAmt: z.number().optional(),
          january: z.number(),
          febQty: z.number().optional(),
          febRate: z.number().optional(),
          febAmt: z.number().optional(),
          february: z.number(),
          marQty: z.number().optional(),
          marRate: z.number().optional(),
          marAmt: z.number().optional(),
          march: z.number(),
          deptId: z.number(),
          updatedBy: z.number(),
          updatedAt: z.string(),
        }),
      ),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    try {
      const { data } = input;

      // Perform updates for each budget detail record
      for (const item of data) {
        const updates = {
            budgetid: item.budgetid,
            catid: item.catid,
            sub_deptid: item.subDeptId,
            deptid: item.deptId,
            subcategoryId: item.subcategoryId,
            unit: item.unit,
            rate: item.rate,
            total: item.total,
            currency: item.currency,
            notes: item.notes ?? null,
            description: item.description ?? null,
            aprQty: item.aprQty ?? 0,
            aprRate: item.aprRate !== undefined ? String(item.aprRate) : "0",
            aprAmt: item.aprAmt !== undefined ? String(item.aprAmt) : "0",
            april: item.april !== undefined ? String(item.april) : "0",
            mayQty: item.mayQty ?? 0,
            mayRate: item.mayRate !== undefined ? String(item.mayRate) : "0",
            mayAmt: item.mayAmt !== undefined ? String(item.mayAmt) : "0",
            may: item.may !== undefined ? String(item.may) : "0",
            junQty: item.junQty ?? 0,
            junRate: item.junRate !== undefined ? String(item.junRate) : "0",
            junAmt: item.junAmt !== undefined ? String(item.junAmt) : "0",
            june: item.june !== undefined ? String(item.june) : "0",
            julQty: item.julQty ?? 0,
            julRate: item.julRate !== undefined ? String(item.julRate) : "0",
            julAmt: item.julAmt !== undefined ? String(item.julAmt) : "0",
            july: item.july !== undefined ? String(item.july) : "0",
            augQty: item.augQty ?? 0,
            augRate: item.augRate !== undefined ? String(item.augRate) : "0",
            augAmt: item.augAmt !== undefined ? String(item.augAmt) : "0",
            august: item.august !== undefined ? String(item.august) : "0",
            sepQty: item.sepQty ?? 0,
            sepRate: item.sepRate !== undefined ? String(item.sepRate) : "0",
            sepAmt: item.sepAmt !== undefined ? String(item.sepAmt) : "0",
            september:
              item.september !== undefined ? String(item.september) : "0",
            octQty: item.octQty ?? 0,
            octRate: item.octRate !== undefined ? String(item.octRate) : "0",
            octAmt: item.octAmt !== undefined ? String(item.octAmt) : "0",
            october: item.october !== undefined ? String(item.october) : "0",
            novQty: item.novQty ?? 0,
            novRate: item.novRate !== undefined ? String(item.novRate) : "0",
            novAmt: item.novAmt !== undefined ? String(item.novAmt) : "0",
            november: item.november !== undefined ? String(item.november) : "0",
            decQty: item.decQty ?? 0,
            decRate: item.decRate !== undefined ? String(item.decRate) : "0",
            decAmt: item.decAmt !== undefined ? String(item.decAmt) : "0",
            december: item.december !== undefined ? String(item.december) : "0",
            janQty: item.janQty ?? 0,
            janRate: item.janRate !== undefined ? String(item.janRate) : "0",
            janAmt: item.janAmt !== undefined ? String(item.janAmt) : "0",
            january: item.january !== undefined ? String(item.january) : "0",
            febQty: item.febQty ?? 0,
            febRate: item.febRate !== undefined ? String(item.febRate) : "0",
            febAmt: item.febAmt !== undefined ? String(item.febAmt) : "0",
            february: item.february !== undefined ? String(item.february) : "0",
            marQty: item.marQty ?? 0,
            marRate: item.marRate !== undefined ? String(item.marRate) : "0",
            marAmt: item.marAmt !== undefined ? String(item.marAmt) : "0",
            march: item.march !== undefined ? String(item.march) : "0",
            activity: item.activity,
            isactive: true,
            updatedBy: item.updatedBy,
            updatedAt: item.updatedAt,
            q1: (
              (item.april ?? 0) +
              (item.may ?? 0) +
              (item.june ?? 0)
            ).toString(),
            q2: (
              (item.july ?? 0) +
              (item.august ?? 0) +
              (item.september ?? 0)
            ).toString(),
            q3: (
              (item.october ?? 0) +
              (item.november ?? 0) +
              (item.december ?? 0)
            ).toString(),
            q4: (
              (item.january ?? 0) +
              (item.february ?? 0) +
              (item.march ?? 0)
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
  .input(
    z.object({
      budgetId: z.number(),
      status: z.string(),
      userId: z.number(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const { status, budgetId, userId } = input;
    const updatedStatus = await ctx.db
      .update(budgetMasterInFinanceProject)
      .set({ status, approvedBy: userId })
      .where(eq(budgetMasterInFinanceProject.id, budgetId));
    if (updatedStatus) return { message: "status update successfull" };
    else return { message: "status update was not successfull" };
  });
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
        }),
      ),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    try {
      // Extract data from input
      const { deptId, budgetId, catId, travelCatId, data } = input;
      // Map data to include shared fields and default values
      const recordsToInsert = [];
      for (const item of data) {
        const existingRecord = await ctx.db
          .select()
          .from(budgetDetailsInFinanceProject)
          .where(
            and(
              eq(budgetDetailsInFinanceProject.budgetid, budgetId),
              eq(budgetDetailsInFinanceProject.catid, catId),
              eq(
                budgetDetailsInFinanceProject.subcategoryId,
                item.subcategoryId,
              ),
              eq(budgetDetailsInFinanceProject.activity, item.activity ?? ""),
              eq(budgetDetailsInFinanceProject.subDeptid, item.subDeptId),
            ),
          );
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
          });
        }
      }
      // Insert data using Drizzle
      const insertedRecords = await ctx.db
        .insert(budgetDetailsInFinanceProject)
        .values(recordsToInsert)
        .returning();

      const response = insertedRecords.map((record) => ({
        budgetDetailsId: record.id,
        subcategoryId: record.subcategoryId,
        categoryId: record.catid,
      }));
      // if the travel data present then we going to update that from here only
      const travelData = await ctx.db
        .select()
        .from(budgetDetailsInFinanceProject)
        .where(
          and(
            eq(budgetDetailsInFinanceProject.budgetid, budgetId),
            eq(budgetDetailsInFinanceProject.catid, travelCatId),
            eq(budgetDetailsInFinanceProject.subcategoryId, input.subDeptId),
          ),
        );
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
            .where(
              and(
                eq(budgetDetailsInFinanceProject.budgetid, budgetId),
                eq(
                  budgetDetailsInFinanceProject.subcategoryId,
                  item.subcategoryId,
                ),
                eq(budgetDetailsInFinanceProject.catid, travelCatId),
                eq(budgetDetailsInFinanceProject.subDeptid, input.subDeptId),
              ),
            );
        }
      }
      return {
        success: true,
        message: "Budget details added successfully",
        data: response,
      };
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
        }),
      ),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    try {
      const { data, budgetId, travelCatId } = input;
      console.log(budgetId, travelCatId, input.subDeptId);

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
        .where(
          and(
            eq(budgetDetailsInFinanceProject.budgetid, budgetId),
            eq(budgetDetailsInFinanceProject.catid, travelCatId),
            eq(budgetDetailsInFinanceProject.subDeptid, input.subDeptId),
          ),
        );
      console.log(travelData);
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
            .where(
              and(
                eq(budgetDetailsInFinanceProject.budgetid, budgetId),
                eq(
                  budgetDetailsInFinanceProject.subcategoryId,
                  item.subcategoryId,
                ),
                eq(budgetDetailsInFinanceProject.catid, travelCatId),
                eq(budgetDetailsInFinanceProject.subDeptid, input.subDeptId),
              ),
            );
        }
      }

      return { success: true, message: "Budget details updated successfully" };
    } catch (error) {
      console.error("Error in updating budget details:", error);
      throw new Error("Failed to update budget details. Please try again.");
    }
  });

export const getSubDepts = protectedProcedure
  .input(
    z.object({
      deptId: z.number(),
    }),
  )
  .query(async ({ ctx, input }) => {
    const { deptId } = input;
    const baseConditions = [];
    if (deptId != 0) {
      baseConditions.push(
        eq(departmentHierarchyInFinanceProject.parentId, deptId),
      );
    }
    const subdepartments = await ctx.db
      .select({
        id: departmentMasterInFinanceProject.id,
        name: departmentMasterInFinanceProject.departmentname,
      })
      .from(departmentMasterInFinanceProject)
      .innerJoin(
        departmentHierarchyInFinanceProject,
        eq(
          departmentHierarchyInFinanceProject.deptId,
          departmentMasterInFinanceProject.id,
        ),
      )
      .where(and(...baseConditions));
    return { subdepartments };
  });
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
          aprQty: z.number().optional(),
          aprRate: z.number().optional(),
          aprAmt: z.number().optional(),
          april: z.number(),
          mayQty: z.number().optional(),
          mayRate: z.number().optional(),
          mayAmt: z.number().optional(),
          may: z.number(),
          junQty: z.number().optional(),
          junRate: z.number().optional(),
          junAmt: z.number().optional(),
          june: z.number(),
          julQty: z.number().optional(),
          julRate: z.number().optional(),
          julAmt: z.number().optional(),
          july: z.number(),
          augQty: z.number().optional(),
          augRate: z.number().optional(),
          augAmt: z.number().optional(),
          august: z.number(),
          sepQty: z.number().optional(),
          sepRate: z.number().optional(),
          sepAmt: z.number().optional(),
          september: z.number(),
          octQty: z.number().optional(),
          octRate: z.number().optional(),
          octAmt: z.number().optional(),
          october: z.number(),
          novQty: z.number().optional(),
          novRate: z.number().optional(),
          novAmt: z.number().optional(),
          november: z.number(),
          decQty: z.number().optional(),
          decRate: z.number().optional(),
          decAmt: z.number().optional(),
          december: z.number(),
          janQty: z.number().optional(),
          janRate: z.number().optional(),
          janAmt: z.number().optional(),
          january: z.number(),
          febQty: z.number().optional(),
          febRate: z.number().optional(),
          febAmt: z.number().optional(),
          february: z.number(),
          marQty: z.number().optional(),
          marRate: z.number().optional(),
          marAmt: z.number().optional(),
          march: z.number(),
          activity: z.string().optional(),
          deptId: z.number(),
          createdBy: z.number(),
          createdAt: z.string(),
        }),
      ),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    try {
      console.log(input, "save travel budget details");
      // Extract data from input
      const { deptId, budgetId, catId, subDeptId, travel_typeid, data } = input;
      // Map data to include shared fields and default values

      const recordsToInsert = [];
      for (const item of data) {
        const baseConditions = [
          eq(budgetDetailsInFinanceProject.budgetid, budgetId),
          eq(budgetDetailsInFinanceProject.catid, catId),
          eq(budgetDetailsInFinanceProject.subcategoryId, item.subcategoryId),
          eq(budgetDetailsInFinanceProject.activity, item.activity ?? ""),
          eq(budgetDetailsInFinanceProject.subDeptid, subDeptId),
        ];

        const existingRecord = await ctx.db
          .select()
          .from(budgetDetailsInFinanceProject)
          .where(and(...baseConditions));
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
            aprQty: item.aprQty ?? 0,
            aprRate: item.aprRate !== undefined ? String(item.aprRate) : "0",
            aprAmt: item.aprAmt !== undefined ? String(item.aprAmt) : "0",
            april: item.april !== undefined ? String(item.april) : "0",
            mayQty: item.mayQty ?? 0,
            mayRate: item.mayRate !== undefined ? String(item.mayRate) : "0",
            mayAmt: item.mayAmt !== undefined ? String(item.mayAmt) : "0",
            may: item.may !== undefined ? String(item.may) : "0",
            junQty: item.junQty ?? 0,
            junRate: item.junRate !== undefined ? String(item.junRate) : "0",
            junAmt: item.junAmt !== undefined ? String(item.junAmt) : "0",
            june: item.june !== undefined ? String(item.june) : "0",
            julQty: item.julQty ?? 0,
            julRate: item.julRate !== undefined ? String(item.julRate) : "0",
            julAmt: item.julAmt !== undefined ? String(item.julAmt) : "0",
            july: item.july !== undefined ? String(item.july) : "0",
            augQty: item.augQty ?? 0,
            augRate: item.augRate !== undefined ? String(item.augRate) : "0",
            augAmt: item.augAmt !== undefined ? String(item.augAmt) : "0",
            august: item.august !== undefined ? String(item.august) : "0",
            sepQty: item.sepQty ?? 0,
            sepRate: item.sepRate !== undefined ? String(item.sepRate) : "0",
            sepAmt: item.sepAmt !== undefined ? String(item.sepAmt) : "0",
            september:
              item.september !== undefined ? String(item.september) : "0",
            octQty: item.octQty ?? 0,
            octRate: item.octRate !== undefined ? String(item.octRate) : "0",
            octAmt: item.octAmt !== undefined ? String(item.octAmt) : "0",
            october: item.october !== undefined ? String(item.october) : "0",
            novQty: item.novQty ?? 0,
            novRate: item.novRate !== undefined ? String(item.novRate) : "0",
            novAmt: item.novAmt !== undefined ? String(item.novAmt) : "0",
            november: item.november !== undefined ? String(item.november) : "0",
            decQty: item.decQty ?? 0,
            decRate: item.decRate !== undefined ? String(item.decRate) : "0",
            decAmt: item.decAmt !== undefined ? String(item.decAmt) : "0",
            december: item.december !== undefined ? String(item.december) : "0",
            janQty: item.janQty ?? 0,
            janRate: item.janRate !== undefined ? String(item.janRate) : "0",
            janAmt: item.janAmt !== undefined ? String(item.janAmt) : "0",
            january: item.january !== undefined ? String(item.january) : "0",
            febQty: item.febQty ?? 0,
            febRate: item.febRate !== undefined ? String(item.febRate) : "0",
            febAmt: item.febAmt !== undefined ? String(item.febAmt) : "0",
            february: item.february !== undefined ? String(item.february) : "0",
            marQty: item.marQty ?? 0,
            marRate: item.marRate !== undefined ? String(item.marRate) : "0",
            marAmt: item.marAmt !== undefined ? String(item.marAmt) : "0",
            march: item.march !== undefined ? String(item.march) : "0",
            activity: item.activity ?? null,
            isactive: true,
            createdBy: item.createdBy,
            createdAt: item.createdAt,
            updatedAt: null,
            updatedBy: null,
            q1: (
              (item.april ?? 0) +
              (item.may ?? 0) +
              (item.june ?? 0)
            ).toString(),
            q2: (
              (item.july ?? 0) +
              (item.august ?? 0) +
              (item.september ?? 0)
            ).toString(),
            q3: (
              (item.october ?? 0) +
              (item.november ?? 0) +
              (item.december ?? 0)
            ).toString(),
            q4: (
              (item.january ?? 0) +
              (item.february ?? 0) +
              (item.march ?? 0)
            ).toString(),
          });
        }
      }
      // Insert data using Drizzle
      const insertedRecords = await ctx.db
        .insert(budgetDetailsInFinanceProject)
        .values(recordsToInsert)
        .returning();

      const response = insertedRecords.map((record) => ({
        budgetDetailsId: record.id,
        subcategoryId: record.subcategoryId,
        categoryId: record.catid,
      }));

      return {
        success: true,
        message: "Budget details added successfully",
        data: response,
      };
    } catch (error) {
      console.error("Error in adding budget details:", error);
      throw new Error("Failed to add budget details. Please try again.");
    }
  });

export const updateTravelBudgetDetails = protectedProcedure
  .input(
    z.object({
      data: z.array(
        z.object({
          budgetid: z.number(),
          catid: z.number(),
          deptid: z.number(),
          subdeptid: z.number(),
          budgetDetailsId: z.number(),
          subcategoryId: z.number(),
          unit: z.number(),
          rate: z.string(),
          total: z.string(),
          currency: z.string(),
          notes: z.string().optional(),
          description: z.string().optional(),
          aprQty: z.number().optional(),
          aprRate: z.number().optional(),
          aprAmt: z.number().optional(),
          april: z.number(),
          mayQty: z.number().optional(),
          mayRate: z.number().optional(),
          mayAmt: z.number().optional(),
          may: z.number(),
          junQty: z.number().optional(),
          junRate: z.number().optional(),
          junAmt: z.number().optional(),
          june: z.number(),
          julQty: z.number().optional(),
          julRate: z.number().optional(),
          julAmt: z.number().optional(),
          july: z.number(),
          augQty: z.number().optional(),
          augRate: z.number().optional(),
          augAmt: z.number().optional(),
          august: z.number(),
          sepQty: z.number().optional(),
          sepRate: z.number().optional(),
          sepAmt: z.number().optional(),
          september: z.number(),
          octQty: z.number().optional(),
          octRate: z.number().optional(),
          octAmt: z.number().optional(),
          october: z.number(),
          novQty: z.number().optional(),
          novRate: z.number().optional(),
          novAmt: z.number().optional(),
          november: z.number(),
          decQty: z.number().optional(),
          decRate: z.number().optional(),
          decAmt: z.number().optional(),
          december: z.number(),
          janQty: z.number().optional(),
          janRate: z.number().optional(),
          janAmt: z.number().optional(),
          january: z.number(),
          febQty: z.number().optional(),
          febRate: z.number().optional(),
          febAmt: z.number().optional(),
          february: z.number(),
          marQty: z.number().optional(),
          marRate: z.number().optional(),
          marAmt: z.number().optional(),
          march: z.number(),
          travel_typeid: z.number(),
          updatedBy: z.number(),
          updatedAt: z.string(),
        }),
      ),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    try {
      const { data } = input;

      for (const item of data) {
        const updates = {
          subcategoryId: item.subcategoryId,
          budgetid: item.budgetid,
          catid: item.catid,
          deptid: item.deptid,
          subdeptid: item.subdeptid,
          unit: item.unit,
          rate: item.rate,
          total: item.total,
          currency: item.currency,
          notes: item.notes ?? null,
          description: item.description ?? null,
          aprQty: item.aprQty ?? 0,
          aprRate: item.aprRate !== undefined ? String(item.aprRate) : "0",
          aprAmt: item.aprAmt !== undefined ? String(item.aprAmt) : "0",
          april: item.april !== undefined ? String(item.april) : "0",
          mayQty: item.mayQty ?? 0,
          mayRate: item.mayRate !== undefined ? String(item.mayRate) : "0",
          mayAmt: item.mayAmt !== undefined ? String(item.mayAmt) : "0",
          may: item.may !== undefined ? String(item.may) : "0",
          junQty: item.junQty ?? 0,
          junRate: item.junRate !== undefined ? String(item.junRate) : "0",
          junAmt: item.junAmt !== undefined ? String(item.junAmt) : "0",
          june: item.june !== undefined ? String(item.june) : "0",
          julQty: item.julQty ?? 0,
          julRate: item.julRate !== undefined ? String(item.julRate) : "0",
          julAmt: item.julAmt !== undefined ? String(item.julAmt) : "0",
          july: item.july !== undefined ? String(item.july) : "0",
          augQty: item.augQty ?? 0,
          augRate: item.augRate !== undefined ? String(item.augRate) : "0",
          augAmt: item.augAmt !== undefined ? String(item.augAmt) : "0",
          august: item.august !== undefined ? String(item.august) : "0",
          sepQty: item.sepQty ?? 0,
          sepRate: item.sepRate !== undefined ? String(item.sepRate) : "0",
          sepAmt: item.sepAmt !== undefined ? String(item.sepAmt) : "0",
          september:
            item.september !== undefined ? String(item.september) : "0",
          octQty: item.octQty ?? 0,
          octRate: item.octRate !== undefined ? String(item.octRate) : "0",
          octAmt: item.octAmt !== undefined ? String(item.octAmt) : "0",
          october: item.october !== undefined ? String(item.october) : "0",
          novQty: item.novQty ?? 0,
          novRate: item.novRate !== undefined ? String(item.novRate) : "0",
          novAmt: item.novAmt !== undefined ? String(item.novAmt) : "0",
          november: item.november !== undefined ? String(item.november) : "0",
          decQty: item.decQty ?? 0,
          decRate: item.decRate !== undefined ? String(item.decRate) : "0",
          decAmt: item.decAmt !== undefined ? String(item.decAmt) : "0",
          december: item.december !== undefined ? String(item.december) : "0",
          janQty: item.janQty ?? 0,
          janRate: item.janRate !== undefined ? String(item.janRate) : "0",
          janAmt: item.janAmt !== undefined ? String(item.janAmt) : "0",
          january: item.january !== undefined ? String(item.january) : "0",
          febQty: item.febQty ?? 0,
          febRate: item.febRate !== undefined ? String(item.febRate) : "0",
          febAmt: item.febAmt !== undefined ? String(item.febAmt) : "0",
          february: item.february !== undefined ? String(item.february) : "0",
          marQty: item.marQty ?? 0,
          marRate: item.marRate !== undefined ? String(item.marRate) : "0",
          marAmt: item.marAmt !== undefined ? String(item.marAmt) : "0",
          march: item.march !== undefined ? String(item.march) : "0",
          isactive: true,
          updatedAt: new Date().toISOString(),
          updatedBy: item.updatedBy,
          travel_typeid: item.travel_typeid,
          q1: (
            (item.april ?? 0) +
            (item.may ?? 0) +
            (item.june ?? 0)
          ).toString(),
          q2: (
            (item.july ?? 0) +
            (item.august ?? 0) +
            (item.september ?? 0)
          ).toString(),
          q3: (
            (item.october ?? 0) +
            (item.november ?? 0) +
            (item.december ?? 0)
          ).toString(),
          q4: (
            (item.january ?? 0) +
            (item.february ?? 0) +
            (item.march ?? 0)
          ).toString(),
        };

        await ctx.db
          .update(budgetDetailsInFinanceProject)
          .set(updates)
          .where(eq(budgetDetailsInFinanceProject.id, item.budgetDetailsId));
      }

      return {
        success: true,
        message: "Travel budget details updated successfully",
      };
    } catch (error) {
      console.error("Error updating travel budget details:", error);
      throw new Error(
        "Failed to update travel budget details. Please try again.",
      );
    }
  });
