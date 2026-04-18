import type { LocationData } from '@/services/openMeteo'

type TemperatureUnit = 'celsius' | 'fahrenheit'
type WindSpeedUnit = 'kmh' | 'mph' | 'ms' | 'kn'
type PrecipitationUnit = 'mm' | 'inch'

export const COMPACT_DISPLAY_QUERY = '(max-width: 560px) and (max-height: 380px)'

function createLocationId(seed: string): number {
  let hash = 0
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  }
  return 900000000 + (hash % 90000000)
}

function parseLockedLocation(raw: string | undefined): LocationData | null {
  if (!raw) return null

  try {
    const parsed = JSON.parse(raw) as Partial<LocationData>
    if (!parsed.name || typeof parsed.name !== 'string') return null
    if (typeof parsed.latitude !== 'number' || typeof parsed.longitude !== 'number') return null
    if (!Number.isFinite(parsed.latitude) || !Number.isFinite(parsed.longitude)) return null

    const normalized: LocationData = {
      id:
        typeof parsed.id === 'number' && Number.isFinite(parsed.id)
          ? Math.round(parsed.id)
          : createLocationId(`${parsed.name}:${parsed.latitude}:${parsed.longitude}`),
      name: parsed.name,
      latitude: parsed.latitude,
      longitude: parsed.longitude,
      country: typeof parsed.country === 'string' ? parsed.country : 'Locked',
      admin1: typeof parsed.admin1 === 'string' ? parsed.admin1 : undefined,
    }

    return normalized
  } catch {
    return null
  }
}

function parseEnumLock<T extends string>(raw: string | undefined, allowed: readonly T[]): T | null {
  const normalized = raw?.trim().toLowerCase()
  if (!normalized) return null
  return (allowed as readonly string[]).includes(normalized) ? (normalized as T) : null
}

const lockedLocationRaw = import.meta.env.VITE_LOCKED_LOCATION?.trim()
const lockedTempUnitRaw = import.meta.env.VITE_LOCKED_TEMPERATURE_UNIT
const lockedWindUnitRaw = import.meta.env.VITE_LOCKED_WIND_SPEED_UNIT
const lockedPrecipUnitRaw = import.meta.env.VITE_LOCKED_PRECIPITATION_UNIT

export const lockedLocation = parseLockedLocation(lockedLocationRaw)
export const isLocationLocked = lockedLocation !== null
export const hasInvalidLockedLocationConfig = Boolean(lockedLocationRaw) && !isLocationLocked

export const lockedTemperatureUnit = parseEnumLock<TemperatureUnit>(lockedTempUnitRaw, ['celsius', 'fahrenheit'])
export const lockedWindSpeedUnit = parseEnumLock<WindSpeedUnit>(lockedWindUnitRaw, ['kmh', 'mph', 'ms', 'kn'])
export const lockedPrecipitationUnit = parseEnumLock<PrecipitationUnit>(lockedPrecipUnitRaw, ['mm', 'inch'])

export const isTemperatureUnitLocked = lockedTemperatureUnit !== null
export const isWindSpeedUnitLocked = lockedWindSpeedUnit !== null
export const isPrecipitationUnitLocked = lockedPrecipitationUnit !== null
export const hasAnySettingsLock =
  isTemperatureUnitLocked || isWindSpeedUnitLocked || isPrecipitationUnitLocked

export const hasInvalidTemperatureUnitLockConfig = Boolean(lockedTempUnitRaw?.trim()) && !isTemperatureUnitLocked
export const hasInvalidWindSpeedUnitLockConfig = Boolean(lockedWindUnitRaw?.trim()) && !isWindSpeedUnitLocked
export const hasInvalidPrecipitationUnitLockConfig = Boolean(lockedPrecipUnitRaw?.trim()) && !isPrecipitationUnitLocked
