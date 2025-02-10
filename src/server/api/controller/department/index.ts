import { and, count, desc, eq, ilike } from "drizzle-orm";
import { z } from "zod";
import {
  //   createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { db } from "~/server/db";
import { departmentHierarchyInFinanceProject, departmentMasterInFinanceProject as departmentMaster, departmentMasterInFinanceProject } from "~/server/db/schema";

export const getDepartments = protectedProcedure
  .input(
    z.object({
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(100).default(10),
      searchTerm: z.string().optional().default(""), // Optional search term
      status: z.string().optional().default("Active"), // Optional search term
      type: z.string().optional().default(""), // Optional search term
    }),
  )
  .query(async ({ ctx, input }) => {
    const { page, limit, searchTerm, status, type } = input;
    const offset = (page - 1) * limit;

    // Apply the search condition only if searchTerm is not an empty string
    const searchCondition = searchTerm
      ? ilike(departmentMaster.departmentname, `%${searchTerm}%`)
      : undefined;
    const statusCondition = status
      ? eq(departmentMaster.isactive, status === "Active")
      : undefined;
    const typeCondition = type ? eq(departmentMaster.type, type) : undefined;
    const departmentMasterAlias = departmentMaster 
    const departments = await ctx.db
      .select({
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
        parentId: departmentHierarchyInFinanceProject.parentId, 
        // count: count()
      })
      .from(departmentMaster)
      .leftJoin(
        departmentHierarchyInFinanceProject,
        and(eq(departmentMasterInFinanceProject.id, departmentHierarchyInFinanceProject.deptId), eq(departmentMasterInFinanceProject.isactive, true))
        
      )
      // .leftJoin(
      //   departmentMasterAlias,
      //   eq(departmentHierarchyInFinanceProject.parentId, departmentMasterAlias.id)
      // )

      .where(and(searchCondition, statusCondition, typeCondition))
      .orderBy(desc(departmentMaster.createdAt))
      .offset(offset)
      .limit(limit);

    const totalCountResult = await db
      .select({ count: count() })
      .from(departmentMaster)
      .where(and(searchCondition, statusCondition, typeCondition)); // Count with filter if searchCondition is defined


    const totalCount = totalCountResult[0]?.count ?? 0;
    const updatedDepartment = [];
    for (const department of departments) {
      const typeData = {
        value: department.type ?? "",
        label: department.type ?? "",
      };
      const departmentData:{value:number|null,label:string|undefined} = {
        value: department.parentId,
        label:undefined
      }
      if(departmentData.value)
      {
        const departmentName = await ctx.db.select({ departmentName: departmentMaster.departmentname}).from(departmentMaster).where(eq(departmentMaster.id,departmentData.value))
        departmentData.label = departmentName[0]?.departmentName
      }
      
      
      updatedDepartment.push({
        ...department,
        typeData,
        departmentData
      });
    }

    return {
      departments: updatedDepartment,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
    };
  });

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

export const getHeadDepartments = protectedProcedure.query(async ({ ctx }) => {
  const departments = await ctx.db
    .select({
      id: departmentMaster.id,
      name: departmentMaster.departmentname,
    })
    .from(departmentMaster)
    .where(eq(departmentMaster.type,"Department"))
    

  return departments.map((department) => {
    return {
      value: department.id,
      label: department.name,
    };
  });
});
export const getSubDepartments = protectedProcedure
  .input(z.object({
    deptId:z.number().optional()
  }))
  .query(async ({ctx,input})=>{
    const baseConditions = [eq(departmentMaster.type, "Sub Department")]
    if(!input.deptId && input.deptId !=0)
        return []
    if(input.deptId)
    {
      baseConditions.push(eq(departmentHierarchyInFinanceProject.parentId,input.deptId))
    }
    const subDepartments = await ctx.db
      .select({
        id: departmentMaster.id,
        name: departmentMaster.departmentname,
      })
      .from(departmentMaster)
      .leftJoin(departmentHierarchyInFinanceProject,eq(departmentHierarchyInFinanceProject.deptId,departmentMaster.id))
      .where(and(...baseConditions))

    return subDepartments.map((sub)=>{
      return {
        value: sub.id,
        label: sub.name,
      }
    })
  })
export const getDepartmentsTypes = protectedProcedure.query(async ({ ctx}) => {
  const departmentsType = await ctx.db.select({
    type: departmentMaster.type,
  })
  .from(departmentMaster).groupBy(departmentMaster.type); // Group by type to get unique values

  return {
    departmentsType,
  };
})

export const addDepartment = protectedProcedure
  .input(
    z.object({
      departmentname: z.string().min(1, "Name is required"),
      deptCode: z.number().min(1, "Department Code is required"),
      type: z.string().min(1, "Type is required"),
      isactive: z.boolean(),
      notes: z.string().optional().nullable(),
      description: z.string().optional().nullable(),
      createdBy: z.number().min(1, "Invalid creator ID"),
      createdAt: z.string(),
      parentId:z.number().optional().nullable()
    }),
  )
  .mutation(async ({ ctx, input }) => {
    try {
      // Format data for insertion
      const {parentId,...formattedInput} =input;

      // Insert new department member into the database
      const result = await ctx.db
        .insert(departmentMaster)
        .values(formattedInput)
        .returning()
      let createdHirarchey = null
      if(result[0] && parentId )
      {
        createdHirarchey = await ctx.db.insert(departmentHierarchyInFinanceProject).values({ deptId: result[0].id, parentId, createdAt: formattedInput.createdAt, createdBy: formattedInput.createdBy, isactive: formattedInput.isactive ?? false }).returning()
      }
      return {
        success: true,
        message: "Department member added successfully",
        department: result[0], // Return the created department record
        createdHirarchey:createdHirarchey ? createdHirarchey[0]:null
      };
    } catch (error) {
      console.error("Error adding department:", error);
      throw new Error("Failed to add department. Please try again.");
    }
  });

export const editDepartment = protectedProcedure
  .input(
    z.object({
      id: z.number().min(1, "Department ID is required"),
      departmentname: z.string().optional(),
      type: z.string().optional(),
      departmentId:z.number().optional().nullable(),
      deptCode: z.number().optional(),
      isactive: z.boolean().optional(),
      updatedBy: z.number().min(1, "Invalid updater ID"),
      updatedAt: z.string(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    try {
      const { id, updatedBy, updatedAt, departmentId, ...fieldsToUpdate} = input;

      // Check if the department exists
      const existingDepartment =
        await ctx.db.query.departmentMasterInFinanceProject.findFirst({
          where: eq(departmentMaster.id, id),
        });

      if (!existingDepartment) {
        throw new Error("Department not found");
      }

      // Update departmet details
      const updatedDepartment = await ctx.db
        .update(departmentMaster)
        .set({
          ...fieldsToUpdate,
          updatedBy,
          updatedAt,
        })
        .where(eq(departmentMaster.id, id))
        .returning(); // Correct usage of eq()
      // .returning("*");
      // if the type moved from department to sub department or if sub department changed 
      let updateHirarchey = null;
      if (departmentId && fieldsToUpdate.type == "Sub Department")
      {
        // do we have department id in the hirarchey table 
        const existingHirarcheyId = await ctx.db.query.departmentHierarchyInFinanceProject.findFirst({
          where: eq(departmentHierarchyInFinanceProject.deptId,id)
        })
        // if  yes then we just going to update the existing data
        if(existingHirarcheyId)
        {
          
          updateHirarchey = await ctx.db.update(departmentHierarchyInFinanceProject)
            .set(
              {parentId:departmentId,
                isactive:true,
                updatedAt,
                updatedBy
              }
            )
            .where(eq(departmentHierarchyInFinanceProject.deptId,id))
            .returning()
        }
        // if the hirarchey not present then we going to create new one
        else{
          updateHirarchey = await ctx.db.insert(departmentHierarchyInFinanceProject).values({ deptId: id, parentId: departmentId, createdAt: updatedAt, createdBy: updatedBy, isactive: fieldsToUpdate.isactive ?? false})
        }
      }
      // this runs when the type is department thinking that they may have changed the type sub dept to dept
      else{
        const existingHirarcheyId = await ctx.db.query.departmentHierarchyInFinanceProject.findFirst({
          where: eq(departmentHierarchyInFinanceProject.deptId, id)
        })
        // if they made like that then we going to make it is active false
        if(existingHirarcheyId){
          
            await ctx.db.update(departmentHierarchyInFinanceProject)
            .set(
              {
                isactive:false,
                updatedAt,
                updatedBy
              }
            )
            .where(eq(departmentHierarchyInFinanceProject.deptId, id))
            .returning()
        }
        
      }

      return {
        success: true,
        message: "Department updated successfully",
        department: updatedDepartment[0], // Return the updated department record
        parentId:updateHirarchey ? updateHirarchey[0]?.parentId : null, 
      };
    } catch (error) {
      console.error("Error updating department:", error);
      throw new Error("Failed to update department. Please try again.");
    }
  });

export const deleteDepartment = protectedProcedure
  .input(
    z.object({
      id: z.number().min(1, "Department ID is required"), // Department ID to locate the record
      updatedBy: z.number().min(1, "Invalid updater ID"),
      updatedAt: z.string(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    try {
      const { id ,updatedAt,updatedBy} = input;

      // Check if the department exists
      const existingDepartment =
        await ctx.db.query.departmentMasterInFinanceProject.findFirst({
          where: eq(departmentMaster.id, id),
        });

      if (!existingDepartment) {
        throw new Error("department not found");
      }

      // Update staff department details
      const updatedDepartment = await ctx.db
        .update(departmentMaster)
        .set({
          isactive: false,
          updatedAt,
          updatedBy
        })
        .where(eq(departmentMaster.id, id))
        .returning(); // Correct usage of eq()
      // .returning("*");
      const existingHirarcheyId = await ctx.db.query.departmentHierarchyInFinanceProject.findFirst({
        where: eq(departmentHierarchyInFinanceProject.deptId, id)
      })
      if (existingHirarcheyId) {
        await ctx.db.update(departmentHierarchyInFinanceProject)
          .set(
            {
              isactive: false,
              updatedAt,
              updatedBy
            }
          )
          .where(eq(departmentHierarchyInFinanceProject.deptId, id))
          .returning()
      }
      return {
        success: true,
        message: "Department member deleted successfully",
        department: updatedDepartment[0], // Return the updated department record
      };
    } catch (error) {
      console.error("Error deleting department:", error);
      throw new Error("Failed to delete department. Please try again.");
    }
  });
