import express from 'express';
import passport from 'passport';
import GitLabStrategy from 'passport-gitlab2';

const app = express()
const port = 3000

passport.use(new GitLabStrategy({
    clientID: process.env.GITLAB_CLIENT_ID,
    clientSecret: process.env.GITLAB_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/gitlab/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({gitlabId: profile.id}, function (err, user) {
      return cb(err, user);
    });
  }
));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
