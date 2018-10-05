; (function (exports) {

    var Shooter = function (player) {


        Phaser.Sprite.call(this, BubbleShoot.game, BubbleShoot.game.world.centerX, 0);
        BubbleShoot.entities.add(this);

        player.shooter = this;
        this.player = player;

        this._loaded = false;
        this._loading = false;
        this._nextLoaded = [];

        this.BitmapSprite = {};
        
        this.scale.setTo(0.3);
        this.anchor.setTo(0.5, 0.75);

        if (player.side == BubbleShoot.PLAYER_SIDE_TOP) {
            this.angle = 179;
            this.y = this.height / 4;
        }

        if (player.side == BubbleShoot.PLAYER_SIDE_BOTTOM) {
            this.angle = 0;
            this.y = BubbleShoot.game.height - 200;
        }
    }

    Shooter.prototype = Object.create(Phaser.Sprite.prototype);
    Shooter.prototype.constructor = Shooter;

    Shooter.prototype.fire = function (done, trajectory) {

        var bubble = this.bubble;

        if (!bubble || !this._loaded) {
            return false;
        }

        var trajectory = trajectory || BubbleShoot.Collision.trajectory(this.position, this.rotation, this.player.board);
        bubble.move(trajectory, done);
        this.bubble = null;
    };
    Shooter.prototype.changeBubble = function () {

        console.log(this._nextLoaded);
        if (this._nextLoaded.length) {
            var tagOld = BubbleShoot.player.shooter.bubble.tag;
            BubbleShoot.player.shooter.bubble.tag = this._nextLoaded.shift();
            BubbleShoot.player.shooter.bubble.loadTexture("sprites", BubbleShoot.player.shooter.bubble.tag);
            this._nextLoaded.push(tagOld);
            console.log(tagOld);
            this.changeAlterBubble(tagOld)
        } else {
            BubbleShoot.player.shooter._nextLoaded.push(BubbleShoot.Bubble.getRandomSprite());
            var tagOld = BubbleShoot.player.shooter.bubble.tag;
            BubbleShoot.player.shooter.bubble.tag = this._nextLoaded.shift();
            BubbleShoot.player.shooter.bubble.loadTexture("sprites", BubbleShoot.player.shooter.bubble.tag);
            this._nextLoaded.push(tagOld);
            console.log(tagOld);
            this.changeAlterBubble(tagOld)
        }

    }
    Shooter.prototype.changeAlterBubble = function (tag) {
        BubbleShoot.alterBubble.loadTexture("sprites", tag);
        BubbleShoot.alterBubble.tag = tag;
    }

    Shooter.prototype.createAlterBubble = function () {
        if (this._nextLoaded.length) {
            BubbleShoot.alterBubble = BubbleShoot.Bubble.create(this.player, undefined, undefined, this._nextLoaded[0]);
            BubbleShoot.alterBubble.scale.setTo(0.3)
            BubbleShoot.alterBubble.position.set(BubbleShoot.game.world.centerX - 70, BubbleShoot.game.height - 150);
        } else {

            BubbleShoot.player.shooter._nextLoaded.push(BubbleShoot.Bubble.getRandomSprite());
            BubbleShoot.alterBubble = BubbleShoot.Bubble.create(this.player, undefined, undefined, BubbleShoot.player.shooter._nextLoaded[0]);
            BubbleShoot.alterBubble.scale.setTo(0.3)
            BubbleShoot.alterBubble.position.set(BubbleShoot.game.world.centerX - 70, BubbleShoot.game.height - 150);
        }
    }
    Shooter.prototype.getBitmapData = function () {
        if (!this.bmd) {
            this.bmd = BubbleShoot.game.add.bitmapData(this.player.board.width, BubbleShoot.UI.height);

            this.BitmapSprite = BubbleShoot.game.add.sprite(this.player.board.x, this.player.board.y, this.bmd);

            
            BubbleShoot.entities.add(this.BitmapSprite);

        }
        return this.bmd;
    }

    Shooter.prototype.showTrajectory = function (bolean) {

        
        var trajectory = BubbleShoot.Collision.trajectory(this.position, this.rotation, this.player.board);
        if(bolean){
            this.BitmapSprite.visible = true;
        }else{
            this.BitmapSprite.visible = false;
        }
        var bmd = this.getBitmapData();

            var context = bmd.context;
            var board = this.player.board;
            bmd.clear();

            
            context.beginPath();
            context.strokeStyle = 'white';        
            context.lineWidth = 10;
            context.setLineDash([15]);
            context.moveTo(this.position.x - board.x, this.position.y - board.y);
            trajectory.forEach(function (step, index) {
                context.lineTo(step.position.x - board.x, step.position.y - board.y);
            }.bind(this));
            context.stroke();
            
            context.strokeStyle = 'rgb(168, 133, 264';        
            context.lineWidth = 6;
            context.stroke();   
                 
            context.lineWidth = 3;  
            context.strokeStyle = 'rgb(72, 204, 254)';
            context.globalAlpha = 0.5
            context.stroke() 


    };
    Shooter.prototype.showTrajectoryNew = function () {
        var loop = BubbleShoot.game.make.sprite(0, 0, 'plop40');
        var board = this.player.board;
        
        var trajectory = BubbleShoot.Collision.trajectory(this.position, this.rotation, this.player.board);
        var bmd = this.getBitmapData();
        var context = bmd.context;
        bmd.smoothed = false;
        trajectory.forEach(function (step, index) {
            bmd.draw(0, 100);
        }.bind(this));
        context.stroke();
    }
    Shooter.prototype.reload = function (force, nextTag) {
        if (this.bubble || this._loading) {
            return false;
        }

        this._loading = true;
        this._loaded = false;

        var bubble = BubbleShoot.Bubble.create(this.player, undefined, undefined, this._nextLoaded.shift());

        bubble.anchor.setTo(0.5)
        bubble.position.set(this.x, this.y);

        var done = function () {
            this.bubble = bubble;
            this._loading = false;
            this._loaded = true;
        };

        if (force) {
            return done.call(this);
        }

        var scale = BubbleShoot.UI.bubble.scale;
        bubble.scale.setTo(0.001);
        var anim = BubbleShoot.game.add.tween(bubble.scale);
        anim.to({ x: scale, y: scale }, 333);
        anim.onComplete.add(done.bind(this));
        anim.start();
        return true;
    };

    Shooter.prototype.setRotation = function (rotation) {
        this.rotation = rotation;

        if (this.player.side == BubbleShoot.PLAYER_SIDE_BOTTOM && Math.abs(this.angle) > 55) {
            this.angle = this.angle > 0 ? 55 : -55;
        }

        if (this.player.side == BubbleShoot.PLAYER_SIDE_TOP && Math.abs(this.angle) < 50) {
            this.angle = this.angle > 0 ? 55 : -55;
        }
    }

    Shooter.prototype.getMetaData = function () {
        return {
            x: this.x,
            y: this.y,
            position: {
                x: this.x,
                y: this.y,
            },
            rotation: this.rotation,
        }
    }

    exports.Shooter = Shooter;

})(BubbleShoot);
