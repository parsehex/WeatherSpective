/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ENABLE_PWA?: 'true' | 'false'
  readonly VITE_LOCKED_LOCATION?: string
  readonly VITE_LOCKED_TEMPERATURE_UNIT?: 'celsius' | 'fahrenheit'
  readonly VITE_LOCKED_WIND_SPEED_UNIT?: 'kmh' | 'mph' | 'ms' | 'kn'
  readonly VITE_LOCKED_PRECIPITATION_UNIT?: 'mm' | 'inch'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
