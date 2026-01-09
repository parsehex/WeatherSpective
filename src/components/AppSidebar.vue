<script setup lang="ts">
import type { SidebarProps } from '@/components/ui/sidebar'

import LocationSwitcher from '@/components/LocationSwitcher.vue'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'

const props = defineProps<SidebarProps>()
</script>
<template>
  <Sidebar v-bind="props">
    <SidebarHeader class="h-16 border-b border-sidebar-border">
      <LocationSwitcher />
    </SidebarHeader>
    <SidebarContent>
      <div class="p-4 text-sm text-muted-foreground"> Select a location to view weather. </div>
    </SidebarContent>
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem class="flex items-center gap-2 select-none">
          <div class="flex aspect-square size-8 items-center justify-center text-sidebar-primary-foreground">
            <img src="/weatherspective-logo-150px.png" alt="WeatherSpective" class="size-8" />
          </div>
          <span>WeatherSpective</span>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
</template>
