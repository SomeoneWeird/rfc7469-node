# rfc7469-node
Express middleware for HTTPS public key pinning (RFC 7469)

# Example

```js

var rfc7469 = require('rfc7469');

var app = express();

app.use(rfc7469({
  includeSubdomains: true,
  maxAge: Date.now() + 604800000,
  reportURI: "http://mydomain.com/report",
  pins: [
    "E9CZ9INDbd+2eRQozYqqbQ2yXLVKB9+xcprMF+44U1g=",
    "LPJNul+wow4m6DsqxbninhsWHlwfp0JecwQzYpOLmCQ="
  ]
}));

... etc

```

# Usage

## rfc7469(options)

Returns a function which can be used as middleware for express.

### Options

| Name              | Type             | Required | Example                       | Default          | Description                                            |
|-------------------|------------------|----------|-------------------------------|------------------|--------------------------------------------------------|
| maxAge            | number           | ✓        | 123456                        | N/A              | Maximum time the browser will cache this header.       |
| pins              | array of strings |          |                               | [ "one", "two" ] | SHA256 fingerprint of certificate subject              |
| includeSubdomains | boolean          |          | true                          | N/A              | Should the browser use this header for subdomains too. |
| reportURI         | string           |          | "http://mywebsite.com/report" | N/A              | URL the browser will send reports to.                  |

## reportOnly()

Makes the middleware only set the `Public-Key-Pins-Report-Only` header instead of enforcing it.

# Considerations

It is up to the user that this middleware is only set on connections that are served over HTTPS.