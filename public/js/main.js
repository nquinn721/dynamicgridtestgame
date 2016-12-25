function Main(game) {
    this.socket = io();
    this.player;
    this.items = [];
    this.game = game;



}

Main.prototype = {
    init : function(cb){
        this.setupSockets(cb);
    },

    setupSockets : function (cb) {
        var self = this;
        this.socket.on('player', function (item) {
            self.player = item;
            // self.player
            // = self.draw(item.x, item.y);
            self.player = self.game.add.sprite(item.x, item.y, 'ship');
            self.player.scale.set(0.4);
            self.player.anchor.setTo(0.5, 0.5);
            self.game.physics.arcade.enable(self.player, Phaser.Physics.ARCADE);
            cb(self.player);
        });
        this.socket.on('items', function (items) {
            self.clearItemsNotNearBy(items);
            for(var i = 0; i < items.length; i++){
                self.items[i] = self.draw(items[i]);
            }
        });
        this.socket.on('create item', function (item) {
            console.log('create');
            self.items.push(self.draw(item));
        });
        this.socket.on('update item', function (item) {
            var found;
            for(var i = 0; i < self.items.length; i++)
                if(self.items[i].id === item.id){
                    found = true;
                    self.items[i].x = item.x;
                    self.items[i].y = item.y;
                }
        });

        this.socket.on('destroy item', function (item) {
            var i = self.getItemById(item);
            if(i){
                i.destroy(true);
                self.items = self.items.filter(v => v.id !== item.id);

            }
        });

    },
    updatePlayer : function () {
        this.socket.emit('update player', {x : this.player.x, y : this.player.y});
    },
    update : function () {



    },
    getItemById : function (item) {
        for(var i = 0; i < this.items.length; i++)
            if(this.items[i].id === item.id)return this.items[i];
    },
    clearItemsNotNearBy : function (items) {
        this.items.filter(function (v) {
            return items.indexOf(v) < 0;
        }).map(function (v) {
            if(v && v.destroy)
                v.destroy();
        });
    },
    draw : function (item) {
        var sprite;
        var width = 10 // example;
        var height = 10 // example;
        var bmd = this.game.add.bitmapData(width, height);

        bmd.ctx.beginPath();
        bmd.ctx.rect(0, 0, width, height);
        bmd.ctx.fillStyle = '#ffffff';
        bmd.ctx.fill();
        sprite = this.game.add.sprite(item.x, item.y, bmd);
        sprite.anchor.setTo(0.5, 0.5);
        sprite.id = item.id;
        return sprite;
    }

}


