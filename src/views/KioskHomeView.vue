<script setup lang="ts">
import { ref, computed } from 'vue'
import { format } from 'date-fns'
import { ArrowUp, Loader2 } from 'lucide-vue-next'
import { useWeatherStore } from '@/stores/weather'
import { useSettingsStore } from '@/stores/settings'
import { getWeatherDescription } from '@/lib/weatherCodes'

type SubView = 'hourly' | 'daily' | 'details'
const activeView = ref<SubView>('hourly')

const weather = useWeatherStore()
const settings = useSettingsStore()

function formatClock(value: string | undefined): string {
  if (!value) return '--:--'
  return format(new Date(value), 'h:mm a')
}

const unitSymbol = computed(() => settings.temperatureUnit === 'celsius' ? '°C' : '°F')

const weatherDescription = computed(() => {
  const code = weather.current?.weatherCode
  if (code === undefined) return ''
  return getWeatherDescription(code)
})

const windDirection = computed(() => {
  const dir = weather.current?.windDirection
  if (dir === undefined || dir === null) return null
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  return dirs[Math.round((dir / 360) * 8) % 8]
})

const windRotation = computed(() => {
  if (!weather.current?.windDirection) return 0
  return (weather.current.windDirection + 180) % 360
})

const feelsLikeDiff = computed(() => {
  if (!weather.current) return 0
  return weather.current.apparentTemperature - weather.current.temperature
})

const updatedAt = computed(() => {
  if (!weather.current?.time) return ''
  return format(new Date(weather.current.time), 'EEE h:mm a')
})

// ── Hourly sub-view ─────────────────────────────────────────────────────────
const hourlyItems = computed(() => {
  if (!weather.hourly) return []
  const { time, temperature, precipitationProbability, weatherCode } = weather.hourly
  return time.slice(0, 12).map((t, i) => ({
    time: format(new Date(t), 'ha'),
    temperature: temperature[i] ?? 0,
    pop: precipitationProbability[i] ?? 0,
    description: getWeatherDescription(weatherCode[i] ?? 0),
  }))
})

// ── Daily sub-view ───────────────────────────────────────────────────────────
const dailyItems = computed(() => {
  if (!weather.daily) return []
  const { time, temperatureMax, temperatureMin, weatherCode, precipitationProbability, windSpeedMax } = weather.daily
  return time.slice(0, 7).map((t, i) => ({
    day: format(new Date(t), 'EEE'),
    date: format(new Date(t), 'MMM d'),
    max: temperatureMax[i] ?? 0,
    min: temperatureMin[i] ?? 0,
    code: weatherCode[i],
    pop: precipitationProbability[i] ?? 0,
    windMax: windSpeedMax[i] ?? 0,
    description: getWeatherDescription(weatherCode[i] ?? 0),
  }))
})

// ── Details sub-view ─────────────────────────────────────────────────────────
const detailItems = computed(() => {
  if (!weather.current) return []
  const c = weather.current
  const today = weather.daily
  const items = [
    { label: 'Cloud Cover', value: `${Math.round(c.cloudCover)}%` },
    { label: 'Dew Point', value: `${c.dewPoint.toFixed(1)}${unitSymbol.value}` },
    { label: 'Pressure', value: `${Math.round(c.surfacePressure)} hPa` },
    { label: 'Visibility', value: `${(c.visibility / 1000).toFixed(1)} km` },
    { label: 'UV Index', value: c.uvIndex.toFixed(1) },
    { label: 'Precip Now', value: `${c.precipitation.toFixed(1)} ${settings.precipitationUnit}` },
  ]
  if (today) {
    items.push(
      { label: 'Sunrise', value: formatClock(today.sunrise[0] ?? today.time[0]) },
      { label: 'Sunset', value: formatClock(today.sunset[0] ?? today.time[0]) },
    )
  }
  return items
})
</script>

<template>
  <div class="kiosk-root">
    <!-- Loading / Error states -->
    <div v-if="weather.loading" class="kiosk-state">
      <Loader2 class="w-10 h-10 animate-spin text-primary" />
    </div>
    <div v-else-if="weather.error" class="kiosk-state text-destructive">
      {{ weather.error }}
    </div>

    <!-- Main layout -->
    <div v-else-if="weather.current" class="kiosk-layout">

      <!-- ── Left panel: current conditions ── -->
      <aside class="kiosk-left weather-glass">
        <p class="kiosk-description">{{ weatherDescription }}</p>
        <div class="kiosk-temp">{{ weather.current.temperature.toFixed(1) }}{{ unitSymbol }}</div>
        <p class="kiosk-feels">
          Feels {{ feelsLikeDiff >= 0 ? 'warmer' : 'cooler' }} ·
          {{ weather.current.apparentTemperature.toFixed(1) }}{{ unitSymbol }}
        </p>

        <div class="kiosk-wind">
          <div class="wind-dir-badge">
            <ArrowUp :style="{ transform: `rotate(${windRotation}deg)` }" class="wind-arrow" />
            <span>{{ windDirection }}</span>
          </div>
          <span class="wind-speed">{{ weather.current.windSpeed.toFixed(1) }} {{ settings.windSpeedUnit }}</span>
          <span class="wind-gusts">gusts {{ weather.current.windGusts.toFixed(1) }}</span>
        </div>

        <div class="kiosk-metrics">
          <div class="metric-pill">
            <span class="metric-label">Humidity</span>
            <span class="metric-value">{{ Math.round(weather.current.relativeHumidity) }}%</span>
          </div>
          <div class="metric-pill">
            <span class="metric-label">UV</span>
            <span class="metric-value">{{ weather.current.uvIndex.toFixed(1) }}</span>
          </div>
          <div class="metric-pill">
            <span class="metric-label">Pressure</span>
            <span class="metric-value">{{ Math.round(weather.current.surfacePressure) }}</span>
          </div>
          <div class="metric-pill">
            <span class="metric-label">Visibility</span>
            <span class="metric-value">{{ (weather.current.visibility / 1000).toFixed(1) }} km</span>
          </div>
        </div>

        <p class="kiosk-updated">Updated {{ updatedAt }}</p>
      </aside>

      <!-- ── Right panel: sub-views ── -->
      <section class="kiosk-right">
        <nav class="subview-tabs" role="tablist">
          <button
            v-for="tab in (['hourly', 'daily', 'details'] as SubView[])"
            :key="tab"
            role="tab"
            :aria-selected="activeView === tab"
            :class="['tab-btn', { active: activeView === tab }]"
            @click="activeView = tab"
          >
            {{ tab === 'hourly' ? 'Hourly' : tab === 'daily' ? '7-Day' : 'Details' }}
          </button>
        </nav>

        <!-- Hourly -->
        <div v-if="activeView === 'hourly'" class="subview-content hourly-grid">
          <div v-for="h in hourlyItems" :key="h.time" class="hour-card weather-glass">
            <span class="hour-time">{{ h.time }}</span>
            <span class="hour-temp">{{ Math.round(h.temperature) }}°</span>
            <span class="hour-pop">{{ Math.round(h.pop) }}%</span>
            <span class="hour-desc">{{ h.description }}</span>
          </div>
        </div>

        <!-- Daily -->
        <div v-if="activeView === 'daily'" class="subview-content daily-list">
          <div v-for="d in dailyItems" :key="d.day" class="day-row weather-glass">
            <div class="day-name">
              <span class="day-dow">{{ d.day }}</span>
              <span class="day-date">{{ d.date }}</span>
            </div>
            <span class="day-desc">{{ d.description }}</span>
            <span class="day-temps">{{ Math.round(d.max) }}° / {{ Math.round(d.min) }}°</span>
            <span class="day-pop">{{ Math.round(d.pop) }}% rain</span>
            <span class="day-wind">{{ d.windMax.toFixed(0) }} {{ settings.windSpeedUnit }}</span>
          </div>
        </div>

        <!-- Details -->
        <div v-if="activeView === 'details'" class="subview-content details-grid">
          <div v-for="item in detailItems" :key="item.label" class="detail-card weather-glass">
            <span class="detail-label">{{ item.label }}</span>
            <span class="detail-value">{{ item.value }}</span>
          </div>
        </div>
      </section>
    </div>

    <div v-else class="kiosk-state text-muted-foreground">
      No weather data available.
    </div>
  </div>
</template>

<style scoped>
/* ── Root layout ─────────────────────────────────────────────────────────── */
.kiosk-root {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

.kiosk-state {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
}

.kiosk-layout {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 0.85rem;
  height: 100%;
  min-height: 0;
}

/* ── Left panel ──────────────────────────────────────────────────────────── */
.kiosk-left {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.1rem 1rem;
  border-radius: 1.25rem;
  overflow: hidden;
}

.kiosk-description {
  margin: 0;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(15, 118, 110, 0.8);
}

.kiosk-temp {
  font-size: clamp(3rem, 8vw, 4.5rem);
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.02em;
  color: #334155;
  font-family: "Mona Sans", "IBM Plex Sans", "Segoe UI", sans-serif;
}

.kiosk-feels {
  margin: 0;
  font-size: 0.82rem;
  color: #64748b;
}

.kiosk-wind {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  color: #64748b;
  flex-wrap: wrap;
}

.wind-dir-badge {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.8);
  background: rgba(255, 255, 255, 0.7);
  padding: 0.15rem 0.55rem;
}

.wind-arrow {
  width: 0.85rem;
  height: 0.85rem;
  transition: transform 0.5s;
}

.wind-speed {
  font-weight: 600;
  color: #334155;
}

.wind-gusts {
  font-size: 0.78rem;
}

.kiosk-metrics {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.45rem;
  margin-top: auto;
}

.metric-pill {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  border-radius: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.7);
  padding: 0.45rem 0.6rem;
}

.metric-label {
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #64748b;
}

.metric-value {
  font-size: 1rem;
  font-weight: 600;
  color: #334155;
  line-height: 1.2;
  font-family: "Mona Sans", "IBM Plex Sans", "Segoe UI", sans-serif;
}

.kiosk-updated {
  margin: 0;
  font-size: 0.72rem;
  color: #64748b;
}

/* ── Right panel ─────────────────────────────────────────────────────────── */
.kiosk-right {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  min-height: 0;
}

.subview-tabs {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.tab-btn {
  padding: 0.4rem 1.1rem;
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.8);
  background: rgba(255, 255, 255, 0.6);
  font-size: 0.85rem;
  font-weight: 600;
  color: #475569;
  cursor: pointer;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
  backdrop-filter: blur(6px);
}

.tab-btn.active {
  background: linear-gradient(135deg, #34d399, #22d3ee);
  border-color: transparent;
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(52, 211, 153, 0.35);
}

.subview-content {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

/* Hourly grid: 2 rows × 6 cols */
.hourly-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 0.45rem;
  height: 100%;
}

.hour-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.1rem;
  border-radius: 0.9rem;
  padding: 0.35rem 0.25rem;
  text-align: center;
}

.hour-time {
  font-size: 0.72rem;
  font-weight: 700;
  color: #475569;
  text-transform: lowercase;
}

.hour-temp {
  font-size: 1.1rem;
  font-weight: 700;
  color: #334155;
  line-height: 1;
  font-family: "Mona Sans", "IBM Plex Sans", "Segoe UI", sans-serif;
}

.hour-pop {
  font-size: 0.7rem;
  color: #0e7490;
  font-weight: 600;
}

.hour-desc {
  font-size: 0.62rem;
  color: #64748b;
  text-align: center;
  line-height: 1.2;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Daily list: 7 rows */
.daily-list {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  height: 100%;
}

.day-row {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border-radius: 0.85rem;
  padding: 0 0.85rem;
  min-height: 0;
}

.day-name {
  display: flex;
  flex-direction: column;
  min-width: 3rem;
}

.day-dow {
  font-size: 0.9rem;
  font-weight: 700;
  color: #334155;
}

.day-date {
  font-size: 0.68rem;
  color: #64748b;
}

.day-desc {
  flex: 1;
  font-size: 0.8rem;
  color: #475569;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.day-temps {
  font-size: 0.9rem;
  font-weight: 700;
  color: #334155;
  white-space: nowrap;
  font-family: "Mona Sans", "IBM Plex Sans", "Segoe UI", sans-serif;
}

.day-pop {
  font-size: 0.75rem;
  color: #0e7490;
  font-weight: 600;
  white-space: nowrap;
  min-width: 4.5rem;
  text-align: right;
}

.day-wind {
  font-size: 0.75rem;
  color: #64748b;
  white-space: nowrap;
  min-width: 3.5rem;
  text-align: right;
}

/* Details grid */
.details-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 0.55rem;
  height: 100%;
}

.detail-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  border-radius: 1rem;
  text-align: center;
}

.detail-label {
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #64748b;
}

.detail-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #334155;
  font-family: "Mona Sans", "IBM Plex Sans", "Segoe UI", sans-serif;
}
</style>
