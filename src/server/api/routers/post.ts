
import {
  createTRPCRouter,
} from "~/server/api/trpc";
import { login } from "../controller/user";
import { addDonor,editDonor } from "../controller/donor";
import { addStaff, editStaff } from "../controller/staff";

export const postRouter = createTRPCRouter({
  login,
  addDonor,
  editDonor,
  addStaff,
  editStaff
});

