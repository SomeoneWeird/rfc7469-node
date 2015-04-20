
function pin(options = {}) {

  if(!options.maxAge) {
    throw new Error("RFC7469 requires a maxAge option.");
  }

  if(typeof options.maxAge !== 'number') {
    throw new Error("maxAge must be a valid number.");
  }

  let headerName = "Public-Key-Pins";
  let value      = generateHeaderValue(options);

  let middleware = function(req, res, next) {
    res.set(headerName, value);
    return next();
  }

  middleware.reportOnly = function() {
    headerName = "Public-Key-Pins-Report-Only";
    return middleware;
  }

  return middleware;

}

function generateHeaderValue(options) {

  let {
    maxAge,
    includeSubdomains,
    reportURI,
    pins = []
  } = options;

  pins = pins.map(pin => `pin-sha256="${pin}";`);

  let header = [ `max-age=${maxAge};`, ...pins ];

  if(reportURI) {
    header.push(`report-uri="${reportURI}";`);
  }

  if(includeSubdomains) {
    header.push("includeSubDomains");
  }

  return header.join("");

}

pin.generate = generateHeaderValue;

export default pin;
