import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const token_hash = requestUrl.searchParams.get("token_hash")
  const type = requestUrl.searchParams.get("type")
  const code = requestUrl.searchParams.get("code")
  const next = requestUrl.searchParams.get("next") || "/profile"

  // Log detalhado para debug
  console.log("🔐 Auth Callback - URL:", requestUrl.href)
  console.log("📋 Auth Params:", {
    token_hash: token_hash ? "present" : "missing",
    type,
    code: code ? "present" : "missing",
    next
  })

  const supabase = await createClient()

  // Novo formato: PKCE flow com code
  if (code) {
    console.log("🔄 Exchanging code for session...")
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      console.log("✅ Code exchange successful:", data.user?.email)
      return NextResponse.redirect(new URL(next, requestUrl.origin))
    }

    console.error("❌ Error exchanging code:", error.message, error)
    return NextResponse.redirect(
      new URL(
        `/login?error=code_exchange_failed&message=${encodeURIComponent(
          error.message
        )}`,
        requestUrl.origin
      )
    )
  }

  // Formato antigo: token_hash (magic link, recovery)
  if (token_hash && type) {
    console.log("🔄 Verifying OTP with token_hash...")
    const { data, error } = await supabase.auth.verifyOtp({
      type: type as any,
      token_hash
    })

    if (!error) {
      console.log("✅ OTP verification successful:", data.user?.email)

      // Se for recovery, vai para reset-password
      if (type === "recovery" || type === "email_change") {
        return NextResponse.redirect(
          new URL("/reset-password", requestUrl.origin)
        )
      }
      // Se for magiclink, vai para o next ou profile
      return NextResponse.redirect(new URL(next, requestUrl.origin))
    }

    console.error("❌ Error verifying OTP:", error.message, error)
    return NextResponse.redirect(
      new URL(
        `/login?error=otp_verification_failed&message=${encodeURIComponent(
          error.message
        )}`,
        requestUrl.origin
      )
    )
  }

  console.error("❌ No valid auth params found:", { code, token_hash, type })

  return NextResponse.redirect(
    new URL("/login?error=missing_auth_params", requestUrl.origin)
  )
}
