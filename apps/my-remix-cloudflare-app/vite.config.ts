import {
	vitePlugin as remix,
	cloudflareDevProxyVitePlugin as remixCloudflareDevProxy,
} from '@remix-run/dev';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { getLoadContext } from './load-context';
import path from 'path';

export default defineConfig(({ mode }) => ({
	plugins: [
		remixCloudflareDevProxy({ getLoadContext }),
		remix(),
		tsconfigPaths(),
	],
	resolve: {
		alias: {
			...(mode === 'development' && {
				postgres: path.resolve(
					__dirname,
					'../../libs/db/node_modules/postgres/src/index.js',
				),
			}),
		},
	},
}));
