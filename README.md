# SvelteKit GitLab Oauth2 POC

See [this issue](https://github.com/stephane-klein/poc-svelte-oauth-passport-gitlab/issues/1) to discover the journey of
this Proof Of Concept.

* Based on [SvelteKit](https://kit.svelte.dev/)
* Based on [Authorization code flow](https://docs.gitlab.com/ee/api/oauth2.html#authorization-code-flow)
* Cookie stored with [HttpOnly method](https://en.wikipedia.org/wiki/HTTP_cookie#Secure_and_HttpOnly)
* **Didn't use** this library:
  * https://github.com/Dan6erbond/sk-auth
  * https://github.com/fabiohvp/sveltekit-passport-oauth2
  * https://github.com/fh1ch/passport-gitlab2
  * https://github.com/jaredhanson/passport-oauth2
  * https://github.com/ciaranj/node-oauth
  * https://github.com/simov/grant

## Getting started

```
$ cp .envrc.example .envrc
```

Fill `.envrc` file with your GitLab application parameters

Install packages:

```
$ pnpm install
```

Launch application:

```
$ pnpm run dev
```

Open your browser on http://127.0.0.1:3000

