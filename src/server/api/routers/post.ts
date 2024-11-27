
import {
  createTRPCRouter,
} from "~/server/api/trpc";
import { login } from "../controller/user";
import { addDonor } from "../controller/donor";

export const postRouter = createTRPCRouter({
  login,
  addDonor
});

