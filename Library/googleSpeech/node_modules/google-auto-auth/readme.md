# google-auto-auth
> Making it as easy as possible to authenticate a Google API request

```sh
$ npm install --save google-auto-auth
```
```js
var googleAuth = require('google-auto-auth');

// Create a client
var auth = googleAuth();

auth.authorizeRequest({
  method: 'get',
  uri: 'https://www.googleapis.com/something'
}, function (err, authorizedReqOpts) {
/*
  authorizedReqOpts = {
    method: 'get',
    uri: 'https://www.googleapis.com/something',
    headers: {
      Authorization: 'Bearer {{token}}'
    }
  }
*/
});
```

Or, just get an access token.
```js
auth.getToken(function (err, token) {
/*
  token = 'access token'
*/
});
```

<a name="automatic-if"></a>
This works automatically **if**:

  - your app runs on Google Compute Engine
  - you are authenticated with the `gcloud` sdk
  - you have the path to a JSON key file as an environment variable named `GOOGLE_APPLICATION_CREDENTIALS`

If you do not meet those, you must provide a keyFile or credentials object.

```js
var googleAuth = require('google-auto-auth');

var authConfig = {};

// path to a key:
authConfig.keyFilename = '/path/to/keyfile.json';

// or a credentials object:
authConfig.credentials = {
  client_email: '...',
  private_key: '...'
};

// Create a client
var auth = googleAuth(authConfig);

auth.authorizeRequest({/*...*/}, function (err, authorizedReqOpts) {});
auth.getToken(function (err, token) {});
```

### API

#### googleAuth = require('google-auto-auth')

#### auth = googleAuth([authConfig])

##### authConfig

- Type: `Object`

See the above section on Authentication. This object is necessary if automatic authentication is not available in your environment.

Everything from the [gcloud-node Authentication Guide](https://googlecloudplatform.github.io/gcloud-node/#/authentication) applies here.

At a glance, the supported properties for this method are:

- `keyFilename` - Path to a .json, .pem, or .p12 key file
- `credentials` - Object containing `client_email` and `private_key` properties
- `scopes` - Required scopes for the desired API request

For more details, see the Authentication Guide linked above, under "The config object".

#### auth.authorizeRequest(reqOpts, callback)

Extend an HTTP request object with an authorized header.

##### callback(err, authorizedReqOpts)

###### callback.err

- Type: `Error`

An API error or an error if scopes are required for the request you're trying to make (check for err.code = `MISSING_SCOPE`). If you receive the missing scope error, provide the `authConfig.scopes` array with the necessary scope URLs for your request. There are examples of scopes that are required for some of the Google Cloud Platform services in the [gcloud-node Authentication Guide](https://googlecloudplatform.github.io/gcloud-node/#/authentication).

###### callback.authorizedReqOpts

- Type: `Object`

The reqOpts object provided has been extended with a valid access token attached to the `headers.Authorization` value. E.g.: `headers.Authorization = 'Bearer y.2343...'`.

#### auth.getAuthClient(callback)

Get the auth client instance from [google-auth-library](http://gitnpm.com/googleauth).

##### callback(err, authClient)

###### callback.err

- Type: `Error`

An error that occurred while trying to get an authorization client.

###### callback.authClient

- Type: [`google-auth-library`](http://gitnpm.com/googleauth)

The client instance from [google-auth-library](http://gitnpm.com/googleauth). This is the underlying object this library uses.


#### auth.getCredentials(callback)

Get the `client_email` and `private_key` properties from an authorized client.

##### callback(err, credentials)

###### callback.err

- Type: `Error`

An error that occurred while trying to get an authorization client.

###### callback.credentials

- Type: `Object`

An object containing `client_email` and `private_key`.


#### auth.getToken(callback)

Get an access token. The token will always be current. If necessary, background refreshes are handled automatically.

##### callback(err, token)

###### callback.err

- Type: `Error`

An API error or an error if scopes are required for the request you're trying to make (check for err.code = `MISSING_SCOPE`). If you receive the missing scope error, provide the `authConfig.scopes` array with the necessary scope URLs for your request. There are examples of scopes that are required for some of the Google Cloud Platform services in the [gcloud-node Authentication Guide](https://googlecloudplatform.github.io/gcloud-node/#/authentication).

###### callback.token

- Type: `String`

A current access token to be used during an API request.
