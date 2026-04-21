<script setup lang="ts">
import { ref } from 'vue'
import AppSidebar from "@/components/AppSidebar.vue"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { RouterView } from 'vue-router'
import { COMPACT_DISPLAY_QUERY, isLocationLocked, parseboxControlsUrl } from '@/lib/runtimeConfig'
import { useLocationStore } from './stores/location'
import { useMediaQuery } from '@vueuse/core'

const locationStore = useLocationStore()
const isCompactDisplay = useMediaQuery(COMPACT_DISPLAY_QUERY)
const isControlsOpen = ref(false)

function openControls() {
  isControlsOpen.value = true
}

function closeControls() {
  isControlsOpen.value = false
}
</script>
<template>
  <SidebarProvider v-if="!isLocationLocked">
    <AppSidebar />
    <SidebarInset class="app-shell">
      <header
        class="app-header sticky top-0 z-20 flex h-20 shrink-0 items-center gap-3 border-b border-white/40 bg-[linear-gradient(95deg,rgba(246,255,252,0.9),rgba(233,245,252,0.8))] px-4 shadow-sm backdrop-blur-md">
        <SidebarTrigger class="-ml-1 rounded-full border border-border/80 bg-white/80" />
        <Separator orientation="vertical" class="mr-1 data-[orientation=vertical]:h-6" />
        <Breadcrumb class="flex-1">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>
                <RouterLink to="/" class="flex items-center gap-3">
                  <img src="/weatherspective-logo-150px.png" alt="WeatherSpective logo" class="size-10 rounded-full" />
                  <span
                    class="title-text page-title bg-linear-to-r from-primary via-emerald-500 to-cyan-500 bg-clip-text text-xl font-semibold text-transparent">WeatherSpective</span>
                </RouterLink>
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <div class="app-content relative flex flex-1 flex-col gap-4 overflow-hidden px-4 pb-8 pt-6 md:px-6">
        <div class="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-emerald-300/25 blur-3xl" />
        <div class="pointer-events-none absolute -right-20 top-12 h-64 w-64 rounded-full bg-cyan-300/20 blur-3xl" />
        <RouterView />
      </div>
    </SidebarInset>
  </SidebarProvider>

  <div v-else class="app-shell flex min-h-screen flex-col">
    <header
      class="app-header sticky top-0 z-20 flex h-16 shrink-0 items-center border-b border-white/40 bg-[linear-gradient(95deg,rgba(246,255,252,0.9),rgba(233,245,252,0.8))] px-4 shadow-sm backdrop-blur-md">
      <RouterLink to="/" class="flex items-center gap-3">
        <img src="/weatherspective-logo-150px.png" alt="WeatherSpective logo" class="size-9 rounded-full" />
        <span
          class="title-text page-title bg-linear-to-r from-primary via-emerald-500 to-cyan-500 bg-clip-text text-lg font-semibold text-transparent">WeatherSpective</span>
      </RouterLink>
      <h2 v-if="locationStore.isLocationLocked" class="page-title text-2xl font-semibold text-slate-700" :class="{ 'text-xl': isCompactDisplay }">{{ locationStore.currentLocation?.name }}</h2>
      <button class="controls-launch" type="button" @click="openControls">Controls</button>
    </header>
    <div class="app-content relative flex flex-1 flex-col overflow-hidden px-3 pb-4 pt-3 sm:px-4 sm:pb-6 sm:pt-4">
      <div class="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-emerald-300/25 blur-3xl" />
      <div class="pointer-events-none absolute -right-20 top-12 h-64 w-64 rounded-full bg-cyan-300/20 blur-3xl" />
      <RouterView />

      <section v-if="isControlsOpen" class="controls-overlay" aria-label="ParseBox controls">
        <header class="controls-header">
          <h3>ParseBox Controls</h3>
          <button class="controls-close" type="button" @click="closeControls">Back</button>
        </header>
        <iframe
          class="controls-frame"
          :src="parseboxControlsUrl"
          title="ParseBox controls"
          loading="eager"
          referrerpolicy="no-referrer"
        />
      </section>
    </div>
  </div>
</template>

<style scoped>
.controls-launch {
  margin-left: auto;
  border: 1px solid rgba(26, 65, 112, 0.3);
  border-radius: 999px;
  padding: 0.4rem 0.85rem;
  background: rgba(36, 109, 96, 0.13);
  color: #1f3f63;
  font-weight: 600;
}

.controls-overlay {
  position: absolute;
  inset: 0.5rem;
  z-index: 30;
  border-radius: 14px;
  border: 1px solid rgba(30, 80, 128, 0.28);
  background: rgba(238, 247, 255, 0.98);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 24px 34px rgba(12, 32, 56, 0.25);
}

.controls-header {
  min-height: 2.75rem;
  padding: 0 0.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(111, 152, 196, 0.3);
  background: linear-gradient(90deg, rgba(241, 253, 248, 0.95), rgba(232, 242, 254, 0.95));
}

.controls-header h3 {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 700;
  color: #24425f;
}

.controls-close {
  border: 1px solid rgba(32, 66, 105, 0.28);
  border-radius: 8px;
  background: #ffffff;
  color: #1f3f63;
  font-weight: 600;
  padding: 0.25rem 0.6rem;
}

.controls-frame {
  flex: 1;
  width: 100%;
  border: 0;
  background: #0d1b2f;
}

@media (max-width: 560px) and (max-height: 380px) {
  .app-header {
    height: 3rem;
    padding-left: 0.625rem;
    padding-right: 0.625rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .title-text {
    font-size: 0.95rem;
  }

  .app-content {
    padding-top: 0.5rem;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    padding-bottom: 0.625rem;
  }

  .controls-launch {
    padding: 0.2rem 0.55rem;
    font-size: 0.82rem;
  }

  .controls-overlay {
    inset: 0.25rem;
  }
}
</style>
