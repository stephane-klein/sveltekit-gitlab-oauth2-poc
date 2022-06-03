import url from 'node:url';
import express from 'express';
import passport from 'passport';
import OAuth2Strategy from 'passport-oauth2';
import { InternalOAuthError } from 'passport-oauth2';
import session from 'express-session';

const app = express();
const port = 3000;

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}));

passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
        cb(null, { id: user.id, username: user.username, accessToken: user.accessToken });
    });
});

passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
        return cb(null, user);
    });
});

const gitlabOAuth2Strategy = new OAuth2Strategy(
    {
        // configuration inspired from https://github.com/fh1ch/passport-gitlab2/blob/4238b67438c1f1a7050908556ac010bc319b734a/lib/strategy.js
        clientID: process.env.GITLAB_CLIENT_ID,
        clientSecret: process.env.GITLAB_CLIENT_SECRET,
        authorizationURL: url.resolve(process.env.GITLAB_BASEURL, 'oauth/authorize'),
        tokenURL: url.resolve(process.env.GITLAB_BASEURL, 'oauth/token'),
        scope: "api email profile",
        scopeSeparator: " ",
        callbackURL: 'http://127.0.0.1:3000/auth/gitlab/callback'
    },
    function(accessToken, refreshToken, profile, cb) {
        return cb(
            null,
            {
                id: profile.id,
                username: profile.username,
                accessToken: accessToken
            }
        );
    }
);

gitlabOAuth2Strategy.userProfile = function (accesstoken, done) {
    this._oauth2.get(
        url.resolve(process.env.GITLAB_BASEURL, 'api/v4/user'),
        accesstoken,
        (err, body) => {
            let json;
            if (err) {
                return done(new InternalOAuthError('Failed to fetch user profile', err));
            }

            try {
                json = JSON.parse(body);
            } catch (ex) {
                return done(new Error('Failed to parse user profile'));
            }

            const profile = {
                id: String(json.id),
                username: json.username,
                displayName: json.name,
                emails: [{value: json.email}],
                avatarUrl: json.avatar_url,
                profileUrl: json.web_url
            };

            done(null, profile);
        }
    );
};

passport.use(gitlabOAuth2Strategy);

app.get('/', (req, res) => {
    if (req.session?.passport?.user?.id) {
        res.send(`<ul>
            <li>id: ${req.session.passport.user.id}</li>
            <li>username: ${req.session.passport.user.username}</li>
            <li>accessToken: ${req.session.passport.user.accessToken}</li>
        </ul>`)
    } else {
        res.send('<a href="/auth/gitlab/">login</a>')
    }
})

app.get(
    '/auth/gitlab',
    passport.authenticate(
        'oauth2'
    )
);

app.get(
    '/auth/gitlab/callback',
    passport.authenticate('oauth2', {
        failureRedirect: '/login'
    }),
    function(req, res) {
        // Successful authentication, redirect home.
        console.log('Successful authentication, redirect home');
        res.redirect('/');
    }
);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
