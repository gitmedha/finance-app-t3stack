'use client';

import "~/styles/globals.css";
import "@radix-ui/themes/styles.css";

import { GeistSans } from "geist/font/sans";
import { TRPCReactProvider } from "~/trpc/react";
import { Theme } from "@radix-ui/themes";
import AppBar from "./_components/appBar";
import { ContextProvider } from "~/context"; // Correct path to AuthContext

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <main className="h-[100vh] bg-gray-50">
          <TRPCReactProvider>
            <Theme>
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

  return (
    <>
      <AppBar />
      {children}
    </>
  );
};
