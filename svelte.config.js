import url from 'node:url';
import adapter from '@sveltejs/adapter-node';
import preprocess from 'svelte-preprocess';
import session from 'express-session';
import PassportOAuth2Middleware from './src/middlewares/oauth2.js';

const myPlugin = {
  name: 'oauth2-middleware',
  configureServer(server) {
    server.middlewares.use(session);

    server.middlewares.use(PassportOAuth2Middleware({
        // configuration inspired from https://github.com/fh1ch/passport-gitlab2/blob/4238b67438c1f1a7050908556ac010bc319b734a/lib/strategy.js
        clientID: process.env.GITLAB_CLIENT_ID,
        clientSecret: process.env.GITLAB_CLIENT_SECRET,
        authorizationURL: url.resolve(process.env.GITLAB_BASEURL, 'oauth/authorize'),
        tokenURL: url.resolve(process.env.GITLAB_BASEURL, 'oauth/token'),
        scope: "api email profile",
        scopeSeparator: " ",
        callbackURL: 'http://127.0.0.1:3000/auth/gitlab/callback'
    }));
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
