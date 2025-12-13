// подключаем библиотеки
const express = require('express');
const https = require('https');
const fs = require('fs')
const path = require('path');


// создаем приложение и задаем порт по умолчанию
const app = express();
const PORT = 3001;
// временное хранилище пользователей (потом заменим на БД)
const users = [];

// включаем поддержку JSON в теле запросов (req.body)
app.use(express.json());

// раздаем статические файлы (минимальный фронтенд)
app.use('/static', express.static(path.join(__dirname, 'public')));

// читаем SSL-сертификаты
const httpsOptions = {
  key: fs.readFileSync(path.join(__dirname, 'certs', 'key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'certs', 'cert.pem')),
};

app.get('/', (req, res) => {
    res.send("Hi, server working via HTTPS")
});

app.get('/ui', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
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

app.post('/api/auth/register', (req, res) => {
  const { login, password } = req.body;

  if (!login || !password) {
    return res.status(400).json({ message: 'login and password required' });
  }

  const check = users.find(u => u.login === login);
  if (check) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const newUser = {
    id: users.length + 1,
    login,
    password,
  };

  users.push(newUser);

  res.status(201).json({
    id: newUser.id,
    login: newUser.login,
  });
});

app.post('/api/auth/login', (req, res) => {

  const {login, password} = req.body;

  if(!login || !password){
    return res.status(400).json({message: "login and password required"});
  }

  // ищем пользователя по логину
  const user = users.find(u => u.login === login);
  if(!user){
    return res.status(400).json({ message: 'User not found' });
  }

  // проверяем пароль
  if(user.password !== password){
    return res.status(400).json({message: 'Wrong in login or password'});
  }

  //успешный вход
  res.json({
    id: user.id,
    login: user.login
  });


});

https.createServer(httpsOptions, app).listen(PORT, () => {
  console.log(`HTTPS server is running, connect to https://localhost:${PORT}`);
});
