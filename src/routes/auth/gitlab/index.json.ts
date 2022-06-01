//first parameter is the strategy name
//second paramater are passport options (usually you'll only use the "scope" property)
import { loginMethod } from 'sveltekit-passport-oauth2';

export const get = loginMethod('gitlab', { scope: ['email', 'profile'] });
