"use server";

import { placeFloorBid, type PlaceBidResult } from "@/lib/bidding/place-bid";
import { closeLot as closeLotService, type CloseLotResult } from "@/lib/bidding/close-lot";
import { findPaddleForAuction } from "@/lib/auctions/console-queries";

export async function submitFloorBid(input: {
  auctionId: string;
  lotId: string;
  paddleNumber: string;
  amountKobo: number;
}): Promise<PlaceBidResult> {
  const paddle = await findPaddleForAuction(input.auctionId, input.paddleNumber);

  if (!paddle || !paddle.is_active) {
    return {
      success: false,
      error: { code: "PADDLE_NOT_VALID", message: `Paddle ${input.paddleNumber} is not valid for this auction.` },
    };
  }

  return placeFloorBid({
    auctionId: input.auctionId,
    lotId: input.lotId,
    paddleId: paddle.id,
    amountKobo: input.amountKobo,
  });
}

export async function closeLotAction(lotId: string): Promise<CloseLotResult> {
  return closeLotService(lotId);
}
