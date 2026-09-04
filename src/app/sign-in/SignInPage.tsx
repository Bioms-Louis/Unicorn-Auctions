"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signIn, type AuthActionResult } from "@/lib/auth/actions";

const initialState: AuthActionResult = { success: false };

export default function SignInPage() {
  const [state, formAction, pending] = useActionState(signIn, initialState);

  return (
    <div className="mx-auto max-w-md px-6 py-20">
      <h1 className="font-display text-3xl text-ink">Sign in</h1>

      <form action={formAction} className="mt-8 space-y-5">
        <label className="block">
          <span className="text-sm text-ink/80">Email</span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            className="mt-1 w-full border border-hairline bg-transparent px-3 py-2 text-ink outline-none focus:border-brass"
          />
        </label>
        <label className="block">
          <span className="text-sm text-ink/80">Password</span>
          <input
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="mt-1 w-full border border-hairline bg-transparent px-3 py-2 text-ink outline-none focus:border-brass"
          />
        </label>

        {state.error && <p className="text-sm text-red-700">{state.error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="w-full border border-ink py-3 text-sm text-ink transition hover:border-brass hover:text-brass disabled:opacity-50"
        >
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="mt-6 text-sm text-muted">
        New here?{" "}
        <Link href="/register" className="text-ink underline underline-offset-4 hover:text-brass">
          Register to bid
        </Link>
      </p>
    </div>
  );
}
