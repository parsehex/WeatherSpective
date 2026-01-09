<script setup lang="ts">
// NOTE: I/We tried to use the Command component from shadcn-vue for this, but it was not working for me.
// TODO: turn this into a component or break it out into multiple
import { ref, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { Search, MapPin, X } from 'lucide-vue-next'
import { weatherService, type LocationData } from '@/services/openMeteo'
import { useSettingsStore, type Location } from '@/stores/settings'
import { Button } from './ui/button'

const settings = useSettingsStore()
const query = ref('')
const results = ref<LocationData[]>([])
const searching = ref(false)

const search = useDebounceFn(async (q: string) => {
  if (!q || q.length < 2) {
    results.value = []
    return
  }
  searching.value = true
  try {
    results.value = await weatherService.searchLocation(q)
  } catch (e) {
    console.error(e)
  } finally {
    searching.value = false
  }
}, 500)

watch(query, (newVal) => {
  search(newVal)
})

function selectLocation(loc: LocationData) {
  const newLoc: Location = {
    id: loc.id,
    name: loc.name,
    latitude: loc.latitude,
    longitude: loc.longitude,
    country: loc.country,
    admin1: loc.admin1,
  }
  settings.addLocation(newLoc)
  settings.setActiveLocation(newLoc.id)
  query.value = ''
  results.value = []
}

function removeLocation(id: number) {
  settings.removeLocation(id)
}
</script>
<template>
  <div class="space-y-4">
    <div class="relative">
      <div class="flex items-center border rounded-md px-3 bg-background focus-within:ring-2 ring-primary">
        <Search class="w-4 h-4 text-muted-foreground mr-2" />
        <input v-model="query"
          class="flex h-10 w-full bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Search city..." />
      </div>
      <!-- Search Results Dropdown -->
      <div v-if="results.length > 0"
        class="absolute z-10 top-full mt-1 w-full bg-popover text-popover-foreground rounded-md border shadow-md overflow-hidden">
        <button v-for="res in results" :key="res.id"
          class="w-full text-left px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground flex items-center gap-2"
          @click="selectLocation(res)">
          <MapPin class="w-4 h-4" />
          <span>{{ res.name }}</span>
          <span v-if="res.admin1" class="text-muted-foreground text-xs">, {{ res.admin1 }}</span>
          <span class="text-muted-foreground text-xs">, {{ res.country }}</span>
        </button>
      </div>
    </div>
    <!-- Saved Locations List -->
    <div class="space-y-2">
      <h3 class="text-sm font-medium text-muted-foreground">Saved Locations</h3>
      <div class="grid gap-2">
        <div v-for="loc in settings.locations" :key="loc.id"
          class="flex items-center justify-between p-2 rounded-md border transition-colors cursor-pointer" :class="{
            'bg-primary/10 border-primary': settings.activeLocationId === loc.id,
            'hover:bg-accent': settings.activeLocationId !== loc.id
          }" @click="settings.setActiveLocation(loc.id)">
          <div class="font-medium text-sm">{{ loc.name }}</div>
          <Button variant="ghost" size="icon" class="h-6 w-6 text-muted-foreground hover:text-destructive"
            @click.stop="removeLocation(loc.id)">
            <X class="w-3 h-3" />
          </Button>
        </div>
        <div v-if="settings.locations.length === 0" class="text-sm text-muted-foreground italic"> No locations saved.
          Search to add one. </div>
      </div>
    </div>
  </div>
</template>
