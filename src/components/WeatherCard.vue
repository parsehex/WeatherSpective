<script setup lang="ts">
import { computed } from 'vue'
import { useMediaQuery } from '@vueuse/core'
import { ThumbsUp, ThumbsDown, Loader2, ArrowUp } from 'lucide-vue-next'
import { format } from 'date-fns'
import { useWeatherStore } from '@/stores/weather'
import { useHistoryStore } from '@/stores/history'
import { useSettingsStore } from '@/stores/settings'
import { useLocationStore } from '@/stores/location'
import { getWeatherDescription } from '@/lib/weatherCodes'
import { COMPACT_DISPLAY_QUERY } from '@/lib/runtimeConfig'
import { Card } from './ui/card'
import { Button } from './ui/button'

const weather = useWeatherStore()
const history = useHistoryStore()
const settings = useSettingsStore()
const locationStore = useLocationStore()
const isCompactDisplay = useMediaQuery(COMPACT_DISPLAY_QUERY)

const temperature = computed(() => {
  if (!weather.current) return null
  return weather.current.temperature
})

const unitSymbol = computed(() => settings.temperatureUnit === 'celsius' ? '°C' : '°F')

function rateWeather(rating: 'up' | 'down') {
  if (!weather.current || !locationStore.currentLocation?.id) return

  history.addRating({
    locationId: locationStore.currentLocation.id,
    weatherCode: weather.current.weatherCode,
    temperature: weather.current.temperature, // Always store in C for consistency
    isDay: weather.current.isDay,
    rating
  })
}

const weatherDescription = computed(() => {
  const code = weather.current?.weatherCode
  if (code === undefined) return ''
  return getWeatherDescription(code)
})

const windDirection = computed(() => {
  if (!weather.current) return null
  const dir = weather.current.windDirection
  if (dir === undefined) return null
  const compassDirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  const idx = Math.round((dir / 360) * 8) % 8
  return compassDirs[idx]
})

const windRotation = computed(() => {
  if (!weather.current?.windDirection) return 0
  return (weather.current.windDirection + 180) % 360
})

const visibilityDistance = computed(() => {
  if (!weather.current) return 0
  return weather.current.visibility / 1000
})

const feelsLikeDifference = computed(() => {
  if (!weather.current) return 0
  return weather.current.apparentTemperature - weather.current.temperature
})

const currentConditions = computed(() => {
  if (!weather.current) return []
  const items = [
    { label: 'Feels Like', value: `${weather.current.apparentTemperature.toFixed(1)}${unitSymbol.value}` },
    { label: 'Humidity', value: `${Math.round(weather.current.relativeHumidity)}%` },
    { label: 'Precip Now', value: `${weather.current.precipitation.toFixed(1)} ${settings.precipitationUnit}` },
    { label: 'UV Index', value: weather.current.uvIndex.toFixed(1) },
    { label: 'Visibility', value: `${visibilityDistance.value.toFixed(1)} km` },
    { label: 'Pressure', value: `${Math.round(weather.current.surfacePressure)} hPa` },
    { label: 'Cloud Cover', value: `${Math.round(weather.current.cloudCover)}%` },
    { label: 'Dew Point', value: `${weather.current.dewPoint.toFixed(1)}${unitSymbol.value}` }
  ]

  return isCompactDisplay.value ? items.slice(0, 4) : items
})

const updatedAt = computed(() => {
  if (!weather.current?.time) return ''
  return format(new Date(weather.current.time), 'EEE, h:mm a')
})
</script>
<template>
  <Card class="weather-card weather-glass w-full overflow-hidden border-white/55 p-6 md:p-7" :class="{ 'p-4': isCompactDisplay }">
    <div v-if="weather.loading" class="flex justify-center items-center h-40">
      <Loader2 class="w-8 h-8 animate-spin text-primary" />
    </div>
    <div v-else-if="weather.error" class="text-destructive text-center py-8"> {{ weather.error }} </div>
    <div v-else-if="weather.current" class="space-y-6">
      <div class="space-y-3 text-center">
        <h2 class="page-title text-2xl font-semibold text-slate-700" :class="{ 'text-xl': isCompactDisplay }">{{ locationStore.currentLocation?.name }}</h2>
        <p class="text-sm font-medium uppercase tracking-[0.14em] text-teal-700/80">{{ weatherDescription }}</p>
        <div class="page-title text-6xl font-semibold tracking-tight text-slate-700 sm:text-7xl" :class="{ 'text-4xl': isCompactDisplay }"> {{ temperature?.toFixed(1) }}{{ unitSymbol }} </div>
        <div class="text-sm text-muted-foreground">
          Feels {{ feelsLikeDifference >= 0 ? 'warmer' : 'cooler' }} by {{ Math.abs(feelsLikeDifference).toFixed(1) }}{{
            unitSymbol }}
        </div>
      </div>

      <div class="metric-card">
        <div class="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
          <div class="flex items-center gap-2">
            <span>Wind</span>
            <div class="flex items-center gap-1 rounded-full border border-border/80 bg-white/70 px-2 py-0.5"
              title="Wind Direction (Flow)">
              <ArrowUp :style="{ transform: `rotate(${windRotation}deg)` }"
                class="h-4 w-4 transition-transform duration-500" />
              <span>{{ windDirection }}</span>
            </div>
          </div>
          <div>
            {{ weather.current.windSpeed.toFixed(1) }} {{ settings.windSpeedUnit }}
            <span class="text-xs">(gusts {{ weather.current.windGusts.toFixed(1) }})</span>
          </div>
        </div>
      </div>

      <div class="conditions-grid grid gap-3 sm:grid-cols-2" :class="{ 'gap-2': isCompactDisplay }">
        <div v-for="item in currentConditions" :key="item.label" class="metric-card">
          <p class="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">{{ item.label }}</p>
          <p class="page-title mt-2 text-2xl font-medium text-slate-700">{{ item.value }}</p>
        </div>
      </div>

      <div v-if="!isCompactDisplay" class="flex flex-wrap items-center justify-between gap-4">
        <div class="flex gap-3">
          <Button variant="outline" size="lg" class="h-12 w-12 rounded-full border-emerald-200 bg-white/80 p-0"
            @click="rateWeather('up')">
            <ThumbsUp class="w-6 h-6 text-green-500" />
          </Button>
          <Button variant="outline" size="lg" class="h-12 w-12 rounded-full border-rose-200 bg-white/80 p-0"
            @click="rateWeather('down')">
            <ThumbsDown class="w-6 h-6 text-red-500" />
          </Button>
        </div>
        <p class="text-xs text-muted-foreground">Updated {{ updatedAt }}</p>
      </div>
    </div>
    <div v-else class="text-center py-10 text-muted-foreground"> Select a location to see weather </div>
  </Card>
</template>

<style scoped>
@media (max-width: 560px) and (max-height: 380px) {
  .weather-card {
    border-radius: 1rem;
  }

  .weather-card .metric-card {
    padding: 0.65rem;
    border-radius: 0.9rem;
  }

  .weather-card .metric-card .page-title {
    margin-top: 0.35rem;
    font-size: 1.25rem;
    line-height: 1.2;
  }
}
</style>
