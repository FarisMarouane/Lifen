const express = require('express');
const { $watcher } = require('./src/watch');

const app = express();

app.get('/api/event-stream', (req, res) => {
  // SSE Setup
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'Access-Control-Allow-Origin': '*',
  });
  $watcher.subscribe(file => {
    res.write(`event: file\n`);
    res.write(`data: ${file}\n\n`);
  });
});

app.get('/api/hello', (req, res) => {
  res.send({
    message: 'Hello there',
  });
});

app.listen(5000);
