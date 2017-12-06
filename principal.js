var game = new Phaser.Game(370, 550, Phaser.AUTO, 'principal');

var fondo;

var nave;
var cursors;

var balas;
var tiempoBala = 0;
var btnDisparo;

var enemigos;

var mainState = {
    preload() {
        game.load.image('personaje', 'assets/space/NaveAlpha.png');
        game.load.image('fondo', 'assets/space/space.png');
        game.load.image('bala', 'assets/space/laser.png');

        game.load.spritesheet('enemigo', 'assets/space/NaveRaso.png',143, 132);
    },

    create() {
        fondo = game.add.tileSprite(0, 0, 370, 550, 'fondo');
        nave  = game.add.sprite(game.width/2, 500, 'personaje');
        nave.scale.setTo(0.2);
        nave.anchor.setTo(0.5);

        cursors = game.input.keyboard.createCursorKeys();

        balas = game.add.group();
        balas.enableBody = true;
        balas.physicsBodyType = Phaser.Physics.ARCADE;
        balas.createMultiple(20, 'bala');
        balas.setAll('anchor.x', 0.5);
        balas.setAll('anchor.y', 1);

        balas.setAll('outOfBoundsKill', true);
        balas.setAll('checkWorldBounds', true);

        enemigos = game.add.group();
        enemigos.enableBody = true;
        enemigos.physicsBodyType = Phaser.Physics.ARCADE;

        for(var y = 0; y < 4; y++) {
            for (var x = 0; x < 5; x++) {
                var enemigo = enemigos.create(x*60, y*40, 'enemigo');
            }
        }

        enemigos.x = 20;
        enemigos.y = 30;

        var anima = game.add.tween(enemigos).to({x:70}, 1000, Phaser.Easing.Linear.None, true, 0, 1000, true).onLoop.add(descender, this);
    },

    update() {
        if (cursors.right.isDown) {
            nave.position.x += 3;
        } else if (cursors.left.isDown) {
            nave.position.x -= 3;
        }
        var bala;
        if (cursors.up.isDown) {

            if (game.time.now > tiempoBala) {
                bala = balas.getFirstExists(false);
            }

            if (bala) {
                bala.reset(nave.x, nave.y);
                bala.body.velocity.y = -300;
                tiempoBala = game.time.now + 100;
            }
        }

        game.physics.arcade.overlap(balas, enemigos, colision, null, this);
    }
};
function colision(bala, enemigo) {
    bala.kill();
    enemigo.kill();
}

function descender() {
    enemigos.y += 10;
}

game.state.add('main', mainState);
game.state.start('main');
