
'use client';

import { useForm, type SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@radix-ui/themes";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { api } from "~/trpc/react";
import { HiEye, HiEyeOff } from "react-icons/hi";

interface FormData {
  email: string;
  password: string;
}

const LoginForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const loginMutation = api.post.login.useMutation();
  const [error, setError] = useState('')

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      setError('');
      setLoading(true)
      const result = await loginMutation.mutateAsync(data);
      if (result?.success) {
        const res = await signIn("credentials", {
          redirect: false,
          ...result.user
        });
  
        if (res?.error) {
          setLoading(false)
          setError("Invalid email or password. Please try again.");
        } else {
          router.push("/home"); // Redirect after successful login
        }
      } else {
        setError(result?.message);
        setLoading(false)
      }
    } catch (error) {
      console.error("Login failed:", error);
      setLoading(false);
      setError("Login failed. Please try again.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center text-center px-6 md:px-10 pb-4">
      <div className="w-full max-w-md">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-black mb-1">Sign In</h2>
          <p className="text-sm text-gray-600">
            Enter your credentials to access your account
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-1 w-full">
          {/* Fixed-height error area to prevent layout shift */}
          <div
            className={[
              "w-full rounded-md border p-2 text-sm transition-opacity",
              error
                ? "border-red-200 bg-red-50 text-red-600 opacity-100"
                : "border-transparent bg-transparent text-transparent opacity-0",
            ].join(" ")}
            aria-hidden={!error}
          >
            {error ?? "placeholder"}
          </div>

          <div className="w-full flex flex-col gap-2">
            <label className="text-sm font-medium text-black text-left">
              Email
            </label>
            <input
              {...register("email", { 
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address"
                }
              })}
              type="email"
              placeholder="Enter your email address"
              className="h-9 w-full rounded-md border border-gray-300 px-3 py-2 text-sm font-normal shadow-sm focus:outline-none focus:ring-1 focus:ring-primary/60 focus:border-transparent placeholder:text-gray-400"
            />
            <p className="text-red-500 text-xs text-left h-4 leading-4">
              {errors.email?.message ?? "\u00A0"}
            </p>
          </div>

          <div className="w-full flex flex-col gap-2">
            <label className="text-sm font-medium text-black text-left">
              Password
            </label>
            <div className="relative w-full">
              <input
                {...register("password", { required: "Password is required" })}
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="h-9 w-full rounded-md border border-gray-300 px-3 py-2 pr-10 text-sm font-normal shadow-sm focus:outline-none focus:ring-1 focus:ring-primary/60 focus:border-transparent placeholder:text-gray-400"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <HiEyeOff size={18} />
                ) : (
                  <HiEye size={18} />
                )}
              </button>
            </div>
            <p className="text-red-500 text-xs text-left h-4 leading-4">
              {errors.password?.message ?? "\u00A0"}
            </p>
          </div>

          <Button
            size='3'
            type='submit'
            className="w-full h-9 text-sm font-medium cursor-pointer !bg-[#32b89d] hover:!bg-[#2aa58d] text-white transition-colors rounded-md"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </Button>

        
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
