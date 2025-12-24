const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/leaderboard',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log(`statusCode: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Leaderboard data from API:', data);
  });
});

req.on('error', (err) => {
  console.error('Error:', err);
});

req.end();