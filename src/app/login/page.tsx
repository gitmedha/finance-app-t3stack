import Image from "next/image";
import LoginForm from "./form";

export default function LoginPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left: Background image on md+ screens */}
      <div className="relative hidden md:block">
        <Image
          src="/bg-login-ui.png"
          alt="Login background"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Right: Logo + Form */}
      <div className="flex items-center justify-center bg-gray-50 p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-8">
            <Image
              src="/medha-primary.png"
              alt="Logo"
              width={120}
              height={120}
            />
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}

