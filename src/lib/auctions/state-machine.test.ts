import { describe, expect, it } from "vitest";
import {
  assertValidAuctionTransition,
  isPubliclyVisible,
  isValidAuctionTransition,
} from "@/lib/auctions/state-machine";

describe("auction state machine", () => {
  it("allows the documented happy path in order", () => {
    const path = [
      "draft",
      "pending_review",
      "scheduled",
      "registration_open",
      "inspection_open",
      "live",
      "completed",
    ] as const;
    for (let i = 0; i < path.length - 1; i++) {
      expect(isValidAuctionTransition(path[i], path[i + 1])).toBe(true);
    }
  });

  it("allows pause and resume from live", () => {
    expect(isValidAuctionTransition("live", "paused")).toBe(true);
    expect(isValidAuctionTransition("paused", "live")).toBe(true);
  });

  it("rejects arbitrary jumps", () => {
    expect(isValidAuctionTransition("draft", "live")).toBe(false);
    expect(isValidAuctionTransition("scheduled", "completed")).toBe(false);
    expect(() => assertValidAuctionTransition("draft", "completed")).toThrow();
  });

  it("allows cancellation from any non-terminal state", () => {
    expect(isValidAuctionTransition("draft", "cancelled")).toBe(true);
    expect(isValidAuctionTransition("live", "cancelled")).toBe(true);
    expect(isValidAuctionTransition("paused", "cancelled")).toBe(true);
  });

  it("treats archived as terminal", () => {
    expect(isValidAuctionTransition("archived", "draft")).toBe(false);
  });

  it("draft and pending_review are not publicly visible; everything else is", () => {
    expect(isPubliclyVisible("draft")).toBe(false);
    expect(isPubliclyVisible("pending_review")).toBe(false);
    expect(isPubliclyVisible("live")).toBe(true);
    expect(isPubliclyVisible("completed")).toBe(true);
  });
});
