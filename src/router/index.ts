import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import { isLocationLocked } from '@/lib/runtimeConfig';

const isProjectBase = import.meta.env.BASE_URL !== '/';

const router = createRouter({
	history: isProjectBase
		? createWebHashHistory(import.meta.env.BASE_URL)
		: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'home',
			component: HomeView,
		},
		{
			path: '/add-location',
			name: 'add-location',
			component: () => import('@/views/SearchLocationView.vue'),
		},
	],
});

router.beforeEach((to) => {
	if (isLocationLocked && to.name === 'add-location') {
		return { name: 'home' };
	}

	return true;
});

export default router;
