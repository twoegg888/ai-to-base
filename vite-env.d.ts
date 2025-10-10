/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_PROJECT_ID: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_SUPABASE_URL: string
  readonly VITE_MAKE_WEBHOOK_URL: string
  readonly VITE_PUBLIC_APP_VERSION: string
  readonly VITE_DEBUG_MODE?: string
  // Vite 기본 환경변수
  readonly DEV: boolean
  readonly PROD: boolean
  readonly MODE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}