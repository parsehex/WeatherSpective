import { defineStore } from 'pinia';
import { ref } from 'vue';
import {
	weatherService,
	type WeatherData,
	type ForecastDaily,
	type ForecastHourly,
} from '@/services/openMeteo';
import { useSettingsStore } from './settings';

export const useWeatherStore = defineStore('weather', () => {
	const current = ref<WeatherData | null>(null);
	const daily = ref<ForecastDaily | null>(null);
	const hourly = ref<ForecastHourly | null>(null);
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
				apparentTemperature: currentData.apparent_temperature,
				weatherCode: currentData.weather_code,
				relativeHumidity: currentData.relative_humidity_2m,
				precipitation: currentData.precipitation,
				cloudCover: currentData.cloud_cover,
				surfacePressure: currentData.surface_pressure,
				visibility: currentData.visibility,
				uvIndex: currentData.uv_index,
				dewPoint: currentData.dew_point_2m,
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
				precipitationSum: data.daily.precipitation_sum,
				uvIndexMax: data.daily.uv_index_max,
				sunrise: data.daily.sunrise,
				sunset: data.daily.sunset,
				windSpeedMax: data.daily.wind_speed_10m_max,
			};

			hourly.value = {
				time: data.hourly.time,
				temperature: data.hourly.temperature_2m,
				weatherCode: data.hourly.weather_code,
				precipitationProbability: data.hourly.precipitation_probability,
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
		hourly,
		loading,
		error,
		fetchWeather,
	};
});
