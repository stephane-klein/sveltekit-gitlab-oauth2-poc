import _url from 'node:url';
import cookie from 'cookie';

export async function getSession(event) {
	const { headers } = event.request;
    const cookies = cookie.parse(headers.get('cookie') || '');
    if (cookies.myapp !== undefined) {
        const res = await fetch(
            _url.resolve(process.env.GITLAB_BASEURL, 'api/v4/user'),
            {
                headers: {
                    'Authorization': `Bearer ${cookies.myapp}`
                }
            }
        );
        const userData = (await res.json());
        return {
            username: userData.username,
            name: userData.name
        }
    }
    return {
    }
}
