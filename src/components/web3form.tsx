"use client";

import { useState, type FormEvent } from "react";

export interface Web3FormField {
  name: string;
  label: string;
  type?: "text" | "email" | "tel" | "textarea";
  required?: boolean;
  placeholder?: string;
}

export interface Web3FormProps {
  /** Value for Web3Forms' "subject" field, shown in the email you receive. */
  subject: string;
  fields: Web3FormField[];
  submitLabel?: string;
  successMessage?: string;
}

type Status = "idle" | "submitting" | "success" | "error";

/**
 * Generic public-facing form backed by Web3Forms (section 55 of the
 * operational brief). Only for contact/enquiry/application-style forms —
 * never for authentication, KYC, bidding, or payment data, which go
 * through Supabase/server-side logic instead.
 *
 * NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY must be set (see .env.example).
 */
export function Web3Form({ subject, fields, submitLabel = "Submit", successMessage }: Web3FormProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage(null);

    const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
    if (!accessKey) {
      setStatus("error");
      setErrorMessage("Form is not configured yet. Please email us directly in the meantime.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    formData.append("access_key", accessKey);
    formData.append("subject", subject);

    // Honeypot: Web3Forms silently discards submissions where this hidden
    // field is filled in, since a human never sees or fills it.
    if (formData.get("botcheck")) {
      setStatus("success");
      return;
    }

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();

      if (result.success) {
        setStatus("success");
        event.currentTarget.reset();
      } else {
        setStatus("error");
        setErrorMessage(result.message ?? "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMessage("Could not reach the server. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <p className="border border-hairline p-6 text-ink">
        {successMessage ?? "Thanks — we've received your submission and will be in touch shortly."}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" className="hidden" />

      {fields.map((field) => (
        <label key={field.name} className="block">
          <span className="text-sm text-ink/80">{field.label}</span>
          {field.type === "textarea" ? (
            <textarea
              name={field.name}
              required={field.required !== false}
              placeholder={field.placeholder}
              rows={4}
              className="mt-1 w-full border border-hairline bg-transparent px-3 py-2 text-ink outline-none focus:border-brass"
            />
          ) : (
            <input
              name={field.name}
              type={field.type ?? "text"}
              required={field.required !== false}
              placeholder={field.placeholder}
              className="mt-1 w-full border border-hairline bg-transparent px-3 py-2 text-ink outline-none focus:border-brass"
            />
          )}
        </label>
      ))}

      {status === "error" && errorMessage && <p className="text-sm text-red-700">{errorMessage}</p>}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full border border-ink py-3 text-sm text-ink transition hover:border-brass hover:text-brass disabled:opacity-50"
      >
        {status === "submitting" ? "Sending…" : submitLabel}
      </button>
    </form>
  );
}
