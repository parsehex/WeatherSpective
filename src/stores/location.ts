import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';
import type { LocationData } from '@/services/openMeteo';

export const useLocationStore = defineStore('location', () => {
	const currentLocation = useStorage<LocationData | null>(
		'ws-current-location',
		null,
		localStorage,
		{
			serializer: {
				read: (v) => JSON.parse(v),
				write: (v) => JSON.stringify(v),
			},
		}
	);
	const savedLocations = useStorage<LocationData[]>(
		'ws-saved-locations',
		[],
		localStorage,
		{
			serializer: {
				read: (v) => JSON.parse(v),
				write: (v) => JSON.stringify(v),
			},
		}
	);

	function setCurrentLocation(location: LocationData) {
		currentLocation.value = location;
	}

	function addLocation(location: LocationData) {
		if (!savedLocations.value.find((l) => l.id === location.id)) {
			savedLocations.value.push(location);
		}
	}

	function removeLocation(id: number) {
		savedLocations.value = savedLocations.value.filter((l) => l.id !== id);
	}

	return {
		currentLocation,
		savedLocations,
		setCurrentLocation,
		addLocation,
		removeLocation,
	};
});
