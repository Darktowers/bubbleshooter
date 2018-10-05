; (function (exports) {
    function Player(id, side) {

        this.id = id;
        this.side = side;
        this.shooter = new BubbleShoot.Shooter(this);
        this.board = new BubbleShoot.Board(this);
    }

    Player.prototype = {

        getMetaData: function () {
            return {
                id: this.id,
                side: this.side,
                shooter: this.shooter.getMetaData(),
                board: this.board.getMetaData(),
            }
        },

        fire: function (done, trajectory) {
            if(BubbleShoot.player.board.grid.length>12){
                BubbleShoot.player.board.grid[12].map(function(item){
                    if(item != undefined){
                        lose = true;
                    } 
                })
            }
            var fire = function (bubble) {
                var win = false, lose = false;

                // lose
                if ((this.side == BubbleShoot.PLAYER_SIDE_BOTTOM &&
                    bubble.y + bubble.radius > this.shooter.y - this.shooter.height / 2) ||
                    (this.side == BubbleShoot.PLAYER_SIDE_TOP &&
                        bubble.y - bubble.radius < this.shooter.y + this.shooter.height / 2)
                ) {
                    lose = true;
                }

                if (!lose) {
                    this.board.checkMatches(bubble);
                    this.board.checkOrphans();

                    var remaining = this.board.getRemaining();


                    console.log("Choca");

                    setTimeout(function () {
                        BubbleShoot.textPuntos.text =  BubbleShoot.player.board.returnPoints();
                        BubbleShoot.textPuntos.updateText();
                        BubbleShoot.textPuntos.dirty = false; 
                    }, null);
                    // win
                    if (remaining.length == 0) {
                        BubbleShoot.sound.win.play();
                        BubbleShoot.entities = BubbleShoot.game.add.group();

                        var bubblesGroup = BubbleShoot.game.add.group();
                        bubblesGroup.enableBody = true;
            
                        BubbleShoot.entities.add(bubblesGroup);
                        BubbleShoot.entities.bubbles = bubblesGroup;
                        BubbleShoot.entities.bringToTop(BubbleShoot.entities.bubbles);
                        
                        var maxRows = Math.round(BubbleShoot.UI.maxRows);
                        var maxCols = BubbleShoot.UI.maxCols;
        
                        BubbleShoot.player.board.createGrid(maxRows, maxCols);
                        BubbleShoot.player.board.createBubbles();
                    }
                }

                if (win) {
                    BubbleShoot.player.board.createBubbles();
                }
                if (lose) {
                    BubbleShoot.CurrenteState.finish(this.enemy);
                }

                // if (!win && !lose) {
                // this.shooter._nextLoaded.push(this.board.getNextBubbleTag(remaining));
                // }

                if (done) {
                    done();
                }
            }
            this.shooter.fire(fire.bind(this), trajectory);
            this.shooter.reload();
            BubbleShoot.player.shooter._nextLoaded.push(BubbleShoot.Bubble.getRandomSprite());

            this.shooter.changeAlterBubble(BubbleShoot.player.shooter._nextLoaded[0]);
        },
    }

    exports.Player = Player;

})(BubbleShoot);
