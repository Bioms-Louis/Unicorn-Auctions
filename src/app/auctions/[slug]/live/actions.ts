"use server";

import { placeOnlineBid, type PlaceBidResult } from "@/lib/bidding/place-bid";

export async function submitOnlineBid(input: {
  auctionId: string;
  lotId: string;
  amountKobo: number;
}): Promise<PlaceBidResult> {
  return placeOnlineBid(input);
}
