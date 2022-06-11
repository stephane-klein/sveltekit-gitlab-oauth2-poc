import url from 'node:url';

export async function get({ params }) {
    const prepareURL = new url.URL(url.resolve(process.env.GITLAB_BASEURL, 'oauth/authorize'));
    prepareURL.search = new url.URLSearchParams({
        client_id: process.env.GITLAB_CLIENT_ID,
        redirect_uri: 'http://127.0.0.1:3000/auth/gitlab/callback',
        response_type: 'code',
        state: '12345',
        scope: 'api email profile'
    }).toString();

    return {
        status: 302,
        headers: {
            location: prepareURL.toString()
        }
    }
};
