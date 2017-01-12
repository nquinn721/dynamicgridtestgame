
function startGame() {
    var game = new Phaser.Game(1200, 700, Phaser.AUTO, 'game-container', {
        preload: preload,
        create: create,
        update: update,
        render: render
    });
    var grid, cursors, player;


    function preload() {
        game.load.image('ship', 'img/ship.png');
        game.load.image('bullet', 'img/bullet.png');
    }

    function create() {
        grid = new Grid(game);
        grid.init();
        grid.register('createplayer', function (p) {
            player = game.add.sprite(p.x, p.y, 'ship');
            player.scale.set(0.4);
            player.anchor.setTo(0.5, 0.5);
            game.physics.arcade.enable(player, Phaser.Physics.ARCADE);

            game.world.setBounds(0, 0, 1200, 700);
            game.physics.startSystem(Phaser.Physics.P2JS);
            cursors = game.input.keyboard.createCursorKeys();
            game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

            drawGrid();
        });


    }

    function update() {

        if(player){

            if (game.input.keyboard.isDown(Phaser.Keyboard.W)){
                game.physics.arcade.moveToPointer(player, 200);
                if (Phaser.Rectangle.contains(player.body, game.input.x, game.input.y)){
                    player.body.velocity.setTo(0, 0);
                }
                grid.updatePlayer();
            }
            else{
                player.body.velocity.setTo(0, 0);
            }

            // if(game.input.activePointer.isDown){
            //     weapon.fire();
            // }


                player.rotation = game.physics.arcade.angleToPointer(player);


        }

    }

    function render() {
        if(player){
            // game.debug.cameraInfo(game.camera, 32, 32);
            // game.debug.spriteCoords(player, 32, 500);
        }
    }

    function drawGrid() {
        for(var i = 0; i < 6000; i+=100){
            for(var j = 0; j < 6000; j+=100){

                var bmd = game.add.bitmapData(100, 100);

                bmd.ctx.beginPath();
                bmd.ctx.rect(0, 0, 100, 100);
                bmd.ctx.strokeStyle = '#555555';
                bmd.ctx.stroke();
                game.add.sprite(i, j, bmd);
            }

        }
    }

}
