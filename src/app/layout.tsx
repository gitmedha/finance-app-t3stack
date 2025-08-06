'use client';

import "~/styles/globals.css";
import "@radix-ui/themes/styles.css";

import { GeistSans } from "geist/font/sans";
import { TRPCReactProvider } from "~/trpc/react";
import { Theme } from "@radix-ui/themes";
import AppBar from "./_components/appBar";
import { ContextProvider } from "~/context"; // Correct path to AuthContext
import { signOut, useSession } from "next-auth/react";
import { ToastContainer} from 'react-toastify';
import { useRouter } from "next/navigation";
import { useEffect } from "react";

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
                <ToastContainer />
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
  const router = useRouter();
  useEffect(() => {
    const handlePop = (evt: PopStateEvent) => {
      // whenever a history “back” navigation happens
      // sign the user out and redirect to /login
      void signOut({ callbackUrl: '/login' });
    };

    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, [router]);

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
      
      <div className="mt-14">
      {children}
      </div>
    </>
  );
};
