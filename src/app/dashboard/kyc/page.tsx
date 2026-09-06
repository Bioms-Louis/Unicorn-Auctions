"use client";

import { useActionState } from "react";
import { submitKycAction, type DashboardActionResult } from "@/app/dashboard/actions";

const initialState: DashboardActionResult = { success: false };

export default function KycPage() {
  const [state, formAction, pending] = useActionState(submitKycAction, initialState);

  return (
    <div className="max-w-xl">
      <h1 className="font-display text-3xl text-ink">Complete your KYC</h1>
      <p className="mt-2 text-sm text-ink/70">
        This is reviewed by our KYC team before you can pay a deposit and
        bid. Document upload (ID scan, proof of address) is handled after
        this step.
      </p>

      <form action={formAction} className="mt-8 space-y-5">
        <Field label="Full legal name" name="fullName" type="text" />
        <Field label="Date of birth" name="dateOfBirth" type="date" />
        <div className="grid grid-cols-2 gap-4">
          <Field label="ID type" name="idType" type="text" placeholder="NIN, Passport, etc." />
          <Field label="ID number" name="idNumber" type="text" />
        </div>
        <Field label="Address" name="addressLine1" type="text" />
        <div className="grid grid-cols-2 gap-4">
          <Field label="City" name="city" type="text" />
          <Field label="State" name="state" type="text" />
        </div>
        <Field label="Phone" name="phone" type="tel" />
        <Field label="TIN (optional)" name="tin" type="text" required={false} />

        {state.error && <p className="text-sm text-red-700">{state.error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="w-full border border-ink py-3 text-sm text-ink transition hover:border-brass hover:text-brass disabled:opacity-50"
        >
          {pending ? "Submitting…" : "Submit for review"}
        </button>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  type,
  placeholder,
  required = true,
}: {
  label: string;
  name: string;
  type: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-sm text-ink/80">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="mt-1 w-full border border-hairline bg-transparent px-3 py-2 text-ink outline-none focus:border-brass"
      />
    </label>
  );
}
