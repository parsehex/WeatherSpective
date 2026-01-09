import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';

export interface WeatherRating {
	id: string; // UUID
	timestamp: number;
	locationId: number;
	weatherCode: number;
	temperature: number;
	isDay: number;
	rating: 'up' | 'down';
}

export const useHistoryStore = defineStore('history', () => {
	const ratings = useStorage<WeatherRating[]>('weather-ratings', []);

	function addRating(rating: Omit<WeatherRating, 'id' | 'timestamp'>) {
		const newRating: WeatherRating = {
			...rating,
			id: crypto.randomUUID(),
			timestamp: Date.now(),
		};
		ratings.value.push(newRating);
		console.log('Rated:', newRating); // Debug log
	}

	return {
		ratings,
		addRating,
	};
});
