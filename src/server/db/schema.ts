import { pgTable, pgSchema, unique, serial, varchar, boolean, date, integer, text, numeric, timestamp, doublePrecision, bigint } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const financeProject = pgSchema("finance_project");


export const categoryMasterInFinanceProject = financeProject.table("category_master", {
	id: serial("id").primaryKey().notNull(),
	categoryname: varchar("categoryname", { length: 50 }).notNull(),
	type: varchar("type", { length: 255 }),
	isactive: boolean("isactive").notNull(),
	description: varchar("description", { length: 255 }),
	notes: varchar("Notes", { length: 255 }),
	createdAt: date("created_at").notNull(),
	updatedAt: date("updated_at"),
	createdBy: integer("created_by").notNull(),
	updatedBy: integer("updated_by"),
},
(table) => {
	return {
		ucName: unique("uc_name").on(table.categoryname),
	}
});

export const costCenterInFinanceProject = financeProject.table("cost_center", {
	id: integer("id").primaryKey().notNull(),
	name: text("name").notNull(),
	type: text("type").notNull(),
	parentId: integer("parent_id").notNull(),
	description: text("description"),
	notes: text("notes"),
	isactive: boolean("isactive").notNull(),
	createdAt: date("created_at").notNull(),
	updatedAt: date("updated_at"),
	createdBy: integer("created_by").notNull(),
	updatedBy: integer("updated_by"),
	code: text("code").notNull(),
},
(table) => {
	return {
		ucCccType: unique("uc_ccc_type").on(table.name, table.description),
	}
});

export const categoryHierarchyInFinanceProject = financeProject.table("category_hierarchy", {
	id: serial("id").primaryKey().notNull(),
	catId: integer("cat_id").notNull(),
	parentId: integer("parent_id").notNull(),
	isactive: boolean("isactive").notNull(),
	notes: text("notes"),
	description: text("description"),
	createdAt: date("created_at").notNull(),
	updatedAt: date("updated_at"),
	createdBy: integer("created_by").notNull(),
	updatedBy: integer("updated_by"),
});

export const donorMasterInFinanceProject = financeProject.table("donor_master", {
	id: serial("id").primaryKey().notNull(),
	name: varchar("name", { length: 255 }).notNull(),
	costCenter: integer("cost_center"),
	finYear: integer("fin_year").notNull(),
	totalBudget: numeric("total_budget", { precision: 8, scale:  2 }).notNull(),
	budgetReceived: numeric("budget_received", { precision: 8, scale:  2 }).notNull(),
	currency: text("currency").notNull(),
	notes: varchar("notes", { length: 255 }),
	description: varchar("description", { length: 255 }),
	isactive: boolean("isactive").notNull(),
	createdAt: date("created_at").notNull(),
	updatedAt: date("updated_at"),
	createdBy: integer("created_by").notNull(),
	updatedBy: integer("updated_by"),
	type: varchar("type", { length: 50 }),
},
(table) => {
	return {
		donorMasterDonorCodeKey: unique("donor_master_donor_code_key").on(table.costCenter),
	}
});

export const roleMasterInFinanceProject = financeProject.table("role_master", {
	id: serial("id").primaryKey().notNull(),
	role: varchar("role", { length: 255 }).notNull(),
});

export const salaryDetailsInFinanceProject = financeProject.table("salary_details", {
	id: integer("id").default(sql`nextval('finance_project.salary_details_id_seq')`).primaryKey().notNull(),
	empId: integer("emp_id").notNull(),
	salary: numeric("salary", { precision: 8, scale:  2 }).notNull(),
	insurance: numeric("insurance", { precision: 8, scale:  2 }),
	bonus: numeric("bonus", { precision: 8, scale:  2 }),
	gratuity: numeric("gratuity", { precision: 8, scale:  2 }),
	epf: numeric("epf", { precision: 8, scale:  2 }),
	pgwPld: numeric("pgw_pld", { precision: 8, scale:  2 }),
	type: varchar("type", { length: 255 }),
	isactive: boolean("isactive").notNull(),
	description: varchar("description", { length: 255 }),
	notes: varchar("Notes", { length: 255 }),
	createdAt: date("created_at").notNull(),
	updatedAt: date("updated_at"),
	createdBy: integer("created_by").notNull(),
	updatedBy: integer("updated_by"),
});

export const locationMasterInFinanceProject = financeProject.table("location_master", {
	id: serial("id").primaryKey().notNull(),
	stateName: varchar("state_name", { length: 100 }).notNull(),
	cityName: varchar("city_name", { length: 100 }).notNull(),
	pinCode: varchar("pin_code", { length: 10 }),
	region: varchar("region", { length: 50 }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
});

export const budgetMasterInFinanceProject = financeProject.table("budget_master", {
	id: serial("id").primaryKey().notNull(),
	name: varchar("name", { length: 255 }).notNull(),
	financialYear: text("financial_year").notNull(),
	notes: varchar("notes", { length: 255 }),
	description: varchar("description", { length: 255 }),
	isactive: boolean("isactive").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	createdBy: integer("created_by").notNull(),
	updatedBy: integer("updated_by"),
	approve: boolean("approve"),
	approvedBy: integer("approved_by"),
	approvedAt: timestamp("approved_at", { withTimezone: true, mode: 'string' }),
	departmentId: integer("department_id"),
	status: varchar("status", { length: 50 }).default('draft'),
});

export const statesMasterInFinanceProject = financeProject.table("states_master", {
	id: serial("id").primaryKey().notNull(),
	name: varchar("name", { length: 100 }).notNull(),
	capital: varchar("capital", { length: 100 }),
	area: doublePrecision("area"),
});

export const tallyDonorInFinanceProject = financeProject.table("tally_donor", {
	id: serial("id").primaryKey().notNull(),
	voucherName: varchar("voucher_name", { length: 25 }).notNull(),
	voucherNum: integer("voucher_num").notNull(),
	ledgerName: varchar("ledger_name", { length: 255 }).notNull(),
	transactionId: text("transaction_id"),
	date: timestamp("date", { withTimezone: true, mode: 'string' }).notNull(),
	accountType: varchar("account_type", { length: 255 }).notNull(),
	amount: numeric("amount", { precision: 12, scale:  2 }).notNull(),
	costCenter: integer("cost_center").notNull(),
	isExpense: text("is_expense").notNull(),
	currency: text("currency").notNull(),
	narration: varchar("narration", { length: 255 }).notNull(),
	notes: varchar("notes", { length: 255 }),
	isactive: boolean("isactive").notNull(),
	createdAt: date("created_at").notNull(),
	updatedAt: date("updated_at"),
	createdBy: integer("created_by").notNull(),
	updatedBy: integer("updated_by"),
	finMonth: text("fin_month").notNull(),
	finYear: text("fin_year").notNull(),
});

export const tallyStaffInFinanceProject = financeProject.table("tally_staff", {
	id: serial("id").primaryKey().notNull(),
	voucherName: varchar("voucher_name", { length: 25 }).notNull(),
	voucherNum: integer("voucher_num").notNull(),
	ledgerName: varchar("ledger_name", { length: 255 }).notNull(),
	transactionId: text("transaction_id"),
	date: date("date").notNull(),
	accountType: varchar("account_type", { length: 255 }).notNull(),
	amount: numeric("amount", { precision: 8, scale:  2 }).notNull(),
	empNo: integer("emp_no").notNull(),
	isExpense: text("is_expense").notNull(),
	currency: text("currency").notNull(),
	narration: varchar("narration", { length: 255 }).notNull(),
	notes: varchar("notes", { length: 255 }),
	isactive: boolean("isactive").notNull(),
	createdAt: date("created_at"),
	updatedAt: date("updated_at"),
	createdBy: integer("created_by"),
	updatedBy: integer("updated_by"),
	finMonth: text("fin_month").notNull(),
	finYear: text("fin_year").notNull(),
});

export const tallyDepartmentInFinanceProject = financeProject.table("tally_department", {
	id: serial("id").primaryKey().notNull(),
	voucherName: varchar("voucher_name", { length: 25 }).notNull(),
	voucherNum: integer("voucher_num").notNull(),
	ledgerName: varchar("ledger_name", { length: 255 }).notNull(),
	transactionId: text("transaction_id"),
	date: timestamp("date", { withTimezone: true, mode: 'string' }).notNull(),
	accountType: varchar("account_type", { length: 255 }).notNull(),
	amount: numeric("amount", { precision: 12, scale:  2 }).notNull(),
	costCenter: integer("cost_center").notNull(),
	isExpense: text("is_expense").notNull(),
	currency: text("currency").notNull(),
	narration: varchar("narration", { length: 255 }).notNull(),
	notes: varchar("notes", { length: 255 }),
	isactive: boolean("isactive").notNull(),
	createdAt: date("created_at").notNull(),
	updatedAt: date("updated_at"),
	createdBy: integer("created_by").notNull(),
	updatedBy: integer("updated_by"),
	finMonth: text("fin_month").notNull(),
	finYear: text("fin_year").notNull(),
});

export const programActivitiesInFinanceProject = financeProject.table("program_activities", {
	id: serial("id").primaryKey().notNull(),
	name: varchar("name", { length: 255 }).notNull(),
	description: text("description"),
	departmentId: integer("department_id"),
	subDepartmentId: integer("sub_department_id"),
	financialYear: varchar("financial_year", { length: 10 }),
	isActive: boolean("is_active").default(true),
	budgetid: integer("budgetid"),
	createdBy: integer("created_by"),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	updatedBy: integer("updated_by"),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
});

export const departmentHierarchyInFinanceProject = financeProject.table("department_hierarchy", {
	id: serial("id").primaryKey().notNull(),
	deptId: integer("dept_id").notNull(),
	parentId: integer("parent_id").notNull(),
	isactive: boolean("isactive").notNull(),
	notes: text("notes"),
	description: text("description"),
	createdAt: date("created_at").notNull(),
	updatedAt: date("updated_at"),
	createdBy: integer("created_by").notNull(),
	updatedBy: integer("updated_by"),
});

export const departmentMasterInFinanceProject = financeProject.table("department_master", {
	id: serial("id").primaryKey().notNull(),
	departmentname: varchar("departmentname", { length: 255 }).notNull(),
	type: varchar("type", { length: 255 }).notNull(),
	deptCode: integer("dept_code"),
	isactive: boolean("isactive").notNull(),
	notes: varchar("notes", { length: 255 }),
	description: varchar("description", { length: 255 }),
	createdAt: date("created_at").notNull(),
	updatedAt: date("updated_at"),
	createdBy: integer("created_by").notNull(),
	updatedBy: integer("updated_by"),
},
(table) => {
	return {
		departmentMasterDepartmentnameKey: unique("department_master_departmentname_key").on(table.departmentname),
		departmentMasterDeptCodeKey: unique("department_master_dept_code_key").on(table.deptCode),
	}
});

export const staffMasterInFinanceProject = financeProject.table("staff_master", {
	id: serial("id").primaryKey().notNull(),
	name: varchar("name", { length: 25 }).notNull(),
	empNo: text("emp_no").notNull(),
	isactive: boolean("isactive").notNull(),
	notes: varchar("notes", { length: 255 }),
	description: varchar("description", { length: 255 }),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
	createdBy: integer("created_by").notNull(),
	updatedBy: integer("updated_by"),
	department: integer("department").notNull(),
	designation: varchar("designation", { length: 155 }),
	natureOfEmployment: varchar("nature_of_employment", { length: 70 }),
	program: varchar("program", { length: 70 }),
	stateId: varchar("state_id", { length: 255 }),
	locationId: varchar("location_id", { length: 255 }),
	level: integer("level"),
	email: varchar("email", { length: 255 }),
	subDeptid: integer("sub_deptid"),
	project: varchar("project", { length: 255 }),
},
(table) => {
	return {
		staffMasterEmpNoKey: unique("staff_master_emp_no_key").on(table.empNo),
	}
});

export const userMasterInFinanceProject = financeProject.table("user_master", {
	id: integer("id").primaryKey().notNull(),
	username: varchar("username", { length: 100 }),
	password: varchar("password", { length: 255 }),
	email: varchar("email", { length: 100 }),
	fullName: text("full_name"),
	role: integer("role"),
	isactive: boolean("isactive"),
	notes: varchar("notes", { length: 255 }),
	description: varchar("description", { length: 255 }),
	createdAt: date("created_at"),
	updatedAt: date("updated_at"),
	createdBy: integer("created_by"),
	updatedBy: integer("updated_by"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	phonenumber: bigint("phonenumber", { mode: "number" }),
});

export const budgetDetailsInFinanceProject = financeProject.table("budget_details", {
	id: serial("id").primaryKey().notNull(),
	budgetid: integer("budgetid").notNull(),
	catid: integer("catid").notNull(),
	unit: integer("unit").notNull(),
	rate: numeric("rate", { precision: 12, scale:  2 }).notNull(),
	total: numeric("total", { precision: 12, scale:  2 }).notNull(),
	currency: text("currency"),
	isactive: boolean("isactive").notNull(),
	notes: varchar("notes", { length: 500 }),
	description: text("description"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	createdBy: integer("created_by").notNull(),
	updatedBy: integer("updated_by"),
	overhead: text("overhead"),
	deptid: integer("deptid"),
	travelTypeid: integer("travel_typeid"),
	subcategoryId: integer("subcategory_id").notNull(),
	april: numeric("april", { precision: 12, scale:  2 }),
	may: numeric("may", { precision: 12, scale:  2 }),
	june: numeric("june", { precision: 12, scale:  2 }),
	july: numeric("july", { precision: 12, scale:  2 }),
	august: numeric("august", { precision: 12, scale:  2 }),
	september: numeric("september", { precision: 12, scale:  2 }),
	october: numeric("october", { precision: 12, scale:  2 }),
	november: numeric("november", { precision: 12, scale:  2 }),
	december: numeric("december", { precision: 12, scale:  2 }),
	january: numeric("january", { precision: 12, scale:  2 }),
	february: numeric("february", { precision: 12, scale:  2 }),
	march: numeric("march", { precision: 12, scale:  2 }),
	q1: numeric("q1", { precision: 12, scale:  2 }),
	q2: numeric("q2", { precision: 12, scale:  2 }),
	q3: numeric("q3", { precision: 12, scale:  2 }),
	q4: numeric("q4", { precision: 12, scale:  2 }),
	activity: varchar("activity"),
	qty: integer("qty"),
	qty1: integer("qty1"),
	rate1: numeric("rate1"),
	amount1: numeric("amount1"),
	qty2: integer("qty2"),
	rate2: numeric("rate2"),
	amount2: numeric("amount2"),
	qty3: integer("qty3"),
	rate3: numeric("rate3"),
	amount3: numeric("amount3"),
	qty4: integer("qty4"),
	rate4: numeric("rate4"),
	amount4: numeric("amount4"),
	subDeptid: integer("sub_deptid"),
	aprQty: integer("apr_qty"),
	aprRate: numeric("apr_rate"),
	aprAmt: numeric("apr_amt"),
	mayQty: integer("may_qty"),
	mayRate: numeric("may_rate"),
	mayAmt: numeric("may_amt"),
	junQty: integer("jun_qty"),
	junRate: numeric("jun_rate"),
	junAmt: numeric("jun_amt"),
	julQty: integer("jul_qty"),
	julRate: numeric("jul_rate"),
	julAmt: numeric("jul_amt"),
	augQty: integer("aug_qty"),
	augRate: numeric("aug_rate"),
	augAmt: numeric("aug_amt"),
	sepQty: integer("sep_qty"),
	sepRate: numeric("sep_rate"),
	sepAmt: numeric("sep_amt"),
	octQty: integer("oct_qty"),
	octRate: numeric("oct_rate"),
	octAmt: numeric("oct_amt"),
	novQty: integer("nov_qty"),
	novRate: numeric("nov_rate"),
	novAmt: numeric("nov_amt"),
	decQty: integer("dec_qty"),
	decRate: numeric("dec_rate"),
	decAmt: numeric("dec_amt"),
	janQty: integer("jan_qty"),
	janRate: numeric("jan_rate"),
	janAmt: numeric("jan_amt"),
	febQty: integer("feb_qty"),
	febRate: numeric("feb_rate"),
	febAmt: numeric("feb_amt"),
	marQty: integer("mar_qty"),
	marRate: numeric("mar_rate"),
	marAmt: numeric("mar_amt"),
});