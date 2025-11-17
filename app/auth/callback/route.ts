import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const token_hash = requestUrl.searchParams.get("token_hash")
  const type = requestUrl.searchParams.get("type")
  const code = requestUrl.searchParams.get("code")
  const next = requestUrl.searchParams.get("next") || "/profile"

  const supabase = await createClient()

  // Novo formato: PKCE flow com code
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      return NextResponse.redirect(new URL(next, requestUrl.origin))
    }

    console.error("Error exchanging code:", error)
  }

  // Formato antigo: token_hash (magic link, recovery)
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type: type as any,
      token_hash
    })

    if (!error) {
      // Se for recovery, vai para reset-password
      if (type === "recovery" || type === "email_change") {
        return NextResponse.redirect(
          new URL("/reset-password", requestUrl.origin)
        )
      }
      // Se for magiclink, vai para o next ou profile
      return NextResponse.redirect(new URL(next, requestUrl.origin))
    }

    console.error("Error verifying OTP:", error)
  }

  console.error("No valid auth params found:", { code, token_hash, type })

  return NextResponse.redirect(
    new URL("/login?error=authentication_failed", requestUrl.origin)
  )
}
