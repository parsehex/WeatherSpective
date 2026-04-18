import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';
import {
	isPrecipitationUnitLocked,
	isTemperatureUnitLocked,
	isWindSpeedUnitLocked,
	lockedPrecipitationUnit,
	lockedTemperatureUnit,
	lockedWindSpeedUnit,
} from '@/lib/runtimeConfig';

export const useSettingsStore = defineStore('settings', () => {
	const temperatureUnit = useStorage<'celsius' | 'fahrenheit'>(
		'ws-settings-temp-unit',
		'celsius'
	);
	const windSpeedUnit = useStorage<'kmh' | 'mph' | 'ms' | 'kn'>(
		'ws-settings-wind-unit',
		'kmh'
	);
	const precipitationUnit = useStorage<'mm' | 'inch'>(
		'ws-settings-precip-unit',
		'mm'
	);

	if (lockedTemperatureUnit) {
		temperatureUnit.value = lockedTemperatureUnit;
	}

	if (lockedWindSpeedUnit) {
		windSpeedUnit.value = lockedWindSpeedUnit;
	}

	if (lockedPrecipitationUnit) {
		precipitationUnit.value = lockedPrecipitationUnit;
	}

	return {
		temperatureUnit,
		windSpeedUnit,
		precipitationUnit,
		isTemperatureUnitLocked,
		isWindSpeedUnitLocked,
		isPrecipitationUnitLocked,
	};
});
