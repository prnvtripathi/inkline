"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { SignupFormData } from "@/types/auth";
import { AuthFormData, AuthState } from "@/types/auth";
import { signIn } from "next-auth/react";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export const signup = async (
  prevState: null,
  formData: SignupFormData
): Promise<{ message: string; error?: string }> => {
  const { name, email, password, imageSrc } = formData;

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return {
        message: "error",
        error: "An account with this email already exists. Please login.",
      };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    await prisma.user.create({
      data: {
        name,
        email,
        image: imageSrc || null,
        password: hashedPassword,
        accounts: {
          create: {
            type: "credentials",
            provider: "credentials",
            providerAccountId: email, // Use email as unique key
          },
        },
      },
    });

    return { message: "success" };
  } catch (err) {
    console.error("Signup error:", err);

    return {
      message: "error",
      error: "An unexpected error occurred",
    };
  }
};

export const authenticate = async (
  prevState: AuthState | null,
  formData: AuthFormData
): Promise<{ message: string; error?: string }> => {
  try {
    const result = await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirect: false,
    });

    if (!result || result.error) {
      return {
        message: "error",
        error: result?.error || "Authentication failed",
      };
    }

    return { message: "success" };
  } catch (error: unknown) {
    if (isRedirectError(error)) throw error;

    console.error("Authentication error:", error);
    return {
      message: "error",
      error: "An unexpected error occurred",
    };
  }
};
