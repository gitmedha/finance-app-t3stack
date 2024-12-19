
import {
  createTRPCRouter,
} from "~/server/api/trpc";
import { deleteStaff } from "../controller/staff";
import { deleteDonor } from "../controller/donor";
import { deleteDepartment } from "../controller/department";
import { deleteCostCenter } from "../controller/costCenters";

export const deleteRouter = createTRPCRouter({
  deleteStaff,
  deleteDonor,
  deleteDepartment,
  deleteCostCenter
});

