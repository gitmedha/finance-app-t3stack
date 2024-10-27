import Image from "next/image";
import LoginForm from "./form";

export default function LoginPage() {


  return (
    <div className="h-[100vh] w-full overflow-hidden flex justify-start items-center">
      <div className=" p-3 w-4/12 h-full bg-gray-50">
        <div className=" flex justify-center items-center">
          <Image
            src="/medha-primary.png"
            alt="Logo"
            width={150}
            height={150}
            className=""
          />
        </div>
        <LoginForm />
      </div>
      <div
        className="w-8/12 h-full bg-cover bg-center"
        style={{ backgroundImage: "url('/bg-login-ui.png')" }}
      />
    </div>
  );
}
