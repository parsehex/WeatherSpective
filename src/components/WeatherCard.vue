<script setup lang="ts">
import { computed } from 'vue'
import { ThumbsUp, ThumbsDown, Loader2 } from 'lucide-vue-next'
import { useWeatherStore } from '@/stores/weather'
import { useHistoryStore } from '@/stores/history'
import { useSettingsStore } from '@/stores/settings'
import { useLocationStore } from '@/stores/location'
import { Card } from './ui/card'
import { Button } from './ui/button'

const weather = useWeatherStore()
const history = useHistoryStore()
const settings = useSettingsStore()
const locationStore = useLocationStore()

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

// Simple weather code mapping for display
const weatherDescription = computed(() => {
  const code = weather.current?.weatherCode
  if (code === undefined) return ''
  // WMO Weather interpretation codes (WW)
  if (code === 0) return 'Clear sky'
  if (code === 1) return 'Mainly clear'
  if (code === 2) return 'Partly cloudy'
  if (code === 3) return 'Overcast'
  if (code >= 45 && code <= 48) return 'Fog'
  if (code >= 51 && code <= 55) return 'Drizzle'
  if (code >= 61 && code <= 65) return 'Rain'
  if (code >= 71 && code <= 77) return 'Snow'
  if (code >= 80 && code <= 82) return 'Rain showers'
  if (code >= 95) return 'Thunderstorm'
  return 'Unknown'
})

const windDirection = computed(() => {
  if (!weather.current) return null
  const dir = weather.current.windDirection
  if (dir === undefined) return null
  const compassDirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  const idx = Math.round((dir / 360) * 8)
  return compassDirs[idx]
})
</script>
<template>
  <Card class="p-6 w-full max-w-md mx-auto">
    <div v-if="weather.loading" class="flex justify-center items-center h-40">
      <Loader2 class="w-8 h-8 animate-spin text-primary" />
    </div>
    <div v-else-if="weather.error" class="text-destructive text-center py-8"> {{ weather.error }} </div>
    <div v-else-if="weather.current" class="text-center space-y-6">
      <div class="space-y-2">
        <h2 class="text-lg font-medium text-muted-foreground">{{ weatherDescription }}</h2>
        <div class="text-6xl font-bold tracking-tighter"> {{ temperature?.toFixed(1) }}{{ unitSymbol }} </div>
        <div class="flex justify-center gap-4 text-md text-muted-foreground">
          <div class="flex items-center gap-1">
            <span>Wind:</span>
            <span>{{ weather.current.windSpeed }} {{ settings.windSpeedUnit }}</span>
            <span>{{ windDirection }}</span>
          </div>
          <div class="flex items-center gap-1">
            <span>Gusts:</span>
            <span>{{ weather.current.windGusts }} {{ settings.windSpeedUnit }}</span>
          </div>
        </div>
        <div class="flex justify-center gap-3">
          <Button variant="outline" size="lg" class="rounded-full w-14 h-14 p-0" @click="rateWeather('up')">
            <ThumbsUp class="w-6 h-6 text-green-500" />
          </Button>
          <Button variant="outline" size="lg" class="rounded-full w-14 h-14 p-0" @click="rateWeather('down')">
            <ThumbsDown class="w-6 h-6 text-red-500" />
          </Button>
        </div>
      </div>
    </div>
    <div v-else class="text-center py-10 text-muted-foreground"> Select a location to see weather </div>
  </Card>
</template>
