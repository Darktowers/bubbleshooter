(function (exports) {

    var Preloader = function (game) {
        this.game = game;
    }

    Preloader.prototype = {

        preload: function () {
            this.game.stage.disableVisibilityChange = true;

            // bck = this.add.sprite(this.world.centerX, this.world.centerY, 'preload-background');
            // bck.anchor.setTo(0.5,0.5);
            // bck.scale.setTo(0.5,0.5);
            // preloadBar = this.add.sprite(this.world.centerX, this.world.centerY, 'preload-bar');
            // preloadBar.anchor.setTo(0,0.5);
            // preloadBar.scale.setTo(0.5,1);
            // preloadBar.x = this.world.centerX - preloadBar.width/2;

            var loading = this.add.sprite(0, 0, 'loading');
            loading.scale.setTo(0.3);

            loading.y = (this.world.height / 2) - (loading.height / 2);
            loading.x = (this.world.width / 2) - (loading.width / 2);
            //  Here we add a new animation called 'walk'
            //  Because we didn't give any other parameters it's going to make an animation from all available frames in the 'mummy' sprite sheet
            var start = loading.animations.add('start');

            //  And this starts the animation playing by using its key ("walk")
            //  30 is the frame rate (30fps)
            //  true means it will loop when it finishes
            loading.animations.play('start', 30, true);




            //this.load.setPreloadSprite(preloadBar);

            this.load.atlasJSONHash('sprites', assetsPath+'/img/sprites3.png', assetsPath+'/json/sprites.json');
            //this.load.image("background", "src/img/background.jpg");


            this.load.image('tablero', assetsPath+'/img/tablero.png');
            this.load.image('tablero-press', assetsPath+'/img/tablero-press.png');
            
            if(this.game.device.touch){
                this.load.image('shooterx', assetsPath+'/img/shooter.png');
            }else{
                this.load.image('shooterxHov', assetsPath+'/img/shooter.png');
                this.load.image('shooterx', assetsPath+'/img/shooterMovil.png');
            }
            
            this.load.image('spin', assetsPath+'/img/spin.png');
            this.load.image('backGame2', assetsPath+'/img/back2.png');
    
            this.load.image('backGame', assetsPath+'/img/back.png');
            this.load.image('plop40', assetsPath+'/img/plop40.png');
            this.load.image('plop20', assetsPath+'/img/plop20.png');
            this.load.image('plop10', assetsPath+'/img/plop10.png');
            this.load.image('modal', assetsPath+'/img/modal.png');
            this.load.image('intro', assetsPath+'/img/intro.png');
            this.load.image('barra', assetsPath+'/img/barra.png');
            


            this.load.image('icocerrar', assetsPath+'/img/icocerrar.png');
            this.load.image('icoinicio', assetsPath+'/img/icoinicio.png');
            this.load.image('icomecanica', assetsPath+'/img/icomecanica.png');
            this.load.image('icoranking', assetsPath+'/img/icoranking.png');
            this.load.image('icoterminos', assetsPath+'/img/icoterminos.png');
            this.load.image('icosonido', assetsPath+'/img/icosonido.png');
            this.load.image('icosonidoPause', assetsPath+'/img/icosonido-pausa.png');

            this.load.image('icoright', assetsPath+'/img/right.png');
            this.load.image('icoleft', assetsPath+'/img/left.png');
            
            
            
            


            //Como jugar
            this.load.image('mec1', assetsPath+'/img/mecanica/1-01.png');
            this.load.image('mec2', assetsPath+'/img/mecanica/2-01.png');
            this.load.image('mec6', assetsPath+'/img/mecanica/6-01.png');
            this.load.image('mec8', assetsPath+'/img/mecanica/8-01.png');
            this.load.image('mec10', assetsPath+'/img/mecanica/10-01.png');
            


            this.load.image('bolaon', assetsPath+'/img/bolaon.png');
            this.load.image('bolaoff', assetsPath+'/img/bolaoff.png');
            


            this.load.image('boton', assetsPath+'/img/boton.png');
            this.load.image('botonModal', assetsPath+'/img/boton-modal.png');

            this.load.image('icoterminos', assetsPath+'/img/icoterminos.png');

            this.load.image('icoterminos', assetsPath+'/img/icoterminos.png');
            this.load.image('icopause', assetsPath+'/img/pause.png');
            
            
            this.load.atlasJSONHash('chispa-orange', assetsPath+'/img/chispas/gris/gris.png', assetsPath+'/img/chispas/gris/gris.json');
            this.load.atlasJSONHash('chispa-yellow', assetsPath+'/img/chispas/amarillo/sprites.png', assetsPath+'/img/chispas/amarillo/sprites.json');
            this.load.atlasJSONHash('chispa-blue', assetsPath+'/img/chispas/azul/sprites.png', assetsPath+'/img/chispas/azul/sprites.json');
            this.load.atlasJSONHash('chispa-magenta', assetsPath+'/img/chispas/morada/sprites.png', assetsPath+'/img/chispas/morada/sprites.json');
            this.load.atlasJSONHash('chispa-red', assetsPath+'/img/chispas/roja/sprites.png', assetsPath+'/img/chispas/roja/sprites.json');
            this.load.atlasJSONHash('chispa-green', assetsPath+'/img/chispas/verde/sprites.png', assetsPath+'/img/chispas/verde/sprites.json');

            this.load.atlasJSONHash('mentol', assetsPath+'/img/textos/mentol.png', assetsPath+'/img/textos/mentol.json');
            this.load.atlasJSONHash('purplex2', assetsPath+'/img/textos/purplex2.png', assetsPath+'/img/textos/purplex2.json');
            this.load.atlasJSONHash('sabor', assetsPath+'/img/textos/sabor.png', assetsPath+'/img/textos/sabor.json');


            this.load.atlasJSONHash('animMec2', assetsPath+'/img/mecanica/mecanica1.png', assetsPath+'/img/mecanica/mecanica1.json');
            this.load.atlasJSONHash('animMec2P', assetsPath+'/img/mecanica/mecanica1puntos.png', assetsPath+'/img/mecanica/mecanica1puntos.json');
            
            this.load.atlasJSONHash('animMec3', assetsPath+'/img/mecanica/mecanica2.png', assetsPath+'/img/mecanica/mecanica2.json');
            this.load.atlasJSONHash('animMec3P', assetsPath+'/img/mecanica/mecanica2puntos.png', assetsPath+'/img/mecanica/mecanica2puntos.json');
            
            
            this.load.atlasJSONHash('animMec4', assetsPath+'/img/mecanica/mecanica3.png', assetsPath+'/img/mecanica/mecanica3.json');
            this.load.atlasJSONHash('animMec4P', assetsPath+'/img/mecanica/mecanica3puntos.png', assetsPath+'/img/mecanica/mecanica3puntos.json');

            this.load.audio('explosion', [assetsPath+'/sounds/explosion.ogg', assetsPath+'/sounds/explosion.mp3']);
            this.load.audio('launch', [assetsPath+'/sounds/launch.ogg', assetsPath+'/sounds/launch.mp3']);
            this.load.audio('win', [assetsPath+'/sounds/win.ogg', assetsPath+'/sounds/win.mp3']);
            this.load.audio('fail', [assetsPath+'/sounds/fail.ogg', assetsPath+'/sounds/fail.mp3']);
            this.load.audio('goodjob', [assetsPath+'/sounds/goodjob.mp3']);


            this.load.audio('clic', [assetsPath+'/sounds/clic.mp3']);



        },

        create: function () {
            BubbleShoot.sound.clic = this.game.add.sound('clic');

            this.state.start('menu');
        }

    }

    exports.Preloader = Preloader;

})(this);
