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
      </SidebarMenu>
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
</template>
