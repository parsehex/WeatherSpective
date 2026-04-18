<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useWeatherStore } from '@/stores/weather'
import LocationManager from '@/components/LocationManager.vue'
import WeatherCard from '@/components/WeatherCard.vue'
import ForecastRow from '@/components/ForecastRow.vue'
import { useLocationStore } from '@/stores/location'
import { hasInvalidLockedLocationConfig, isLocationLocked } from '@/lib/runtimeConfig'

const locationStore = useLocationStore()
const weather = useWeatherStore()

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
  <div class="home-shell container mx-auto max-w-5xl space-y-8 px-1 pb-10">
    <main class="home-main space-y-8">
      <section v-if="!locationStore.currentLocation && !isLocationLocked" class="weather-glass p-6">
        <h2 class="page-title mb-4 text-xl font-semibold text-slate-700">Pick your first location</h2>
        <LocationManager />
      </section>

      <section v-else-if="!locationStore.currentLocation && hasInvalidLockedLocationConfig" class="weather-glass p-4 text-sm text-muted-foreground">
        Locked location config is invalid. Set a valid JSON object in VITE_LOCKED_LOCATION.
      </section>

      <div v-if="locationStore.currentLocation" class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <WeatherCard />
        <ForecastRow />
      </div>

      <footer class="pt-2 text-center text-xs text-muted-foreground">
        <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer" class="hover:underline"> Weather
          data by Open-Meteo.com </a>
      </footer>
    </main>
  </div>
</template>

<style scoped>
@media (max-width: 560px) and (max-height: 380px) {
  .home-shell {
    padding-bottom: 0.4rem;
  }

  .home-main {
    gap: 0.5rem;
  }
}
</style>
