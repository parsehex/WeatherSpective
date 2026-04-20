import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(() => {
	const isGitHubActions = process.env.GITHUB_ACTIONS === 'true';
	const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? '';
	const base = isGitHubActions && repoName ? `/${repoName}/` : '/';

	return {
		base,
		plugins: [
			vue(),
			tailwindcss(),
		],
		resolve: {
			alias: {
				'@': path.resolve(__dirname, './src'),
			},
		},
	};
});
