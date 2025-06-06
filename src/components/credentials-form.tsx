"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { signup, authenticate } from "@/lib/authenticate";
import { toast } from "sonner";
import { AuthFormData, SignupFormData } from "@/types/auth";
import { useRouter } from "next/navigation";
import { z } from "zod";

// Zod schemas for validation
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters long"),
});

const signupSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters long")
    .max(24, "Name must be less than 24 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters long")
    .regex(
      /^(?=.*[a-zA-Z])(?=.*\d)/,
      "Password must contain at least one letter and one number"
    ),
  imageSrc: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
});

type CredentialsFormProps = {
  variant: "login" | "register";
};

type ValidationErrors = {
  [key: string]: string;
};

export default function CredentialsForm({ variant }: CredentialsFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setErrors({}); // Clear previous errors

    try {
      const formData = new FormData(event.currentTarget);

      // Extract form data
      const rawData = {
        ...(variant === "register" && { name: formData.get("name") as string }),
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        ...(variant === "register" && {
          imageSrc: formData.get("imageSrc") as string,
        }),
      };

      // Validate with Zod
      if (variant === "login") {
        const validatedData = loginSchema.parse(rawData);
        const data: AuthFormData = {
          email: validatedData.email,
          password: validatedData.password,
        };

        const result = await authenticate(null, data);

        if (result?.message === "success") {
          toast.success("Logged in successfully");
          router.push("/");
        } else {
          toast.error(result?.error || "Invalid credentials");
        }
      } else {
        const validatedData = signupSchema.parse(rawData);
        const data: SignupFormData = {
          name: validatedData.name,
          email: validatedData.email,
          password: validatedData.password,
          imageSrc: validatedData.imageSrc || "",
        };

        const result = await signup(null, data);

        if (result?.message === "success") {
          toast.success("Account created successfully");
          setTimeout(() => {
            router.push("/login");
          }, 1000);
        } else {
          toast.error(result?.error || "An error occurred during signup");
        }
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle Zod validation errors
        const fieldErrors: ValidationErrors = {};
        error.errors.forEach((err) => {
          if (err.path.length > 0) {
            fieldErrors[err.path[0]] = err.message;
          }
        });
        setErrors(fieldErrors);
        toast.error("Please fix the validation errors");
      } else {
        console.error("Form submission error:", error);
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4">
        {variant === "register" && (
          <div className="grid gap-2">
            <Label htmlFor="name" className="text-white">
              Name
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="John Doe"
              className={`border-neutral-800 bg-neutral-950 text-white placeholder:text-neutral-400 ${
                errors.name ? "border-red-500" : ""
              }`}
              required
              disabled={isLoading}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>
        )}
        <div className="grid gap-2">
          <Label htmlFor="email" className="text-white">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="email@example.com"
            className={`border-neutral-800 bg-neutral-950 text-white placeholder:text-neutral-400 ${
              errors.email ? "border-red-500" : ""
            }`}
            required
            disabled={isLoading}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email}</p>
          )}
        </div>
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-white">
              Password
            </Label>
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="********"
            className={`border-neutral-800 bg-neutral-950 text-white placeholder:text-neutral-400 ${
              errors.password ? "border-red-500" : ""
            }`}
            required
            disabled={isLoading}
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password}</p>
          )}
        </div>
        {variant === "register" && (
          <div className="grid gap-2">
            <Label htmlFor="imageSrc" className="text-white">
              Profile Image URL
            </Label>
            <Input
              id="imageSrc"
              name="imageSrc"
              type="url"
              placeholder="https://example.com/image.jpg"
              className={`border-neutral-800 bg-neutral-950 text-white placeholder:text-neutral-400 ${
                errors.imageSrc ? "border-red-500" : ""
              }`}
              disabled={isLoading}
            />
            {errors.imageSrc && (
              <p className="text-sm text-red-500">{errors.imageSrc}</p>
            )}
          </div>
        )}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading
            ? "Please wait..."
            : variant === "login"
            ? "Login"
            : "Create account"}
        </Button>
      </div>
    </form>
  );
}
