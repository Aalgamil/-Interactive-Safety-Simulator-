const { spawn } = require('child_process');
const path = require('path');

// Function to start a process and log its output
function startProcess(command, args, name) {
  console.log(`Starting ${name}...`);

  const process = spawn(command, args, {
    stdio: 'inherit',
    shell: true
  });

  process.on('error', (error) => {
    console.error(`${name} error:`, error);
  });

  process.on('close', (code) => {
    console.log(`${name} exited with code ${code}`);
  });

  return process;
}

// Start the backend server first
const backend = startProcess('node', ['server.js'], 'Backend Server');

// Wait a bit for the backend to start, then start the frontend
setTimeout(() => {
  const frontend = startProcess('npm', ['run', 'dev'], 'Frontend Dev Server');

  // Handle process termination
  process.on('SIGINT', () => {
    console.log('Shutting down services...');
    backend.kill();
    frontend.kill();
    process.exit();
  });
}, 3000);
