
import {
  createTRPCRouter,
} from "~/server/api/trpc";
import { deleteStaff } from "../controller/staff";
import { deleteDonor } from "../controller/donor";

export const deleteRouter = createTRPCRouter({
  deleteStaff,
  deleteDonor
});

