import axios from 'axios';

export interface WeatherData {
	temperature: number;
	apparentTemperature: number;
	weatherCode: number;
	relativeHumidity: number;
	precipitation: number;
	cloudCover: number;
	surfacePressure: number;
	visibility: number;
	uvIndex: number;
	dewPoint: number;
	windSpeed: number;
	windDirection: number;
	windGusts: number;
	isDay: number;
	time: string;
}

export interface ForecastDaily {
	time: string[];
	weatherCode: number[];
	temperatureMax: number[];
	temperatureMin: number[];
	precipitationProbability: number[];
	precipitationSum: number[];
	uvIndexMax: number[];
	sunrise: string[];
	sunset: string[];
	windSpeedMax: number[];
}

export interface ForecastHourly {
	time: string[];
	temperature: number[];
	weatherCode: number[];
	precipitationProbability: number[];
}

export interface LocationData {
	id: number;
	name: string;
	latitude: number;
	longitude: number;
	country: string;
	admin1?: string;
}

const BASE_URL = 'https://api.open-meteo.com/v1/forecast';
const GEO_URL = 'https://geocoding-api.open-meteo.com/v1/search';

export const weatherService = {
	async getWeather(
		lat: number,
		lng: number,
		units?: {
			temperature?: 'celsius' | 'fahrenheit';
			windSpeed?: 'kmh' | 'mph' | 'ms' | 'kn';
			precipitation?: 'mm' | 'inch';
		}
	) {
		const params: any = {
			latitude: lat,
			longitude: lng,
			current:
				'temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,weather_code,cloud_cover,surface_pressure,visibility,wind_speed_10m,wind_direction_10m,wind_gusts_10m,is_day,uv_index,dew_point_2m',
			daily:
				'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,uv_index_max,sunrise,sunset,wind_speed_10m_max',
			hourly: 'temperature_2m,weather_code,precipitation_probability',
			timezone: 'auto',
		};

		if (units?.temperature) params.temperature_unit = units.temperature;
		if (units?.windSpeed) params.wind_speed_unit = units.windSpeed;
		if (units?.precipitation) params.precipitation_unit = units.precipitation;

		// Create a unique cache key based on params
		const cacheKey = `weather:${lat}:${lng}:${JSON.stringify(units || {})}`;
		const cached = localStorage.getItem(cacheKey);

		if (cached) {
			try {
				const { data, timestamp } = JSON.parse(cached);
				// 15 minutes cache expiry
				if (Date.now() - timestamp < 15 * 60 * 1000) {
					// console.log('Serving from cache:', cacheKey);
					return data;
				}
			} catch (e) {
				// failed to parse, ignore
			}
		}

		console.log('Fetching fresh data:', cacheKey);
		const response = await axios.get(BASE_URL, { params });

		// Save to cache
		localStorage.setItem(
			cacheKey,
			JSON.stringify({
				data: response.data,
				timestamp: Date.now(),
			})
		);

		return response.data;
	},

	async searchLocation(query: string) {
		const response = await axios.get(GEO_URL, {
			params: {
				name: query,
				count: 5,
				language: 'en',
				format: 'json',
			},
		});
		return response.data.results || [];
	},
};
