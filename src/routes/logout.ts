export async function get({ url }) {
    return {
        status: 302,
        headers: {
            'Set-Cookie': `myapp=; Path=/; HttpOnly; SameSite=None; expires=Thu, 01 Jan 1970 00:00:00 GMT`,
            location: '/'
        }
    }
};
