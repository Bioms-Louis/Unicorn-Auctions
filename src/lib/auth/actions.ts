"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { writeAuditEvent } from "@/lib/audit";
import { redirect } from "next/navigation";

const SignUpInput = z.object({
  firstName: z.string().min(1, "Enter your first name."),
  lastName: z.string().min(1, "Enter your last name."),
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export interface AuthActionResult {
  success: boolean;
  error?: string;
}

/**
 * Registers a new bidder: creates the Supabase Auth user, then their
 * `profiles` row and a `bidders` row in state `pending`. KYC and deposit
 * happen in later steps of the onboarding flow (section 19 of the brief) —
 * this action only gets them into the pipeline.
 */
export async function signUpBidder(
  _prev: AuthActionResult,
  formData: FormData,
): Promise<AuthActionResult> {
  const parsed = SignUpInput.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: { data: { first_name: parsed.data.firstName, last_name: parsed.data.lastName } },
  });

  if (error || !data.user) {
    return { success: false, error: error?.message ?? "Could not create account." };
  }

  // Profile + bidder rows are created with the service-role client because
  // the just-created user may not have a confirmed session yet (email
  // verification pending), so an RLS-bound insert as "self" isn't reliable
  // at this exact moment.
  const service = createServiceRoleClient();

  const { error: profileError } = await service.from("profiles").insert({
    id: data.user.id,
    first_name: parsed.data.firstName,
    last_name: parsed.data.lastName,
  });
  if (profileError) {
    return { success: false, error: `Account created but profile setup failed: ${profileError.message}` };
  }

  const { error: bidderError } = await service.from("bidders").insert({
    user_id: data.user.id,
    state: "pending",
  });
  if (bidderError) {
    return { success: false, error: `Account created but bidder setup failed: ${bidderError.message}` };
  }

  const { error: roleError } = await service.from("user_roles").insert({
    user_id: data.user.id,
    role: "bidder",
  });
  if (roleError) {
    return { success: false, error: `Account created but role assignment failed: ${roleError.message}` };
  }

  await writeAuditEvent({
    actorId: data.user.id,
    action: "bidder.register",
    entityType: "bidder",
    entityId: data.user.id,
  });

  redirect("/dashboard");
}

const SignInInput = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
});

export async function signIn(_prev: AuthActionResult, formData: FormData): Promise<AuthActionResult> {
  const parsed = SignInInput.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { success: false, error: "Incorrect email or password." };
  }

  redirect("/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}