import cookie from 'cookie';
import { sequence } from '@sveltejs/kit/hooks';
import {
	ConfigurePassportOAuth2,
	OAuthHandleInput,
	OAuthCreateCookie,
	DefaultCookieName
} from 'sveltekit-passport-oauth2';
import GitlabStrategy from "passport-gitlab2";

ConfigurePassportOAuth2([
	{
		strategy: new GitlabStrategy(
			{
				callbackURL: 'http://127.0.0.1:3000/auth/gitlab/callback.json',
				clientID: process.env.GITLAB_CLIENT_ID,
				clientSecret: process.env.GITLAB_CLIENT_SECRET,
				// passReqToCallback: true,
                baseURL: process.env.GITLAB_BASEURL
			},
			OAuthCreateCookie(/*cookieName = DefaultCookieName, cookieSettings?: CookieSettings*/)
		)
	}
]);
export const handle = sequence(addUserToRequest);

//add the user info to request (you can access this info in and endpoint using `request.locals`)
async function addUserToRequest({ event, resolve }: OAuthHandleInput) {
	const cookies = cookie.parse(event.request.headers.cookie || '');
	const cookieId = cookies[DefaultCookieName];
	if (cookieId) {
		// event.request.locals = Database[cookieId]; //change this to retrieve from database
	}
	const response = await resolve(event);
	return response;
}

//this will expose user info in session and can be retrieved in the front end using $session
export function getSession(request: ServerRequest<Locals>): Locals {
	return request.locals;
}
