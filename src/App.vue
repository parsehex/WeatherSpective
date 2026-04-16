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
</script>
<template>
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <header
        class="sticky top-0 z-20 flex h-20 shrink-0 items-center gap-3 border-b border-white/40 bg-[linear-gradient(95deg,rgba(246,255,252,0.9),rgba(233,245,252,0.8))] px-4 shadow-sm backdrop-blur-md">
        <SidebarTrigger class="-ml-1 rounded-full border border-border/80 bg-white/80" />
        <Separator orientation="vertical" class="mr-1 data-[orientation=vertical]:h-6" />
        <Breadcrumb class="flex-1">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>
                <RouterLink to="/" class="flex items-center gap-3">
                  <img src="/weatherspective-logo-150px.png" alt="WeatherSpective logo" class="size-10 rounded-full" />
                  <span
                    class="page-title bg-gradient-to-r from-primary via-emerald-500 to-cyan-500 bg-clip-text text-xl font-semibold text-transparent">WeatherSpective</span>
                </RouterLink>
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <div class="relative flex flex-1 flex-col gap-4 overflow-hidden px-4 pb-8 pt-6 md:px-6">
        <div class="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-emerald-300/25 blur-3xl" />
        <div class="pointer-events-none absolute -right-20 top-12 h-64 w-64 rounded-full bg-cyan-300/20 blur-3xl" />
        <RouterView />
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>
