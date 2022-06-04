import url from 'node:url';
import express from 'express';
import session from 'express-session';
import PassportOAuth2Middleware from './middleware.js';

const app = express();
const port = 3000;

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}));


app.use(
    '/',
    PassportOAuth2Middleware({
        // configuration inspired from https://github.com/fh1ch/passport-gitlab2/blob/4238b67438c1f1a7050908556ac010bc319b734a/lib/strategy.js
        clientID: process.env.GITLAB_CLIENT_ID,
        clientSecret: process.env.GITLAB_CLIENT_SECRET,
        authorizationURL: url.resolve(process.env.GITLAB_BASEURL, 'oauth/authorize'),
        tokenURL: url.resolve(process.env.GITLAB_BASEURL, 'oauth/token'),
        scope: "api email profile",
        scopeSeparator: " ",
        callbackURL: 'http://127.0.0.1:3000/auth/gitlab/callback'
    })
);

app.get('/', (req, res) => {
    if (req.session?.passport?.user?.id) {
        res.send(`<ul>
            <li>id: ${req.session.passport.user.id}</li>
            <li>username: ${req.session.passport.user.username}</li>
            <li>accessToken: ${req.session.passport.user.accessToken}</li>
        </ul>

        <a href="/logout">Logout</a>
        `)
    } else {
        res.send('<a href="/auth/gitlab/">login</a>')
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy(function(err) {
        res.redirect('/');
    });
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
