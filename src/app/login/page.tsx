'use client';

import Image from "next/image";
import LoginForm from "./form";
import LogoTitle from "./components/LogoTitle";

export default function LoginPage() {
  return (
    <section
      className="fixed inset-0 w-full h-full flex items-center justify-center bg-cover bg-center overflow-hidden"
      style={{
        backgroundImage: "url('/bgimg.jpg')",
        backgroundPosition: "50% 38%",
      }}
    >
      <div className="absolute inset-0 bg-gray-200/50" />

      <div
        className="
          relative
          bg-white
          rounded-3xl
          flex
          flex-col
          md:flex-row
          overflow-hidden
          sm:w-[600px]
          md:w-[900px]
          lg:w-[1040px]
          min-h-[500px]
          mx-4
          my-4
        "
      >
        {/* Mobile: Image on top */}
        <div className="md:hidden w-full p-4">
          <div className="w-full rounded-2xl overflow-hidden">
            <Image
              src="/bgimg.jpg"
              alt="Decorative"
              width={600}
              height={400}
              className="w-full h-full object-cover object-center"
              priority
            />
          </div>
        </div>

        {/* Desktop: Image on left */}
        <div className="hidden md:flex w-[55%] items-center justify-center p-6">
          <div className="relative w-full h-full rounded-2xl overflow-hidden min-h-[400px]">
            <Image
              src="/bgimg.jpg"
              alt="Decorative"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Right side: Logo, Title, and Form */}
        <div className="w-full md:w-[45%] flex flex-col items-center justify-center">
          <div className="w-full flex flex-col items-center px-6 md:px-10 pt-8 md:pt-12 pb-4">
            <LogoTitle />
          </div>
          <LoginForm />
        </div>
      </div>
    </section>
  );
}

