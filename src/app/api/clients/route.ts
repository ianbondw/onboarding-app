import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      error: "Legacy endpoint retired. Use the tokenized onboarding flow at /api/onboarding/[token].",
    },
    { status: 410 }
  );
}
