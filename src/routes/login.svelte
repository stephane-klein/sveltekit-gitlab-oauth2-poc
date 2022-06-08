<script context="module">
    import url from 'node:url';
    import { OAuth2 } from 'oauth';
    console.log(OAuth2);
    export const hydrate = false;
    export async function load({ params, fetch, session, stuff }) {
        console.log('loading');

        const oauth2 = new OAuth2(
            process.env.GITLAB_CLIENT_ID, // clientId
            process.env.GITLAB_CLIENT_SECRET, // clientSecret
            '', // baseSite
            url.resolve(process.env.GITLAB_BASEURL, 'oauth/authorize'), // authorizePath
            url.resolve(process.env.GITLAB_BASEURL, 'oauth/token'), // accessTokenPath
            null // customHeaders
        );

        oauth2.getOAuthAccessToken(
            200, // code
            { // params
                'grant_type': 'authorization_code',
                'redirect_uri': 'http://127.0.0.1:3000/auth/gitlab/callback'
            },
            (err, access_token, refresh_token, results) => { // callbacks
                console.log('getOAuthAccessToken callback');
                console.log('err', err);
                console.log('access_token', access_token);
                console.log('refresh_token', refresh_token);
                console.log('results', results);
            }
        );

        return {
            status: 200
        }
    };
</script>
