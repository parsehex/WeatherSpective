<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { useSettingsStore } from '@/stores/settings'
import { useHistoryStore } from '@/stores/history'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

const router = useRouter()
const settings = useSettingsStore()
const history = useHistoryStore()
</script>
<template>
  <div class="container max-w-lg mx-auto p-4 space-y-6">
    <header class="flex items-center gap-2 py-2">
      <Button variant="ghost" size="icon" @click="router.back()">
        <ArrowLeft class="w-5 h-5" />
      </Button>
      <h1 class="text-xl font-bold">Settings</h1>
    </header>
    <main class="space-y-6">
      <Card class="p-4 space-y-4">
        <h2 class="font-medium text-lg">Preferences</h2>
        <div class="flex items-center justify-between">
          <span>Temperature Unit</span>
          <div class="flex bg-muted rounded-md p-1">
            <button class="px-3 py-1 rounded-sm text-sm transition-colors"
              :class="settings.tempUnit === 'celsius' ? 'bg-background shadow-sm' : 'text-muted-foreground'"
              @click="settings.tempUnit = 'celsius'"> °C </button>
            <button class="px-3 py-1 rounded-sm text-sm transition-colors"
              :class="settings.tempUnit === 'fahrenheit' ? 'bg-background shadow-sm' : 'text-muted-foreground'"
              @click="settings.tempUnit = 'fahrenheit'"> °F </button>
          </div>
        </div>
      </Card>
      <Card class="p-4 space-y-4">
        <h2 class="font-medium text-lg">My Data</h2>
        <div class="text-sm text-muted-foreground">
          <p>Ratings recorded: {{ history.ratings.length }}</p>
        </div>
      </Card>
      <div class="text-center text-xs text-muted-foreground"> WeatherSpective v0.1.0 </div>
    </main>
  </div>
</template>
