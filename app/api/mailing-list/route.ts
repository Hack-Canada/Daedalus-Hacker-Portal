import { NextRequest, NextResponse } from "next/server";

import { ApiResponse } from "@/types/api";
import { db } from "@/lib/db";
import { mailingListSubscribers } from "@/lib/db/schema";
import { MailingListSchema } from "@/lib/validations/mailing-list";

// ponytail: no rate limiting — unique email constraint blocks duplicates; add per-IP limiting if spam shows up
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function POST(
  req: NextRequest,
): Promise<NextResponse<ApiResponse>> {
  try {
    const body = await req.json();
    const validated = MailingListSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid email address",
        },
        { status: 400, headers: corsHeaders },
      );
    }

    const email = validated.data.email.toLowerCase();

    await db
      .insert(mailingListSubscribers)
      .values({ email })
      .onConflictDoNothing();

    return NextResponse.json(
      {
        success: true,
        message: "You're on the list! We'll be in touch.",
      },
      { headers: corsHeaders },
    );
  } catch (error) {
    console.error("Error during mailing list signup:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong, please try again.",
      },
      { status: 500, headers: corsHeaders },
    );
  }
}
