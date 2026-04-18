import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';
import type { LocationData } from '@/services/openMeteo';
import { isLocationLocked, lockedLocation } from '@/lib/runtimeConfig';

export const useLocationStore = defineStore('location', () => {
	const currentLocation = useStorage<LocationData | null>(
		'ws-current-location',
		lockedLocation,
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
		lockedLocation ? [lockedLocation] : [],
		localStorage,
		{
			serializer: {
				read: (v) => JSON.parse(v),
				write: (v) => JSON.stringify(v),
			},
		}
	);

	if (isLocationLocked && lockedLocation) {
		currentLocation.value = lockedLocation;
		savedLocations.value = [lockedLocation];
	}

	function setCurrentLocation(location: LocationData) {
		if (isLocationLocked) return;
		currentLocation.value = location;
	}

	function addLocation(location: LocationData) {
		if (isLocationLocked) return;
		if (!savedLocations.value.find((l) => l.id === location.id)) {
			savedLocations.value.push(location);
		}
	}

	function removeLocation(id: number) {
		if (isLocationLocked) return;
		savedLocations.value = savedLocations.value.filter((l) => l.id !== id);
	}

	return {
		currentLocation,
		savedLocations,
		isLocationLocked,
		setCurrentLocation,
		addLocation,
		removeLocation,
	};
});
