<script setup lang="ts">
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
import { isLocationLocked } from '@/lib/runtimeConfig'
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
                    class="title-text page-title bg-gradient-to-r from-primary via-emerald-500 to-cyan-500 bg-clip-text text-xl font-semibold text-transparent">WeatherSpective</span>
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
          class="title-text page-title bg-gradient-to-r from-primary via-emerald-500 to-cyan-500 bg-clip-text text-lg font-semibold text-transparent">WeatherSpective</span>
      </RouterLink>
    </header>
    <div class="app-content relative flex flex-1 flex-col overflow-hidden px-3 pb-4 pt-3 sm:px-4 sm:pb-6 sm:pt-4">
      <div class="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-emerald-300/25 blur-3xl" />
      <div class="pointer-events-none absolute -right-20 top-12 h-64 w-64 rounded-full bg-cyan-300/20 blur-3xl" />
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
@media (max-width: 560px) and (max-height: 380px) {
  .app-header {
    height: 3rem;
    padding-left: 0.625rem;
    padding-right: 0.625rem;
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
}
</style>
