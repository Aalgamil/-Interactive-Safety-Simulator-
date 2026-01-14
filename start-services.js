const { spawn } = require('child_process');
const path = require('path');

// Function to start a process and log its output
function startProcess(command, args, name) {
  const process = spawn(command, args, {
    stdio: 'inherit',
    shell: true
  });

  process.on('error', (error) => {
  });

  process.on('close', (code) => {
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
    backend.kill();
    frontend.kill();
    process.exit();
  });
}, 3000);
