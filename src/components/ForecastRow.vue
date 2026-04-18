<script setup lang="ts">
import { computed } from 'vue'
import { useMediaQuery } from '@vueuse/core'
import { format } from 'date-fns'
import { useWeatherStore } from '@/stores/weather'
import { getWeatherDescription } from '@/lib/weatherCodes'
import { COMPACT_DISPLAY_QUERY } from '@/lib/runtimeConfig'
import { Card } from './ui/card'

const weather = useWeatherStore()
const isCompactDisplay = useMediaQuery(COMPACT_DISPLAY_QUERY)

const dayForecastTitle = computed(() => (isCompactDisplay.value ? '3-Day Forecast' : '7-Day Forecast'))
const hourlyForecastTitle = computed(() => (isCompactDisplay.value ? 'Next 6 hours' : 'Next 12 hours'))

const forecast = computed(() => {
  if (!weather.daily) return []
  const { time, temperatureMax, temperatureMin, weatherCode, precipitationProbability, precipitationSum, uvIndexMax, sunrise, sunset, windSpeedMax } = weather.daily

  const dayCount = isCompactDisplay.value ? 3 : 7

  return time.slice(0, dayCount).map((t, index) => {
    const max = temperatureMax[index] ?? 0
    const min = temperatureMin[index] ?? 0
    return {
      date: t,
      day: format(new Date(t), 'EEE'),
      max: max,
      min: min,
      code: weatherCode[index],
      precipitationProbability: precipitationProbability[index] ?? 0,
      precipitationSum: precipitationSum[index] ?? 0,
      uvIndexMax: uvIndexMax[index] ?? 0,
      sunrise: sunrise[index] ?? t,
      sunset: sunset[index] ?? t,
      windSpeedMax: windSpeedMax[index] ?? 0,
      description: getWeatherDescription(weatherCode[index] ?? 0)
    }
  })
})

const hourlyForecast = computed(() => {
  if (!weather.hourly) return []
  const { time, temperature, precipitationProbability, weatherCode } = weather.hourly

  const hourCount = isCompactDisplay.value ? 6 : 12

  return time.slice(0, hourCount).map((t, index) => ({
    time: format(new Date(t), 'ha'),
    temperature: temperature[index] ?? 0,
    precipitationProbability: precipitationProbability[index] ?? 0,
    description: getWeatherDescription(weatherCode[index] ?? 0)
  }))
})
</script>
<template>
  <Card v-if="forecast.length > 0" class="forecast-card weather-glass w-full border-white/55 p-5 md:p-6" :class="{ 'p-4': isCompactDisplay }">
    <h3 class="page-title mb-4 text-lg font-semibold text-slate-700">{{ dayForecastTitle }}</h3>
    <div class="space-y-3" :class="{ 'space-y-2': isCompactDisplay }">
      <div v-for="day in forecast" :key="day.date" class="rounded-2xl border border-white/60 bg-white/70 p-4">
        <div class="mb-3 flex items-start justify-between gap-3">
          <div>
            <p class="text-base font-semibold text-slate-700">{{ day.day }}</p>
            <p class="text-xs text-muted-foreground">{{ format(new Date(day.date), 'MMM d') }}</p>
          </div>
          <div class="text-right">
            <p class="text-base font-semibold text-slate-700">{{ Math.round(day.max) }}° / {{ Math.round(day.min) }}°</p>
            <p class="text-xs text-muted-foreground">{{ day.description }}</p>
          </div>
        </div>

        <div v-if="!isCompactDisplay" class="grid gap-2 text-xs text-muted-foreground sm:grid-cols-3">
          <div>Rain chance: <span class="font-medium text-slate-700">{{ Math.round(day.precipitationProbability) }}%</span></div>
          <div>Precip total: <span class="font-medium text-slate-700">{{ day.precipitationSum.toFixed(1) }}</span></div>
          <div>Max UV: <span class="font-medium text-slate-700">{{ day.uvIndexMax.toFixed(1) }}</span></div>
          <div>Sunrise: <span class="font-medium text-slate-700">{{ format(new Date(day.sunrise), 'h:mm a') }}</span></div>
          <div>Sunset: <span class="font-medium text-slate-700">{{ format(new Date(day.sunset), 'h:mm a') }}</span></div>
          <div>Peak wind: <span class="font-medium text-slate-700">{{ day.windSpeedMax.toFixed(1) }}</span></div>
        </div>
      </div>
    </div>

    <div v-if="hourlyForecast.length > 0" class="mt-6" :class="{ 'mt-4': isCompactDisplay }">
      <h4 class="mb-3 text-sm font-medium text-muted-foreground">{{ hourlyForecastTitle }}</h4>
      <div class="grid auto-cols-[minmax(100px,1fr)] grid-flow-col gap-2 overflow-x-auto pb-1">
        <div v-for="hour in hourlyForecast" :key="hour.time"
          class="rounded-xl border border-white/60 bg-white/80 p-3 text-center">
          <p class="text-xs font-semibold text-slate-700">{{ hour.time }}</p>
          <p class="page-title mt-1 text-xl text-slate-700">{{ Math.round(hour.temperature) }}°</p>
          <p class="mt-1 text-[11px] text-muted-foreground">{{ Math.round(hour.precipitationProbability) }}% rain</p>
        </div>
      </div>
    </div>
  </Card>
</template>

<style scoped>
@media (max-width: 560px) and (max-height: 380px) {
  .forecast-card {
    border-radius: 1rem;
  }

  .forecast-card > h3 {
    margin-bottom: 0.5rem;
  }

  .forecast-card .rounded-2xl {
    padding: 0.6rem 0.65rem;
    border-radius: 0.8rem;
  }
}
</style>
