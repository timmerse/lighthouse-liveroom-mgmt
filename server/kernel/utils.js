
// Parse the query and body from koa.
function parseKoaRequest(ctx) {
  return parseRequestParams({
    queryString: ctx.request.query,
    body: ctx.request.body,
  });
}

// Parse object from event.queryString and event.body as JSON.
function parseRequestParams(event) {
  event = event || {};

  // Fill by body first.
  let q = {};
  if (event.body) {
    if (typeof (event.body) === 'object') {
      q = event.body;
    } else {
      q = JSON.parse(event.body);
    }
  }

  // Fill by query string.
  Object.keys(event.queryString || {}).map((k) => {
    q[k] = event.queryString[k];
  });

  return q;
}

module.exports = {
  parseKoaRequest
}
