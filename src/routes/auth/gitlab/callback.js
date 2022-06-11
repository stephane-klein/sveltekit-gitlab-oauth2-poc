import _url from 'node:url';

export async function get({ url }) {
    const prepareURL = new _url.URL(_url.resolve(process.env.GITLAB_BASEURL, 'oauth/token'));
    prepareURL.search = new _url.URLSearchParams({
        client_id: process.env.GITLAB_CLIENT_ID,
        client_secret: process.env.GITLAB_CLIENT_SECRET,
        code: url.searchParams.get('code'),
        grant_type: 'authorization_code',
        redirect_uri: 'http://127.0.0.1:3000/auth/gitlab/callback'
    }).toString();

    const res = await fetch(
        prepareURL.toString(),
        {
            method: 'POST'
        }
    );
    if (res.status == 200) {
        console.log(await res.json());
    }
};
