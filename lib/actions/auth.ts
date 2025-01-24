"use server";  // Ensure this directive is included for server-side execution

import { db } from "@/database/drizzle";
import { eq } from "drizzle-orm";
import { users } from "@/database/schema";
import { hash } from "bcryptjs";
import { signIn } from "@/auth";
import { headers } from "next/headers";
import ratelimit from "../ratelimit";

// SignIn with credentials (Server-side)
export const signInWithCredentials = async (
  params: Pick<AuthCredentials, "email" | "password">
): Promise<{ success: boolean; error?: string }> => {
  const { email, password } = params;

  const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1"; // Get IP address from headers
  const { success: rateLimitSuccess } = await ratelimit.limit(ip); // Apply rate limiting
  if (!rateLimitSuccess) {
    return { success: false, error: "Rate limit exceeded. Please try again later." };
  }

  try {
    const result = await signIn("credentials", { email, password, redirect: false });
    if (result?.error) {
      return { success: false, error: result.error || undefined };
    }
    return { success: true, error: undefined };
  } catch (error) {
    console.error("Signin error:", error);
    return { success: false, error: "Signin error" };
  }
};

// SignUp (Server-side)
export const signUp = async (params: AuthCredentials): Promise<{ success: boolean; error?: string }> => {
  const { fullName, email, universityId, universityCard, password } = params;

  const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1"; // Get IP address from headers
  const { success: rateLimitSuccess } = await ratelimit.limit(ip); // Apply rate limiting
  if (!rateLimitSuccess) {
    return { success: false, error: "Rate limit exceeded. Please try again later." };
  }

  // Check if user already exists in the database
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUser.length > 0) {
    return { success: false, error: "User already exists." };
  }

  // Hash the password before saving to the database
  const hashedPassword = await hash(password, 10);

  try {
    // Insert the new user into the database
    await db.insert(users).values({
      fullName,
      email,
      universityId,
      universityCard,
      password: hashedPassword,
    });

    // Attempt to sign the user in immediately after successful registration
    const signInResult = await signInWithCredentials({ email, password });
    if (!signInResult.success) {
      return { success: false, error: signInResult.error };
    }

    return { success: true };
  } catch (error) {
    console.error("Signup error:", error);
    return { success: false, error: "Signup error." };
  }
};
