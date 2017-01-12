var express = require('express');
var app = express();

var pug = require('pug');


var gridWithSocket = require('./gridWithSocket')(app);
var grid = gridWithSocket.grid;
var io = gridWithSocket.io;

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/bower_components'));
app.set('view engine', 'pug');





var enemies = [];
var velocity = 1;
var enemy;
for(var i = 0; i < 10; i++){
    enemy = grid.createItem(Math.random() * 1200, Math.random() * 700);
    enemy.velocityX = Math.round(Math.random() * 3);
    enemy.velocityY = Math.round(Math.random() * 3);
    enemies.push(enemy);
}

io.on('connection', function (socket) {

    gridWithSocket.init(socket);

    setInterval(function () {
        for(var i = 0; i < enemies.length; i++){
            enemies[i].x += enemy.velocityX;
            enemies[i].y += enemy.velocityY;

            if(enemies[i].x < 0 || enemies[i].x > grid.w)
                enemies[i].velocityX *= -1;
            if(enemies[i].y < 0 || enemies[i].y > grid.h)
                enemy.velocityY *= -1;

            enemies[i].update();
        }
    }, 1000 / 20);
});











app.get('/main-view', function (req, res) {
    res.render('screens/main');
});
app.get('/game-view', function (req, res) {
    res.render('screens/game');
});

app.get('/character-select-view', function (req, res) {
    res.render('screens/charselect');
});


app.use(function (req, res, next) {
    res.render('index');
});
