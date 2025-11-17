import { NextResponse } from "next/server"

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message)
    this.name = "ApiError"
  }
}

export function handleApiError(error: unknown) {
  console.error("API Error:", error)

  if (error instanceof ApiError) {
    return NextResponse.json(
      { error: error.message, code: error.code },
      { status: error.statusCode }
    )
  }

  if (error instanceof Error) {
    // Check for specific error types
    if (error.message.includes("not found")) {
      return NextResponse.json(
        { error: "Recurso não encontrado" },
        { status: 404 }
      )
    }

    if (
      error.message.includes("unauthorized") ||
      error.message.includes("authentication")
    ) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    if (error.message.includes("forbidden")) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 })
    }

    // Generic error
    return NextResponse.json(
      { error: "Erro ao processar requisição", details: error.message },
      { status: 500 }
    )
  }

  // Unknown error
  return NextResponse.json(
    { error: "Erro interno do servidor" },
    { status: 500 }
  )
}

export function createSuccessResponse<T>(data: T, status = 200) {
  return NextResponse.json(data, { status })
}

export function createErrorResponse(
  message: string,
  status = 400,
  code?: string
) {
  return NextResponse.json({ error: message, code }, { status })
}
