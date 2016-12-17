var scanner = require('..');

scanner(function(err, service) {
  if (err) return console.log(err.message);
  console.log('MDNS: chromecast "%s" running on: %s', service.name, service.data);
});
