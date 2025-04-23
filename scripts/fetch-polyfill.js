// Polyfill for fetch API in Node.js
// This is necessary for packages like @gfx/zopfli and @squoosh/lib that use fetch in Node.js
const nodeFetch = require('node-fetch');

// Only polyfill if fetch is not available
if (!global.fetch) {
  global.fetch = nodeFetch;
  global.Headers = nodeFetch.Headers;
  global.Request = nodeFetch.Request;
  global.Response = nodeFetch.Response;

  console.log('[Fetch Polyfill] Added fetch to global scope');
}
