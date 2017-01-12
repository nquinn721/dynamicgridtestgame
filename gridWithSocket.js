var read = require('fs').readFileSync;

module.exports = function(app, gridConfig){
    gridConfig = gridConfig || {};

    // Grid setup
    var Grid = require('dynamicgrid');
    var grid = new Grid(gridConfig.w || 1200, gridConfig.h || 700, gridConfig.segment || {w : 100, h : 100});

    // Socket Setup
    var http = require('http').createServer(app);
    var io = require('socket.io')(http);
    app.get('/gridwithsocketclient.js', function (req, res) {
        res.setHeader('Content-Type', 'application/javascript');
        res.writeHead(200);
        res.end(read('./gridwithsocketclient.js', 'utf-8'));
    });

    http.listen(3000, function () {
        console.log('running');
    });

    return {
        io : io,
        grid : grid,
        init : init
    };
    function init (socket, player) {
        player = player || {};

        socket.player = grid.createItem(player.x || 50, player.y || 50);

        // Listen when items show up in segment
        grid.on('destroyed item', function (item) {
            if(socket.player.withinRange(item.x, item.y))
                socket.emit('destroy item', item.plain());
        });
        // Listen to item changing segment
        socket.player.on('segment change', function () {
            socket.emit('items', socket.player.getItemsInSurroundingSegments(true));
        });
        socket.emit('player', socket.player.plain());
        socket.emit('items', socket.player.getItemsInSurroundingSegments(true));

        socket.on('update player', function (obj) {
            this.player.update(obj.x, obj.y);
        });
        socket.player.listenToSegmentGroup(function (event, item) {

            if(item.id !== socket.player.id){
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


    };


};