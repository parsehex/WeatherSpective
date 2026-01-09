import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';

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

	return {
		temperatureUnit,
		windSpeedUnit,
		precipitationUnit,
	};
});
