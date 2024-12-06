
import {
  createTRPCRouter,
} from "~/server/api/trpc";
import { deleteStaff } from "../controller/staff";

export const deleteRouter = createTRPCRouter({
  deleteStaff
});

