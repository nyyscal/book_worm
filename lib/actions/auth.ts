"use server"

import { db } from "@/database/drizzle";
import { eq } from "drizzle-orm";
import { users } from "@/database/schema";
import { hash } from "bcryptjs";
import { signIn } from "@/auth";
import { headers } from "next/headers";
import ratelimit from "../ratelimit";

export const signInWithCredentials = async (
  params: Pick<AuthCredentials, "email" | "password">
): Promise<{ success: boolean; error?: string }> => {
  const { email, password } = params;

  const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
  const { success: rateLimitSuccess } = await ratelimit.limit(ip);
  if (!rateLimitSuccess) {
    return { success: false, error: "Rate limit exceeded. Please try again later." };
  }

  try {
    const result = await signIn("credentials", { email, password, redirect: false });
    if (result?.error) {
      return { success: false, error: result.error || undefined }; // Ensure type consistency
    }
    return { success: true, error: undefined }; // Explicitly include `error` as `undefined`
  } catch (error) {
    console.error("Signin error:", error);
    return { success: false, error: "Signin error" };
  }
};


export const signUp = async (params: AuthCredentials): Promise<{ success: boolean; error?: string }> => {
  const { fullName, email, universityId, universityCard, password } = params;

  const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
  const { success: rateLimitSuccess } = await ratelimit.limit(ip);
  if (!rateLimitSuccess) {
    return { success: false, error: "Rate limit exceeded. Please try again later." };
  }

  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUser.length > 0) {
    return { success: false, error: "User already exists." };
  }

  const hashedPassword = await hash(password, 10);
  try {
    await db.insert(users).values({
      fullName,
      email,
      universityId,
      universityCard,
      password: hashedPassword,
    });

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