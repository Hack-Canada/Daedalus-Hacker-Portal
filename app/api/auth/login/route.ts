import { NextRequest, NextResponse } from "next/server";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import bcrypt from "bcryptjs";

import { ApiResponse } from "@/types/api";
import {
  createVerificationToken,
  getVerificationTokenByEmail,
} from "@/lib/db/queries/email-verification-tokens";
import { getUserByEmail } from "@/lib/db/queries/user";
import { sendWelcomeEmail } from "@/lib/emails/ses";
import { LoginSchema } from "@/lib/validations/login";

async function getEmailVerificationRedirect(email: string, name: string) {
  const [existingToken] = await getVerificationTokenByEmail(email);

  if (existingToken) {
    return `/email-verification?token=${existingToken.id}&email=${email}`;
  }

  const { tokenId, code } = await createVerificationToken(email);

  const result = await sendWelcomeEmail({
    name,
    email,
    subject: "Verify your email address for Hack Canada",
    token: tokenId,
    verificationCode: code,
  });

  if (!result.success) {
    return null;
  }

  return `/email-verification?token=${tokenId}&email=${email}`;
}

export async function POST(
  req: NextRequest,
): Promise<NextResponse<ApiResponse>> {
  try {
    const body = await req.json();

    const validatedFields = LoginSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const { email: validatedEmail, password } = validatedFields.data;

    const email = validatedEmail.toLowerCase();

    const existingUser = await getUserByEmail(email);

    if (!existingUser) {
      return NextResponse.json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    if (!existingUser.password) {
      return NextResponse.json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const passwordsMatch = await bcrypt.compare(
      password,
      existingUser.password,
    );

    if (!passwordsMatch) {
      return NextResponse.json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // ponytail: Auth.js throws CredentialsSignin when signIn callback returns a redirect URL with redirect:false
    if (!existingUser.emailVerified) {
      const redirectUrl = await getEmailVerificationRedirect(
        existingUser.email,
        existingUser.name,
      );

      if (!redirectUrl) {
        return NextResponse.json({
          success: false,
          message: "Could not send verification email. Please try again.",
        });
      }

      return NextResponse.json({
        success: false,
        message: "Email verification required. Please check your email.",
        data: { redirect: redirectUrl },
      });
    }

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (!result) {
      return NextResponse.json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Handle email verification redirect
    if (typeof result === "string" && result.includes("/email-verification")) {
      return NextResponse.json({
        success: false,
        message: "Email verification required. Please check your email.",
        data: {
          redirect: result,
        },
      });
    }

    // If everything is successful
    return NextResponse.json({
      success: true,
      message: "Welcome!",
    });
  } catch (error) {
    console.error("Error during login:", error);

    // Handling known errors
    if (error instanceof Error) {
      const { type } = error as AuthError;
      if (type === "CredentialsSignin") {
        return NextResponse.json({
          success: false,
          message: "Invalid email or password.",
        });
      }
    }

    // Any other unhandled errors
    return NextResponse.json({
      success: false,
      message: "Something went wrong, please try again.",
    });
  }
}
