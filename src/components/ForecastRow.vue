<script setup lang="ts">
import { computed } from 'vue'
import { format } from 'date-fns'
import { useWeatherStore } from '@/stores/weather'
import { useSettingsStore } from '@/stores/settings'
import { Card } from './ui/card'

const weather = useWeatherStore()
const settings = useSettingsStore()

const forecast = computed(() => {
  if (!weather.daily) return []
  const { time, temperatureMax, temperatureMin, weatherCode } = weather.daily

  return time.slice(0, 5).map((t, index) => {
    const max = temperatureMax[index] ?? 0
    const min = temperatureMin[index] ?? 0
    return {
      date: t,
      day: format(new Date(t), 'EEE'),
      max: settings.tempUnit === 'celsius' ? max : (max * 9 / 5) + 32,
      min: settings.tempUnit === 'celsius' ? min : (min * 9 / 5) + 32,
      code: weatherCode[index]
    }
  })
})
</script>
<template>
  <Card v-if="forecast.length > 0" class="p-4 w-full max-w-md mx-auto mt-4">
    <h3 class="text-sm font-medium text-muted-foreground mb-4">5-Day Forecast</h3>
    <div class="space-y-3">
      <div v-for="day in forecast" :key="day.date" class="flex items-center justify-between text-sm">
        <div class="w-12 font-medium">{{ day.day }}</div>
        <div class="flex-1 text-center text-muted-foreground text-xs">
          <!-- Could add icon here based on day.code -->
        </div>
        <div class="flex gap-4">
          <span class="font-medium">{{ Math.round(day.max) }}°</span>
          <span class="text-muted-foreground">{{ Math.round(day.min) }}°</span>
        </div>
      </div>
    </div>
  </Card>
</template>
