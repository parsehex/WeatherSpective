<script setup lang="ts">
import {
	ChevronsUpDown,
	Plus,
	Settings,
	MapPin,
	Check
} from "lucide-vue-next"
import { computed, ref } from 'vue'

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from '@/components/ui/sidebar'

import { useLocationStore } from '@/stores/location'
import SettingsDialog from '@/components/SettingsDialog.vue'

const locationStore = useLocationStore()
const { isMobile } = useSidebar()
const showSettings = ref(false)

const currentLocationName = computed(() => locationStore.currentLocation?.name || 'Select Location')
const savedLocations = computed(() => locationStore.savedLocations)

function selectLocation(loc: any) {
	locationStore.setCurrentLocation(loc)
}

// Placeholder for add location - we'll implement the view/logic later
function goToAddLocation() {
	console.log('Go to add location')
}

function openSettings() {
	showSettings.value = true
}

</script>
<template>
	<SettingsDialog v-model:open="showSettings" />
	<SidebarMenu>
		<SidebarMenuItem>
			<DropdownMenu>
				<DropdownMenuTrigger as-child>
					<SidebarMenuButton size="lg"
						class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
						<div class="grid flex-1 text-left text-sm leading-tight">
							<span class="truncate text-xs">Location</span>
							<span class="truncate font-medium text-base	">{{ currentLocationName }}</span>
						</div>
						<ChevronsUpDown class="ml-auto size-4" />
					</SidebarMenuButton>
				</DropdownMenuTrigger>
				<DropdownMenuContent class="w-[--reka-dropdown-menu-trigger-width] min-w-56 rounded-lg"
					:side="isMobile ? 'bottom' : 'right'" align="start" :side-offset="4">
					<DropdownMenuLabel class="text-xs text-muted-foreground"> Saved Locations </DropdownMenuLabel>
					<DropdownMenuGroup>
						<DropdownMenuItem v-for="loc in savedLocations" :key="loc.id" @click="selectLocation(loc)">
							<span>{{ loc.name }}</span>
							<Check v-if="locationStore.currentLocation?.id === loc.id" class="ml-auto size-4" />
						</DropdownMenuItem>
						<DropdownMenuItem v-if="savedLocations.length === 0" disabled>
							<span class="text-muted-foreground">No saved locations</span>
						</DropdownMenuItem>
					</DropdownMenuGroup>
					<DropdownMenuSeparator />
					<DropdownMenuItem @click="goToAddLocation">
						<Plus class="mr-2 size-4" /> Add Location
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem @click="openSettings">
						<Settings class="mr-2 size-4" /> Settings
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</SidebarMenuItem>
	</SidebarMenu>
</template>
