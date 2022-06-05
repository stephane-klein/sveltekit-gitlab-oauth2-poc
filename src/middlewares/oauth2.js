import url from 'node:url';
import passport from 'passport';
import OAuth2Strategy from 'passport-oauth2';
import { InternalOAuthError } from 'passport-oauth2';
import { Router } from 'express';

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

const PassportOAuth2Middleware = function (options) {
    const gitlabOAuth2Strategy = new OAuth2Strategy(
        {
            // configuration inspired from https://github.com/fh1ch/passport-gitlab2/blob/4238b67438c1f1a7050908556ac010bc319b734a/lib/strategy.js
            clientID: options.clientID,
            clientSecret: options.clientSecret,
            authorizationURL: options.authorizationURL,
            tokenURL: options.tokenURL,
            scope: options.scope,
            scopeSeparator: options.scopeSeparator,
            callbackURL: options.callbackURL
        },
        function(accessToken, refreshToken, profile, cb) {
            console.log('aa 1');
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
        console.log('aa 2');
        this._oauth2.get(
            url.resolve(process.env.GITLAB_BASEURL, 'api/v4/user'),
            accesstoken,
            (err, body) => {
                console.log('aa 3');
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
    const router = Router();

    router.get(
        '/auth/gitlab',
        (req, res, next) => {
            console.log('aa 4');
            passport.authenticate(
                'oauth2'
            )(req, res);
        }
    );

    router.get(
        '/auth/gitlab/callback',
        passport.authenticate('oauth2', {
            failureRedirect: '/login'
        }),
        (req, res, next) => {
            console.log('aa 5');
            console.log('Successful authentication, redirect home');
            res.redirect('/');
        }
    );
    return router;
}

export default PassportOAuth2Middleware;
