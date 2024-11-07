'use client';

import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@radix-ui/themes";
import { useState } from "react";
import { api } from "~/trpc/react";

interface FormData {
  username: string;
  email: string;
  password: string;
  fullName?: string;
  role?: string;
  isactive: boolean;
  notes?: string;
  description?: string;
  phonenumber: string;
}

const RegisterForm = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const registerMutation = api.post.register.useMutation();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setLoading(true);
    try {
      const result = await registerMutation.mutateAsync(data);
      if(result?.success){
        router.push('/login')
        reset();
      }
    } catch (error) {
      console.error("Registration failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="px-10 flex flex-col justify-center items-center mt-10 h-2/4"
    >
      <div className="flex flex-col items-center justify-start gap-2 mb-4">
        <p className="m-0 text-4xl font-semibold text-primary">
          <span className="-ml-10">MEDHA</span>
          <br />
          <span className="ml-8">FINANCE</span>
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="w-full flex flex-col gap-2 ">
          <label className="font-[400] text-xs text-gray-600">Enter Your Username</label>
          <input
            {...register("username", { required: "Username is required" })}
            className="border rounded-lg px-3 py-2 text-sm w-full outline-none"
          />
          {errors.username && (
            <span className="text-red-500 text-xs">{errors.username.message}</span>
          )}
        </div>

        <div className="w-full flex flex-col gap-2 ">
          <label className="font-[400] text-xs text-gray-600">Enter Your Email</label>
          <input
            {...register("email", { required: "Email is required", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email format" } })}
            className="border rounded-lg px-3 py-2 text-sm w-full outline-none"
            type="email"
          />
          {errors.email && (
            <span className="text-red-500 text-xs">{errors.email.message}</span>
          )}
        </div>

        <div className="w-full flex flex-col gap-2 ">
          <label className="font-[400] text-xs text-gray-600">Enter Your Password</label>
          <input
            {...register("password", { required: "Password is required", minLength: 6 })}
            className="border rounded-lg px-3 py-2 text-sm w-full outline-none"
            type="password"
            placeholder="******"
          />
          {errors.password && (
            <span className="text-red-500 text-xs">{errors.password.message}</span>
          )}
        </div>

        <div className="w-full flex flex-col gap-2 ">
          <label className="font-[400] text-xs text-gray-600">Enter Your Full Name</label>
          <input
            {...register("fullName")}
            className="border rounded-lg px-3 py-2 text-sm w-full outline-none"
          />
        </div>

        <div className="w-full flex flex-col gap-2 ">
          <label className="font-[400] text-xs text-gray-600">Enter Your Role</label>
          <input
            {...register("role")}
            className="border rounded-lg px-3 py-2 text-sm w-full outline-none"
          />
        </div>

        <div className="w-full flex flex-col gap-2 ">
          <label className="font-[400] text-xs text-gray-600">Phone Number</label>
          <input
            {...register("phonenumber", { required: "Phone number is required", pattern: { value: /^[0-9]{10}$/, message: "Invalid phone number" } })}
            className="border rounded-lg px-3 py-2 text-sm w-full outline-none"
          />
          {errors.phonenumber && (
            <span className="text-red-500 text-xs">{errors.phonenumber.message}</span>
          )}
        </div>

        <div className="w-full flex flex-col gap-2 ">
          <label className="font-[400] text-xs text-gray-600">Notes</label>
          <input
            {...register("notes")}
            className="border rounded-lg px-3 py-2 text-sm w-full outline-none"
          />
        </div>

        <div className="w-full flex flex-col gap-2 ">
          <label className="font-[400] text-xs text-gray-600">Description</label>
          <input
            {...register("description")}
            className="border rounded-lg px-3 py-2 text-sm w-full outline-none"
          />
        </div>
      </div>
    
      <Button
        size="3"
        type="submit"
        className="py-4 !my-3 px-8 !bg-primary hover:bg-primary/90 focus:ring-offset-blue-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg !cursor-pointer select-none"
        disabled={loading}
      >
        {loading ? "Registering..." : "Register"}
      </Button>

    </form>
  );
};

export default RegisterForm;
