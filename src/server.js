import express from 'express';
import passport from 'passport';
import GitLabStrategy from 'passport-gitlab2';

const app = express()
const port = 3000

passport.use(
    new GitLabStrategy(
        {
            clientID: process.env.GITLAB_CLIENT_ID,
            clientSecret: process.env.GITLAB_CLIENT_SECRET,
            callbackURL: 'http://127.0.0.1:3000/auth/gitlab/callback',
            baseURL: process.env.GITLAB_BASEURL
        },
        function(accessToken, refreshToken, profile, cb) {
            console.log('profile.id');
            console.log(profile.id);
            console.log(profile);
            return cb();
        }
    )
);

app.get('/', (req, res) => {
    res.send('Hello World!')
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
        res.redirect('/');
    }
);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
