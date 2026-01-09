<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { Settings as SettingsIcon } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { useWeatherStore } from '@/stores/weather'
import LocationManager from '@/components/LocationManager.vue'
import WeatherCard from '@/components/WeatherCard.vue'
import ForecastRow from '@/components/ForecastRow.vue'
import { Button } from '@/components/ui/button'
import { useLocationStore } from '@/stores/location'

const locationStore = useLocationStore()
const weather = useWeatherStore()
const router = useRouter()

// Fetch weather when active location changes
watch(() => locationStore.currentLocation, (newLoc) => {
  if (newLoc) {
    weather.fetchWeather(newLoc.latitude, newLoc.longitude)
  }
}, { immediate: true })

onMounted(() => {
  // If we have a location but no data, fetch it
  if (locationStore.currentLocation && !weather.current) {
    weather.fetchWeather(locationStore.currentLocation.latitude, locationStore.currentLocation.longitude)
  }
})
</script>
<template>
  <div class="container max-w-lg mx-auto p-4 space-y-6">
    <main class="space-y-6">
      <LocationManager v-if="!locationStore.currentLocation" />
      <div v-if="locationStore.currentLocation"
        class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
