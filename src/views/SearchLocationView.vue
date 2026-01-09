<script setup lang="ts">
import LocationManager from '@/components/LocationManager.vue'
</script>
<template>
	<div class="container max-w-lg mx-auto p-4 space-y-6">
		<header class="py-4">
			<h1 class="text-2xl font-bold">Add Location</h1>
			<p class="text-muted-foreground">Search and select a location to add.</p>
		</header>
		<LocationManager />
	</div>
</template>
