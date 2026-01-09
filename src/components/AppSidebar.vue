<script setup lang="ts">
import type { SidebarProps } from '@/components/ui/sidebar'
import { ref } from 'vue'
import { Settings } from 'lucide-vue-next'

import LocationSwitcher from '@/components/LocationSwitcher.vue'
import SettingsDialog from '@/components/SettingsDialog.vue'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'

const props = defineProps<SidebarProps>()
const showSettings = ref(false)
</script>
<template>
  <SettingsDialog v-model:open="showSettings" />
  <Sidebar v-bind="props">
    <SidebarHeader class="h-16 border-b border-sidebar-border">
      <LocationSwitcher />
    </SidebarHeader>
    <SidebarContent>
      <div class="p-4 text-sm text-muted-foreground"> Select a location to view weather. </div>
    </SidebarContent>
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton @click="showSettings = true">
            <Settings />
            <span>Settings</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem class="flex items-center gap-2 select-none">
          <div class="flex aspect-square size-8 items-center justify-center text-sidebar-primary-foreground">
            <img src="/weatherspective-logo-150px.png" alt="WeatherSpective" class="size-8" />
          </div>
          <span
            class="font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">WeatherSpective</span>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
</template>
