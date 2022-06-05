import url from 'node:url';
import adapter from '@sveltejs/adapter-node';
import preprocess from 'svelte-preprocess';
import session from 'express-session';

const myPlugin = {
  name: 'middleware',
  configureServer(server) {
    server.middlewares.use(session);
  }
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		adapter: adapter(),
        trailingSlash: 'always',
        vite: {
            plugins: [myPlugin]
        }
	}
};

export default config;
