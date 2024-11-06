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
        username: z.string(),
        email: z.string().email(),
        password: z.string().min(6),
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
      const newUserData = {
        username: input.username || '',
        password: hashedPassword,
        email: input.email,
        fullName: null,
        role: null,
        isactive: true,
        notes: null,
        description: null,
        createdAt: new Date().toISOString(), // Ensure it's in string format
        updatedAt: new Date().toISOString(), // Ensure it's in string format
        createdBy: null,
        updatedBy: null,
        phonenumber: 9311958991, // Can be null or number
      };
      
      // Insert the new user
      const newUser = await ctx.db.insert(userMasterInFinanceProject).values([newUserData]);
      
      // return { message: "Registration successful", userId: newUser.insertId };
    }),

  // Login route
  login: publicProcedure
    .input(
      z.object({
        username: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Find user in the database by username
      const user = await ctx.db.query.userMasterInFinanceProject.findFirst({
        where: (fields, operators) => 
          operators.eq(fields.username, input.username),
      });

      if (!user) {
        throw new Error("Invalid username or password");
      }

      // Compare the hashed password with the input password
      const isPasswordValid = await bcrypt.compare(input.password, user.password);
      if (!isPasswordValid) {
        throw new Error("Invalid username or password");
      }

      // Optionally, return some user info or a success message
      return { message: "Logged in successfully", user: { id: user.id, username: user.username } };
    }),
});
