declare global {
  interface D1Binding {
    prepare(query: string): D1Statement
  }

  interface D1Statement {
    bind(...values: unknown[]): D1Statement
    all(): Promise<{ results: Record<string, unknown>[]; success: boolean; meta: { last_row_id?: number; changes?: number; duration: number } }>
    first(): Promise<Record<string, unknown> | null>
    run(): Promise<{ success: boolean; meta: { last_row_id?: number; changes?: number; duration: number } }>
  }

  interface CloudflareEnv {
    DB?: D1Binding
  }
}

export {}
