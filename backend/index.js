// connect library
const express = require('express');
const https = require('https');
const fs = require('fs')
const path = require('path');


// app and default port 
const app = express();
const PORT = 3001;
// dummy (feature replace to DB)


// for reading JSON from req.body
app.use(express.json());

// reading certs
const httpsOptions = {
  key: fs.readFileSync(path.join(__dirname, 'certs', 'key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'certs', 'cert.pem')),
};

app.get('/', (req, res) => {
    res.send("Hi, server working via HTTPS")
});

app.get('/app/ping', (req, res) =>{
    res.json({
        status: 'ok',
        message: 'it\'s work'
    });
});

app.post('/api/echo', (req, res) => {
  const { username, password } = req.body;
  
  res.json({
    received: {
      username,
      password
    }
  })
});

https.createServer(httpsOptions, app).listen(PORT, () => {
  console.log(`HTTPS server is running, connect to https://localhost:${PORT}`);
});