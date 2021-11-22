//Подключаем библиотеки
const http = require('http');
const express = require('express');
const cors = require("cors");
const bodyParser = require('body-parser');
const nocache = require('nocache');
var fs = require('fs');

//Подключение к БД
const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('config.db');


//Создаем приложение на основе экспресс
const app = express();

//Приложение использует cors
app.use(nocache());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Add headers before the routes are defined
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'accept, X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});


//Принимаем на вход название конфигурационного файла, который должен отображаться на сайте
app.post('/jsonConfigFile', function (request, response) {
  
  if(!request.body) return response.sendStatus(400);
  let sql = 'INSERT INTO mainConfigFile(name) VALUES ("' + request.body.name+'")';
  db.run(sql, function(err) {
      if (err) {
        return console.error(err.message);
      }
    });
  response.send(request.body.name);

});

//Принимаем на вход название конфигурационного файла и его содержимое
app.post('/jsonData', function (request, response) {
  
  if(!request.body) return response.sendStatus(400);
  let sql = 'INSERT INTO jsonConfigFiles(name) VALUES ("' + request.body.name+'")';
  db.run(sql, function(err) {
      if (err) {
        return console.error(err.message);
      }
      console.log(`Rows inserted`);
    });
  fs.writeFile ("./json/"+request.body.name+".json", JSON.stringify(request.body.jsonData), function(err) {
      if (err) throw err;
      console.log('complete');
    }
  ); 
  response.send(`${request.body.name} - ${request.body.jsonData}`);

});

//Читаем данные из выбранного файла JSON и отдаем клиенту
app.get('/jsonData', function (request, response) {  
 
  var fs = require('fs');
  var obj;
  fs.readFile('./json/'+request.query.name+'.json', 'utf8', function (err, data) {
    if (err) throw err;
    obj = JSON.parse(data);
    response.send(obj);  
});
 
});

//Получаем название конфигурационного файла, который должен отображаться на сайте
app.get('/jsonFileName', function (request, response) {  
  
  let sql = 'SELECT * FROM mainConfigFile ORDER BY ROWID DESC LIMIT 1;';
  var jsonFileName;
  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    rows.forEach((row) => {
      jsonFileName =row.name;
      response.send(jsonFileName);  
    });
  });
 
});

//Получаем названия всех доступных конфигурационных файлов
app.get('/jsonConfigFile', function (request, response) {  
  
  let sql = 'SELECT DISTINCT * FROM jsonConfigFiles';
  var jsonConfigFileName = [];
  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    rows.forEach((row) => {
      jsonConfigFileName.push(row.name);
      
    });
    response.send(jsonConfigFileName);  
  }); 

});

//Приложение слушает 4000 порт
app.listen(4000);
console.log("Сервер на порту 4000: Запущен");