<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { Settings as SettingsIcon } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { useSettingsStore } from '@/stores/settings'
import { useWeatherStore } from '@/stores/weather'
import LocationManager from '@/components/LocationManager.vue'
import WeatherCard from '@/components/WeatherCard.vue'
import ForecastRow from '@/components/ForecastRow.vue'
import { Button } from '@/components/ui/button'

const settings = useSettingsStore()
const weather = useWeatherStore()
const router = useRouter()

// Fetch weather when active location changes
watch(() => settings.activeLocationId, (newId) => {
  if (newId) {
    const loc = settings.locations.find(l => l.id === newId)
    if (loc) {
      weather.fetchWeather(loc.latitude, loc.longitude)
    }
  }
}, { immediate: true })

onMounted(() => {
  // If we have a location but no data, fetch it
  if (settings.activeLocationId && !weather.current) {
    const loc = settings.locations.find(l => l.id === settings.activeLocationId)
    if (loc) {
      weather.fetchWeather(loc.latitude, loc.longitude)
    }
  }
})
</script>
<template>
  <div class="container max-w-lg mx-auto p-4 space-y-6">
    <header class="flex justify-between items-center py-2">
      <div class="flex items-center gap-3">
        <img src="/weatherspective-logo-150px.png" alt="WeatherSpective Logo" class="h-10 w-auto" />
        <h1 class="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          WeatherSpective </h1>
      </div>
      <Button variant="ghost" size="icon" @click="router.push('/settings')">
        <SettingsIcon class="w-5 h-5" />
      </Button>
    </header>
    <main class="space-y-6">
      <LocationManager />
      <div v-if="settings.activeLocationId" class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <WeatherCard />
        <ForecastRow />
      </div>
      <footer class="text-center text-xs text-muted-foreground pt-4 pb-2">
        <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer" class="hover:underline"> Weather
          data by Open-Meteo.com </a>
      </footer>
    </main>
  </div>
</template>
