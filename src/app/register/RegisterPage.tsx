"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signUpBidder, type AuthActionResult } from "@/lib/auth/actions";

const initialState: AuthActionResult = { success: false };

export default function RegisterPage() {
  const [state, formAction, pending] = useActionState(signUpBidder, initialState);

  return (
    <div className="mx-auto max-w-md px-6 py-20">
      <h1 className="font-display text-3xl text-ink">Register to bid</h1>
      <p className="mt-2 text-sm text-ink/70">
        Registration is the first step. You&apos;ll complete KYC before bidding is enabled.
      </p>

      <form action={formAction} className="mt-8 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <Field label="First name" name="firstName" type="text" autoComplete="given-name" />
          <Field label="Last name" name="lastName" type="text" autoComplete="family-name" />
        </div>
        <Field label="Email" name="email" type="email" autoComplete="email" />
        <Field label="Password" name="password" type="password" autoComplete="new-password" />

        {state.error && <p className="text-sm text-red-700">{state.error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="w-full border border-ink py-3 text-sm text-ink transition hover:border-brass hover:text-brass disabled:opacity-50"
        >
          {pending ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-sm text-muted">
        Already registered?{" "}
        <Link href="/sign-in" className="text-ink underline underline-offset-4 hover:text-brass">
          Sign in
        </Link>
      </p>
    </div>
  );
}

function Field({
  label,
  name,
  type,
  autoComplete,
}: {
  label: string;
  name: string;
  type: string;
  autoComplete: string;
}) {
  return (
    <label className="block">
      <span className="text-sm text-ink/80">{label}</span>
      <input
        name={name}
        type={type}
        required
        autoComplete={autoComplete}
        className="mt-1 w-full border border-hairline bg-transparent px-3 py-2 text-ink outline-none focus:border-brass"
      />
    </label>
  );
}