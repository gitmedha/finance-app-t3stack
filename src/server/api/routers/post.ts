import { z } from "zod";
import bcrypt from "bcryptjs";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { userMasterInFinanceProject } from "~/server/db/schema";

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),

  // Registration route
  register: publicProcedure
    .input(
      z.object({
        username: z.string().min(1, "Username is required"), // Username is required and should not be empty
        email: z.string().email("Invalid email format").min(1, "Email is required"), // Email must be in correct format and required
        password: z.string().min(6, "Password must be at least 6 characters"), // Password must be at least 6 characters
        fullName: z.string().optional(), // fullName is optional
        role: z.string().optional(), // role is optional
        isactive: z.boolean().optional(), // isactive must be a boolean
        notes: z.string().optional(), // notes is optional
        description: z.string().optional(), // description is optional
        phonenumber: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits"), // phonenumber must be a 10-digit string
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Check if the user already exists
      const existingUser = await ctx.db.query.userMasterInFinanceProject.findFirst({
        where: (fields, operators) =>
          operators.or(
            operators.eq(fields.username, input.username),
            operators.eq(fields.email, input.email)
          ),
      });

      if (existingUser) {
        throw new Error("User already exists with this username or email");
      }
      // Hash the password
      const hashedPassword = await bcrypt.hash(input.password, 10);
      const newUserData: any = {
        ...input,
        password: hashedPassword,
        isactive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: null,
        updatedBy: null,
      };

      const newUser = await ctx.db.insert(userMasterInFinanceProject).values(newUserData);

      return { message: "Registration successful", newUser, success: true };
    }),

  // Login route
  login: publicProcedure
    .input(
      z.object({
        email: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Find user in the database by username
      const user = await ctx.db.query.userMasterInFinanceProject.findFirst({
        where: (fields, operators) =>
          operators.eq(fields.email, input.email),
      });
      // console.log(user)
      if (!user) {
        return { message: "Invalid username ", user, success: false };
      }
      // Compare the hashed password with the input password
      const isPasswordValid = await bcrypt.compare(input.password, user.password);
      if (!isPasswordValid) {
        return { message: "Invalid password ", user, success: false };
      }

      // Optionally, return some user info or a success message
      return { message: "Logged in successfully", user, success: true };
    }),
});
