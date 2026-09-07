import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const getCurrentBidder = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/sign-in");

  const { data: bidder } = await supabase
    .from("bidders")
    .select("id, state")
    .eq("user_id", user.id)
    .single();

  if (!bidder) redirect("/register");

  return { user, bidder };
});
