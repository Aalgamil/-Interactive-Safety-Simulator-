const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/leaderboard',
  method: 'GET'
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
  });
});

req.on('error', (err) => {
  // Error handling removed for production
});

req.end();