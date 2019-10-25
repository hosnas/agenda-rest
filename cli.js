#!/usr/bin/env node

const program = require('commander');

program
  .option('-d, --dbname <dbname>', '[optional] Name of the Mongo database')
  .option('-h, --dbhost <dbhost>', '[optional] Mongo instance\'s IP')
  .option('-k, --key <key>', '[optional] apikey')
  .option('-p, --port <port>', '[optional] Server port, default 4040', (n, d) => Number(n) || d, 4040)
  .option('-t, --timeout <timeout>', '[optional] Timeout for request duration', (n, d) => Number(n) || d, 5000)
  .parse(process.argv);

const settings = require('./settings');
settings.dbname = program.dbname || settings.dbname;
settings.dbhost = program.dbhost || settings.dbhost;
settings.timeout = program.timeout || settings.timeout;
settings.appId = program.key || settings.appId;

const {app, agenda} = require('./dist');

const server = app.listen(program.port, () => {
  console.log(`App listening on port ${program.port}.`);
});

async function graceful() {
  console.log('\nClosing server...');
  await server.close();
  console.log('Shutting down gracefully...');
  await agenda.stop();
  process.exit(0);
}

process.on('SIGTERM', graceful);
process.on('SIGINT', graceful);
