import "server-only";

import { createServiceRoleClient } from "@/lib/supabase/service-role";

export type TaxType = "vat" | "wht" | "emtl" | "stamp_duty";
export type TaxScope = "platform" | "auction" | "lot" | "partner" | "category";

/**
 * Scope specificity, most specific first. "The most specific valid
 * configuration should take precedence" (section 25 of the operational
 * brief) — so we look for a lot-level override before a partner-level one,
 * before a category one, before an auction one, falling back to platform.
 */
const SCOPE_PRECEDENCE: TaxScope[] = ["lot", "partner", "category", "auction", "platform"];

export interface ResolveTaxRateInput {
  taxType: TaxType;
  lotId?: string;
  partnerId?: string;
  categoryId?: string;
  auctionId?: string;
  asOf?: Date;
}

const SCOPE_ID_KEY: Record<Exclude<TaxScope, "platform">, keyof ResolveTaxRateInput> = {
  lot: "lotId",
  partner: "partnerId",
  category: "categoryId",
  auction: "auctionId",
};

/**
 * Resolves the effective basis-point rate for a tax type, walking scope
 * precedence from most to least specific. Returns null if nothing is
 * configured anywhere (caller should then fall back to a documented
 * platform default from src/lib/money, and flag that no tax_rules row
 * exists — this should not silently happen in production).
 */
export async function resolveTaxRateBp(input: ResolveTaxRateInput): Promise<number | null> {
  const service = createServiceRoleClient();
  const asOf = (input.asOf ?? new Date()).toISOString();

  for (const scope of SCOPE_PRECEDENCE) {
    let query = service
      .from("tax_rules")
      .select("rate_bp, effective_from, effective_to")
      .eq("tax_type", input.taxType)
      .eq("scope", scope)
      .lte("effective_from", asOf)
      .order("effective_from", { ascending: false })
      .limit(1);

    if (scope === "platform") {
      query = query.is("scope_id", null);
    } else {
      const key = SCOPE_ID_KEY[scope];
      const scopeId = input[key] as string | undefined;
      if (!scopeId) continue; // no id available for this scope on this call, skip
      query = query.eq("scope_id", scopeId);
    }

    const { data, error } = await query.maybeSingle();
    if (error) {
      console.error("[taxes] resolveTaxRateBp query error", scope, error.message);
      continue;
    }
    if (!data) continue;
    if (data.effective_to && data.effective_to < asOf) continue;

    return data.rate_bp;
  }

  return null;
}
