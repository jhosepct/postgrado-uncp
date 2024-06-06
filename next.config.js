const withTM = require('next-transpile-modules')(['@mui/x-date-pickers']);

module.exports = withTM({
  reactStrictMode: true,
});