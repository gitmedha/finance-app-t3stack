
import {
  createTRPCRouter,
} from "~/server/api/trpc";
import { login } from "../controller/user";
import { addDonor } from "../controller/donor";
import { addStaff, editStaff } from "../controller/staff";

export const postRouter = createTRPCRouter({
  login,
  addDonor,
  addStaff,
  editStaff
});

