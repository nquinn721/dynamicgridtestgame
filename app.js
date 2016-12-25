var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var pug = require('pug');

var Grid = require('dynamicgrid');
var canvasWidth = 1200;
var canvasHeight = 700;
var grid = new Grid(canvasWidth, canvasHeight, {w : 100, h : 100});;

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/bower_components'));
app.set('view engine', 'pug');




var player = grid.createItem(50, 50);

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
    // Listen when items show up in segment
    grid.on('destroyed item', function (item) {
        console.log('destroyed');
        if(player.withinRange(item.x, item.y))
            socket.emit('destroy item', item.plain());
    });
    // Listen to item changing segment
    player.on('segment change', function () {
        socket.emit('items', player.getItemsInSurroundingSegments(true));
    });
    socket.emit('player', player.plain());
    socket.emit('items', player.getItemsInSurroundingSegments(true));

    socket.on('update player', function (obj) {
        player.update(obj.x, obj.y);
        // socket.emit('items', player.getOtherItemsInSegment('plain'));
    });
    player.listenToSegmentGroup(function (event, item) {

        if(item.id !== player.id){
            if(event === 'move item'){
                socket.emit('update item', item.plain());
            }else if(event === 'remove item'){
                socket.emit('destroy item', item.plain());
            }else if(event === 'add item'){
                socket.emit('create item', item.plain());
            }
        }else{
            // socket.emit('items', player.getItemsInSurroundingSegments(true));
        }

    });


    setInterval(function () {
        for(var i = 0; i < enemies.length; i++){
            enemies[i].x += enemy.velocityX;
            enemies[i].y += enemy.velocityY;

            if(enemies[i].x < 0 || enemies[i].x > canvasWidth)
                enemies[i].velocityX *= -1;
            if(enemies[i].y < 0 || enemies[i].y > canvasHeight)
                enemy.velocityY *= -1;

            // if(player.withinRange(enemies[i].x, enemies[i].y)){
            //     socket.emit('update item', enemies[i].plain());
            // }
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
http.listen(3000, function () {
    console.log('running');
});