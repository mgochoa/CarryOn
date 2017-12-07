var game = new Phaser.Game(370, 550, Phaser.AUTO, 'principal');

var fondo;

var nave;
var cursors;

var balas;
var balasEnemigas;
var tiempoBala = 0;
var tiempoBalaEnemiga = 0;
var btnDisparo;

var enemigos;

var mainState = {
    preload() {
        game.load.image('personaje', 'assets/space/NaveAlpha.png');
        game.load.image('fondo', 'assets/space/space.png');
        game.load.image('balaEnemiga', 'assets/space/laser2.png');
        game.load.image('bala', 'assets/space/laser.png');

        game.load.spritesheet('enemigo', 'assets/space/NaveRaso.png',143, 132);
    },

    create() {
        fondo = game.add.tileSprite(0, 0, 370, 550, 'fondo');
        nave  = game.add.sprite(game.width/2, 500, 'personaje');
        nave.scale.setTo(0.2);
        nave.anchor.setTo(0.5);

        cursors = game.input.keyboard.createCursorKeys();

        balasEnemigas = game.add.group();
        balasEnemigas.enableBody = true;
        balasEnemigas.physicsBodyType = Phaser.Physics.ARCADE;
        balasEnemigas.createMultiple(20, 'balaEnemiga');
        balasEnemigas.setAll('anchor.x', 0.5);
        balasEnemigas.setAll('anchor.y', 1);

        balasEnemigas.setAll('outOfBoundsKill', true);
        balasEnemigas.setAll('checkWorldBounds', true);

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

        tween = game.add.tween(enemigos);
        tween.to({ x: [20, 50, 20, 50, 20], y: [280, 150, 150, 30]}, 3000, "Linear");
    },

    update() {
        tween.start();
        fondo.tilePosition.y -= 1;
        if (cursors.right.isDown) {
            nave.position.x += 3;
        } else if (cursors.left.isDown) {
            nave.position.x -= 3;
        }
        var bala;
        var balaEne;
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
        var unEnemigo;
        if (game.time.now > tiempoBala) {
            balaEne = balasEnemigas.getFirstExists(false);
            unEnemigo = enemigos.getRandomExists();
        }

        if (balaEne) {
            balaEne.reset(unEnemigo.x, unEnemigo.y);
            balaEne.body.velocity.y = 100;
            tiempoBala = game.time.now + 100;
        }

        game.physics.arcade.overlap(balas, enemigos, colision, null, this);
    }
};

function colision(bala, nave) {
    bala.kill();
    nave.kill();
}

game.state.add('main', mainState);
game.state.start('main');
