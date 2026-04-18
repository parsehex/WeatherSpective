<script setup lang="ts">
import { ref, watch } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { useLocationStore } from '@/stores/location'
import { useWeatherStore } from '@/stores/weather'
import {
	hasInvalidPrecipitationUnitLockConfig,
	hasInvalidTemperatureUnitLockConfig,
	hasInvalidWindSpeedUnitLockConfig,
	hasAnySettingsLock,
} from '@/lib/runtimeConfig'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

const settings = useSettingsStore()
const locationStore = useLocationStore()
const weatherStore = useWeatherStore()
const open = ref(false)

watch(
	() => [settings.temperatureUnit, settings.windSpeedUnit, settings.precipitationUnit],
	() => {
		if (locationStore.currentLocation) {
			weatherStore.fetchWeather(locationStore.currentLocation.latitude, locationStore.currentLocation.longitude)
		}
	}
)
</script>
<template>
	<Dialog v-model:open="open">
		<DialogContent class="sm:max-w-[425px]">
			<DialogHeader>
				<DialogTitle>Settings</DialogTitle>
				<DialogDescription> Customize your weather preferences. </DialogDescription>
			</DialogHeader>
			<p v-if="hasAnySettingsLock" class="rounded-md border border-amber-300/70 bg-amber-50 px-3 py-2 text-xs text-amber-800">
				Some settings are managed by environment variables and cannot be changed here.
			</p>
			<p
				v-if="hasInvalidTemperatureUnitLockConfig || hasInvalidWindSpeedUnitLockConfig || hasInvalidPrecipitationUnitLockConfig"
				class="rounded-md border border-rose-300/70 bg-rose-50 px-3 py-2 text-xs text-rose-800">
				One or more lock environment variables are invalid and were ignored.
			</p>
			<div class="grid gap-4 py-4">
				<div class="grid gap-2">
					<Label>Temperature Unit</Label>
					<RadioGroup v-model="settings.temperatureUnit" class="flex gap-4"
						:disabled="settings.isTemperatureUnitLocked">
						<div class="flex items-center space-x-2">
							<RadioGroupItem id="temp-c" value="celsius" />
							<Label for="temp-c">Celsius (°C)</Label>
						</div>
						<div class="flex items-center space-x-2">
							<RadioGroupItem id="temp-f" value="fahrenheit" />
							<Label for="temp-f">Fahrenheit (°F)</Label>
						</div>
					</RadioGroup>
				</div>
				<div class="grid gap-2">
					<Label>Wind Speed Unit</Label>
					<RadioGroup v-model="settings.windSpeedUnit" class="grid grid-cols-2 gap-2"
						:disabled="settings.isWindSpeedUnitLocked">
						<div class="flex items-center space-x-2">
							<RadioGroupItem id="wind-kmh" value="kmh" />
							<Label for="wind-kmh">Km/h</Label>
						</div>
						<div class="flex items-center space-x-2">
							<RadioGroupItem id="wind-mph" value="mph" />
							<Label for="wind-mph">Mph</Label>
						</div>
						<div class="flex items-center space-x-2">
							<RadioGroupItem id="wind-ms" value="ms" />
							<Label for="wind-ms">m/s</Label>
						</div>
						<div class="flex items-center space-x-2">
							<RadioGroupItem id="wind-kn" value="kn" />
							<Label for="wind-kn">Knots</Label>
						</div>
					</RadioGroup>
				</div>
				<div class="grid gap-2">
					<Label>Precipitation Unit</Label>
					<RadioGroup v-model="settings.precipitationUnit" class="flex gap-4"
						:disabled="settings.isPrecipitationUnitLocked">
						<div class="flex items-center space-x-2">
							<RadioGroupItem id="precip-mm" value="mm" />
							<Label for="precip-mm">Millimeters</Label>
						</div>
						<div class="flex items-center space-x-2">
							<RadioGroupItem id="precip-in" value="inch" />
							<Label for="precip-in">Inches</Label>
						</div>
					</RadioGroup>
				</div>
			</div>
		</DialogContent>
	</Dialog>
</template>
