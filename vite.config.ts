import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');
	const isGitHubActions = process.env.GITHUB_ACTIONS === 'true';
	const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? '';
	const base = isGitHubActions && repoName ? `/${repoName}/` : '/';
	const isPwaEnabled = env.VITE_ENABLE_PWA === 'true';

	return {
		base,
		plugins: [
			vue(),
			tailwindcss(),
			...(isPwaEnabled
				? [
						VitePWA({
							registerType: 'autoUpdate',
							includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
							manifest: {
								name: 'WeatherSpective',
								short_name: 'WeatherSpective',
								description: 'A weather app that learns your preferences',
								start_url: '.',
								scope: '.',
								theme_color: '#ffffff',
								icons: [
									{
										src: 'pwa-192x192.png',
										sizes: '192x192',
										type: 'image/png',
									},
									{
										src: 'pwa-512x512.png',
										sizes: '512x512',
										type: 'image/png',
									},
								],
							},
						}),
				  ]
				: []),
		],
		resolve: {
			alias: {
				'@': path.resolve(__dirname, './src'),
			},
		},
	};
});
