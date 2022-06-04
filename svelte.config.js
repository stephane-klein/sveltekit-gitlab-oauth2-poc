import adapter from '@sveltejs/adapter-node';
import preprocess from 'svelte-preprocess';

const myPlugin = {
  name: 'log-request-middleware',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      console.log(`Got request ${req.url}`);
      next();
    });
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
