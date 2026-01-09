import { defineStore } from 'pinia';
import { ref } from 'vue';
import {
	weatherService,
	type WeatherData,
	type ForecastDaily,
} from '@/services/openMeteo';
import { useSettingsStore } from './settings';

export const useWeatherStore = defineStore('weather', () => {
	const current = ref<WeatherData | null>(null);
	const daily = ref<ForecastDaily | null>(null);
	const loading = ref(false);
	const error = ref<string | null>(null);

	const settings = useSettingsStore();

	async function fetchWeather(lat: number, lng: number) {
		loading.value = true;
		error.value = null;
		try {
			const data = await weatherService.getWeather(lat, lng, {
				temperature: settings.temperatureUnit,
				windSpeed: settings.windSpeedUnit,
				precipitation: settings.precipitationUnit,
			});

			// Map API response to our interface
			const currentData = data.current;
			current.value = {
				temperature: currentData.temperature_2m,
				weatherCode: currentData.weather_code,
				windSpeed: currentData.wind_speed_10m,
				windDirection: currentData.wind_direction_10m,
				windGusts: currentData.wind_gusts_10m,
				isDay: currentData.is_day,
				time: currentData.time,
			};

			daily.value = {
				time: data.daily.time,
				weatherCode: data.daily.weather_code,
				temperatureMax: data.daily.temperature_2m_max,
				temperatureMin: data.daily.temperature_2m_min,
				precipitationProbability: data.daily.precipitation_probability_max,
			};
		} catch (e) {
			console.error(e);
			error.value = 'Failed to fetch weather data';
		} finally {
			loading.value = false;
		}
	}

	return {
		current,
		daily,
		loading,
		error,
		fetchWeather,
	};
});
