import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const type = requestUrl.searchParams.get("type")
  const next = requestUrl.searchParams.get("next") || "/profile"

  if (code) {
    const supabase = await createClient()

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Se for um reset de senha, redireciona para a página de reset
      if (type === "recovery") {
        return NextResponse.redirect(
          new URL("/reset-password", requestUrl.origin)
        )
      }

      return NextResponse.redirect(new URL(next, requestUrl.origin))
    }
  }

  // Se houver erro, redireciona para login com mensagem de erro
  return NextResponse.redirect(
    new URL("/login?error=authentication_failed", requestUrl.origin)
  )
}
