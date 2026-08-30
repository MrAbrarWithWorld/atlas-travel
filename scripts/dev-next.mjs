import { spawn } from 'node:child_process';
import path from 'node:path';

const incoming = process.argv.slice(2);
const forwarded = [];
let hostname = '0.0.0.0';
let port = '3000';

for (let index = 0; index < incoming.length; index += 1) {
  const argument = incoming[index];
  if (argument === '--host' || argument === '--hostname') {
    hostname = incoming[index + 1] || hostname;
    index += 1;
  } else if (argument === '--port' || argument === '-p') {
    port = incoming[index + 1] || port;
    index += 1;
  } else if (argument !== '--strictPort') {
    forwarded.push(argument);
  }
}

const nextBinary = path.join(
  process.cwd(),
  'node_modules',
  'next',
  'dist',
  'bin',
  'next'
);

const child = spawn(
  process.execPath,
  [nextBinary, 'dev', '--hostname', hostname, '--port', port, ...forwarded],
  { stdio: 'inherit' }
);

child.on('exit', (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  else process.exit(code ?? 0);
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => child.kill(signal));
}
