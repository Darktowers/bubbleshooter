(function(exports) {

    var Menu = function(_game)
    {
        this.game = _game;
    }

    Menu.prototype = {

        create: function()
        {
            BubbleShoot.UI.changeBack2()

            BubbleShoot.mode = BubbleShoot.MODES.SINGLEPLAYER;
            this.background = BubbleShoot.game.add.image(0, 0, 'intro');
            this.background.width = this.world.width;
            this.background.height = this.world.height;

            var style = {
                font: "45px din_alternatebold", fill: "#fff",
                align: "center", // the alignment of the text is independent of the bounds, try changing to 'center' or 'right'
                boundsAlignH: "right",
                boundsAlignV: "middle"
            };


            var button = this.add.button(0,0,"botonModal");
            button.scale.setTo(0.85);
            button.alpha = 0.6;
            button.y = (this.world.height * 0.54) - (button.height * 0.54);
            button.x = (this.world.width / 2) - (button.width / 2);

            style.font = "40px din_condensedbold";
            this.text5 = this.add.text(0, 0, "JUGAR", style);
            this.text5.y = (this.world.height *  0.54) - (this.text5.height *  0.54);
            this.text5.x = (this.world.width / 2) - (this.text5.width / 2);

            var comoJugar = this.add.button(0,0,"botonModal");
            comoJugar.scale.setTo(0.85);
            comoJugar.alpha = 0.66;
            comoJugar.y = (this.world.height * 0.66) - (comoJugar.height * 0.66);
            comoJugar.x = (this.world.width / 2) - (comoJugar.width / 2);

            style.font = "40px din_condensedbold";
            this.text8 = this.add.text(0, 0, "¿CÓMO JUGAR?", style);
            this.text8.y = (this.world.height * 0.66) - (this.text8.height * 0.66);
            this.text8.x = (this.world.width / 2) - (this.text8.width / 2);


            var btnMecanica = this.add.button(0,0,"icomecanica");
            btnMecanica.scale.setTo(1.1);
            btnMecanica.alpha = 0.6;
            btnMecanica.y = (this.world.height * 0.805) - (btnMecanica.height * 0.805);
            btnMecanica.x = (this.world.width / 2) - (btnMecanica.width / 2)-138;

            var btnRanking = this.add.button(0,0,"icoranking");
            btnRanking.scale.setTo(1.1);
            btnRanking.alpha = 0.6;
            btnRanking.y = (this.world.height * 0.8) - (btnRanking.height * 0.8);
            btnRanking.x = (this.world.width / 2) - (btnRanking.width / 2)+140;



            button.events.onInputDown.add(function(){
                BubbleShoot.UI.clickSound();                
                this.state.start('game');
            },this)
            btnRanking.events.onInputDown.add(function(){
                BubbleShoot.UI.clickSound();                
                this.state.start('ranking');
            },this)
            comoJugar.events.onInputDown.add(function(){
                BubbleShoot.UI.clickSound();

                BubbleShoot.UI.createComojugar()
            },this)

            
            btnMecanica.events.onInputDown.add(function(){
                BubbleShoot.UI.clickSound();
                BubbleShoot.UI.createMecanica()
            },this)
            button.events.onInputOver.add(this.hoverBtnx,this)
            button.events.onInputOut.add(this.unHoverBtnx,this)

            btnMecanica.events.onInputOver.add(this.hoverBtn,this)
            btnMecanica.events.onInputOut.add(this.unHoverBtn,this)

            btnRanking.events.onInputOver.add(this.hoverBtn,this)
            btnRanking.events.onInputOut.add(this.unHoverBtn,this)

            comoJugar.events.onInputOver.add(this.hoverBtn,this)
            comoJugar.events.onInputOut.add(this.unHoverBtn,this)
            
            
            
        },
        hoverBtn : function(btn){
            var anim = BubbleShoot.game.add.tween(btn).to( { alpha: 0.8 },300, 'Linear', true, 0);

        },
        unHoverBtn: function(btn){
            var anim = BubbleShoot.game.add.tween(btn).to( { alpha: 0.6 }, 300, 'Linear', true, 0);
        },
        hoverBtnx : function(btn){
            var anim = BubbleShoot.game.add.tween(btn).to( { alpha: 0.8 },300, 'Linear', true, 0);
        },
        unHoverBtnx: function(btn){
            var anim = BubbleShoot.game.add.tween(btn).to( { alpha: 0.6 }, 300, 'Linear', true, 0);
        },
        startFullScreen : function()
        {
            this.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.startFullScreen(false);
        },

    }

    exports.Menu = Menu;

})(this);
