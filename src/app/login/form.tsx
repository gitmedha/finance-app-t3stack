

'use client';

import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation"; // Corrected import
import { Button } from "@radix-ui/themes";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { api } from "~/trpc/react";

interface FormData {
  email: string;
  password: string;
}

const LoginForm = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const loginMutation = api.post.login.useMutation();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const result = await loginMutation.mutateAsync(data);
      if(result?.success){
        const res = await signIn("credentials", {
          redirect: false,
          email: data.email,
          password: data.password,
        });
        if (res?.error) {
          alert("Invalid email or password. Please try again.");
        } else {
          router.push("/home"); // Customize this path
        }
        reset();
        setLoading(false);
      }
      console.log(result)
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="px-10 flex flex-col justify-center items-center mt-10 h-2/4"
    >
      <div className="flex flex-col items-center justify-start gap-2 mb-8">
        <p className="m-0 text-4xl font-semibold text-primary">
          <span className="-ml-10">
            MEDHA
          </span> 
          <br/>
          <span className="ml-8">
            FINANCE
          </span>
        </p>
      </div>
      <div className="w-full flex flex-col gap-2 mb-4">
        <label className="font-[400] text-xs text-gray-600">
          Enter Your email
        </label>
        <input
          {...register("email", { required: "email is required" })}
          placeholder="email@demo.com"
          className="border rounded-lg px-3 py-2 text-sm w-full outline-none"
        />
        {errors.email && (
          <span className="text-red-500 text-xs">{errors.email.message}</span>
        )}
      </div>
      <div className="w-full flex flex-col gap-2 mb-4">
        <label className="font-[400] text-xs text-gray-600">Enter Your Password</label>
        <input
          {...register("password", { required: "Password is required" })}
          className="border rounded-lg px-3 py-2 text-sm w-full outline-none"
          type="password"
          placeholder="******"
        />
        {errors.password && (
          <span className="text-red-500 text-xs">{errors.password.message}</span>
        )}
      </div>

      <Button
        size='3'
        type='submit'
        className="py-4 !my-3 px-8 !bg-primary hover:bg-primary/90 focus:ring-offset-blue-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg !cursor-pointer select-none"
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </Button>
      
      <Link className="mt-2 text-primary font-medium" href='/forgot-password'>
        Forgot password
      </Link>
    </form>
  );
};

export default LoginForm;
