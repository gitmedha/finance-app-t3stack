import Image from "next/image";
import LoginForm from "./form";

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row">
      {/* Left side image - hidden on small screens */}
      <div
        className="hidden md:block md:w-8/12 h-64 md:h-auto bg-cover bg-center"
        style={{ backgroundImage: "url('/bg-login-ui.png')" }}
      />
      {/* Right side form */}
      <div className="w-full md:w-4/12 h-full bg-gray-50 flex flex-col justify-center p-6">
        <div className="flex justify-center items-center mb-6">
          <Image src="/medha-primary.png" alt="Logo" width={120} height={120} />
        </div>
        <LoginForm />
      </div>
    </div>
  );
}

