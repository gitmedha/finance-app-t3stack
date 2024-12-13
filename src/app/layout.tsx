'use client';

import "~/styles/globals.css";
import "@radix-ui/themes/styles.css";

import { GeistSans } from "geist/font/sans";
import { TRPCReactProvider } from "~/trpc/react";
import { Theme } from "@radix-ui/themes";
import AppBar from "./_components/appBar";
import { ContextProvider } from "~/context"; // Correct path to AuthContext
import { useSession } from "next-auth/react";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body className="bg-[#f3f4f65e]">
        <main
          className="h-[100vh]">
          <TRPCReactProvider>
            <Theme className="!bg-[#f3f4f65e]">
              <ContextProvider>
                <AppContent>{children}</AppContent>
              </ContextProvider>
            </Theme>
          </TRPCReactProvider>
        </main>
      </body>
    </html>
  );
}

const AppContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session } = useSession();

  return (
    <>
      {session === undefined && <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="mt-4 text-center">
          <p className="text-xl animate-pulse font-extrabold text-primary">
            Loading...
          </p>
          <p className=" text-sm font-semibold text-primary/80">
            We are preparing your content.
          </p>
        </div>
      </div>}
      {session && <AppBar />}
      
      {children}
    </>
  );
};
