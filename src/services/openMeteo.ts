import axios from 'axios';

export interface WeatherData {
	temperature: number;
	weatherCode: number;
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
				'temperature_2m,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m,is_day',
			daily:
				'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
			timezone: 'auto',
		};

		if (units?.temperature) params.temperature_unit = units.temperature;
		if (units?.windSpeed) params.wind_speed_unit = units.windSpeed;
		if (units?.precipitation) params.precipitation_unit = units.precipitation;

		const response = await axios.get(BASE_URL, { params });
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
