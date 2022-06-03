import express from 'express';
import passport from 'passport';
import GitLabStrategy from 'passport-gitlab2';
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

passport.use(
    new GitLabStrategy(
        {
            clientID: process.env.GITLAB_CLIENT_ID,
            clientSecret: process.env.GITLAB_CLIENT_SECRET,
            callbackURL: 'http://127.0.0.1:3000/auth/gitlab/callback',
            baseURL: process.env.GITLAB_BASEURL
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
    )
);

app.get('/', (req, res) => {
    console.log('req.session');
    console.log(req.session);
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
        'gitlab',
        {
            scope: ['api email profile'] // See https://github.com/fh1ch/passport-gitlab2/pull/17
        }
    )
);

app.get(
    '/auth/gitlab/callback',
    passport.authenticate('gitlab', {
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
