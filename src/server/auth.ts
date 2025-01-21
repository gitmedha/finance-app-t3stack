import { type DefaultSession, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { userMasterInFinanceProject, staffMasterInFinanceProject, departmentMasterInFinanceProject } from "./db/schema";

// Extend the Session interface to include custom properties on user
interface UserInfo {
  id: number;
  username: string;
  email?: string | null;
  fullName?: string | null;
  role?: number | null;
  isactive: boolean;
  notes?: string | null;
  description?: string | null;
  createdAt: string;
  updatedAt?: string | null;
  createdBy?: number | null;
  updatedBy?: number | null;
  phonenumber: number | string;
  departmentName:string|null
  departmentId:number|null
}

declare module "next-auth" {
  interface User {
    id: number;
    username: string;
    email?: string | null;
    fullName?: string | null;
    role?: number | null;
    isactive: boolean;
    notes?: string | null;
    description?: string | null;
    createdAt: string;
    updatedAt?: string | null;
    createdBy?: number | null;
    updatedBy?: number | null;
    phonenumber: number | string;
    departmentName: string | null
    departmentId: number | null
  }

  interface Session extends DefaultSession {
    user: UserInfo;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        const data = await db.query.userMasterInFinanceProject.findFirst({
          where: eq(userMasterInFinanceProject.email, credentials.email),
        });

        // Ensure password match before returning user
        if (data && data.password === credentials.password) {
          const user: UserInfo = {
            id: data.id,
            username: data.username,
            email: data.email,
            fullName: data.fullName,
            role: data.role,
            isactive: data.isactive,
            notes: data.notes,
            description: data.description,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            createdBy: data.createdBy,
            updatedBy: data.updatedBy,
            phonenumber: data.phonenumber,
            departmentId:null,
            departmentName:null
          };
          if(user.role == 2)
          {
            const departmentDetails = await db.select({
              departmentId: departmentMasterInFinanceProject.id,
              departmentName: departmentMasterInFinanceProject.departmentname
            }).from(departmentMasterInFinanceProject)
              .innerJoin(staffMasterInFinanceProject,
                eq(staffMasterInFinanceProject.department, departmentMasterInFinanceProject.id)
              ).where(eq(staffMasterInFinanceProject.email, credentials.email))
            
            user.departmentId =  departmentDetails[0]?.departmentId ?? null
            user.departmentName = departmentDetails[0]?.departmentName??null
          }
          return user;
        }
        // If authentication fails, log and return null
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.email = user.email;
        token.fullName = user.fullName;
        token.role = user.role;
        token.isactive = user.isactive;
        token.notes = user.notes;
        token.description = user.description;
        token.createdAt = user.createdAt;
        token.updatedAt = user.updatedAt;
        token.createdBy = user.createdBy;
        token.updatedBy = user.updatedBy;
        token.phonenumber = user.phonenumber;
        token.departmentId = user.departmentId;
        token.departmentName = user.departmentName
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id as number,
          username: token.username as string,
          email: token.email!,
          fullName: token.fullName as string,
          role: token.role as number,
          isactive: token.isactive as boolean,
          notes: token.notes as string | undefined,
          description: token.description as string | undefined,
          createdAt: token.createdAt as string,
          updatedAt: token.updatedAt as string | undefined,
          createdBy: token.createdBy as number | undefined,
          updatedBy: token.updatedBy as number | undefined,
          phonenumber: token.phonenumber as number | string,
          departmentId: token.departmentId as number,
          departmentName: token.departmentName as string
        };
      }
      return session;
    },
  },
  // pages: {
  //   signIn: "/auth/signin",
  //   signOut: "/auth/signout",
  //   error: "/auth/error",
  //   verifyRequest: "/auth/verify-request",
  //   newUser: "/auth/new-user",
  // },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
