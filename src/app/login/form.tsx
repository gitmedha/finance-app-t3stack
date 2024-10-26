'use client';

import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation"; // Corrected import
import { Button, Spinner } from "@radix-ui/themes";

interface FormData {
  email: string;
  password: string;
}

const LoginForm = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();
  const router = useRouter(); // Initialize useRouter
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    // Here you would typically call your authentication API
    await router.push("/"); // Redirect to home page
    reset(); // Reset the form if needed
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="px-10 flex flex-col justify-center items-center h-3/4"
    >
      <div className="flex flex-col items-center justify-center gap-2 mb-8">
        <p className="m-0 text-2xl font-semibold text-primary">
          Medha Finance Management
        </p>
      </div>
      <div className="w-full flex flex-col gap-2">
        <label className="font-[400] text-xs text-gray-600">
          Enter Your Email
        </label>
        <input
          {...register("email", { required: "Email is required" })}
          placeholder="email@demo.com"
          className="border rounded-md px-3 py-2 text-sm w-full outline-none"
        />
        {errors.email && (
          <span className="text-red-500 text-xs">{errors.email.message}</span>
        )}
      </div>
      <div className="my-2 w-full flex flex-col gap-2">
        <label className="font-[400] text-xs text-gray-600">Enter Your Password</label>
        <input
          {...register("password", { required: "Password is required" })}
          className="border rounded-md px-3 py-2 text-sm w-full outline-none"
          type="password"
          placeholder="******"
        />
        {errors.password && (
          <span className="text-red-500 text-xs">{errors.password.message}</span>
        )}
      </div>

      <Button type='submit' className="py-2 mt-2 px-8 !bg-primary hover:bg-primary/90 focus:ring-offset-blue-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-md !cursor-pointer select-none">
        Submit
      </Button>

      {/* <button
        type="submit"
        className="py-2 mt-2 px-8 bg-primary hover:bg-primary/90 focus:ring-offset-blue-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-md cursor-pointer select-none"
      >
        <Spinner loading />
        Submit
      </button> */}
    </form>
  );
};

export default LoginForm;
