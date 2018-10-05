; (function (exports) {
    var points = 0;
    var contador = 0;
    var contadorShoots = 0;
    var groupx = {};
    var contadorMagenta = 0;
    var contadorBlue = 0;
    var Board = function (player) {
        this.player = player;
        this.side = player.side;

        this.x = 0;
        this.y = 0;

        this.grid = [];
        this.maxRows = 0;
        this.maxCols = 0;
    }

    Board.prototype = {

        setGrid: function (grid) {
            this.grid = grid;
            this.maxRows = this.grid.length;
            this.maxCols = this.grid[0].length;
        },

        createGrid: function (maxRows, maxCols) {
            this.maxRows = maxRows;
            this.maxCols = maxCols;
            this.grid = [];
            contador = 0;
            for (var row = 0; row < this.maxRows; row++) {

                this.grid[row] = [];
                var mod = row % 2 === 0;

                for (var col = 0; col < this.maxCols; col++) {

                    // last col
                    if (!mod && col >= this.maxCols - 1) {
                        continue;
                    }

                    this.grid[row][col] = BubbleShoot.Bubble.getRandomSprite();
                }
            }
        },
        createLifes: function () {
            this.lifes = BubbleShoot.game.add.group();

            var life1 = BubbleShoot.game.add.image(0, 0, 'bolaon');
            var life2 = BubbleShoot.game.add.image(0, 0, 'bolaon');
            var life3 = BubbleShoot.game.add.image(0, 0, 'bolaon');


            life1.y = (BubbleShoot.game.world.height * 0.95) - (life1.height * 0.95);
            life1.x = (BubbleShoot.game.world.width / 2) - (life1.width / 2) + -220;

            life2.y = (BubbleShoot.game.world.height * 0.95) - (life2.height * 0.95);
            life2.x = (BubbleShoot.game.world.width / 2) - (life2.width / 2) + -175;

            life3.y = (BubbleShoot.game.world.height * 0.95) - (life3.height * 0.95);
            life3.x = (BubbleShoot.game.world.width / 2) - (life3.width / 2) + -130;

            this.lifes.add(life1);
            this.lifes.add(life2);
            this.lifes.add(life3);


        },
        createBubbles: function () {
            var separetorHeight = BubbleShoot.UI.board.separatorHeight + 1;
            this.height = 95;

            //this.height = separetorHeight;
            this.width = BubbleShoot.UI.bubble.size * this.maxCols;

            this.x = BubbleShoot.UI.board.width - this.width;

            if (this.side == BubbleShoot.PLAYER_SIDE_BOTTOM) {
                this.y = this.height;
            }

            if (this.side == BubbleShoot.PLAYER_SIDE_TOP) {
                this.y = 0;
            }

            for (var row = 0, rows = this.grid.length; row < rows; row++) {
                for (var col = 0, cols = this.grid[row].length; col < cols; col++) {
                    var tag = this.grid[row][col];
                    var bubble = BubbleShoot.Bubble.create(this.player, row, col, tag);
                    bubble.fixPositionByGrid();


                    this.grid[row][col] = bubble;
                }
            }
        },
        createLine: function () {
            contadorShoots = 0;

            this.gridNew = [];
            contador++;
            var mod = contador % 2 === 0;
            if (mod) {
                var length = 9;
            } else {
                var length = 8;

            }


            for (var col = 0; col < length; col++) {
                this.gridNew.push(BubbleShoot.Bubble.getRandomSprite());
            }
            for (var col = 0; col < length; col++) {
                var tag = this.gridNew[col];
                var bubble = BubbleShoot.Bubble.create(this.player, 0, col, tag);
                bubble.alpha = 0;
                var t2 = BubbleShoot.game.add.tween(bubble).to({ alpha: 1 }, 200, 'Linear', true, 0);

                this.gridNew[col] = bubble;
            }
            this.grid.unshift(this.gridNew);
            for (var row = 0, rows = this.grid.length; row < rows; row++) {
                for (var col = 0, cols = this.grid[row].length; col < cols; col++) {
                    var bubble = this.grid[row][col];
                    if (bubble != undefined) {
                        bubble.row = row;
                        bubble.col = col;
                        bubble.fixPositionByGrid();




                    }
                }
            }
        },
        addBubble: function (bubble) {



            if (!this.grid[bubble.row]) {
                this.grid[bubble.row] = [];
            }

            if (this.grid[bubble.row][bubble.col]) {
                console.error('addBubble rewrite grid', bubble.row, bubble.col);
            }

            this.grid[bubble.row][bubble.col] = bubble;
        },

        removeBubble: function (bubble, animation) {
            delete this.grid[bubble.row][bubble.col];

            if (!animation) {
                return bubble.kill();
            }

            // bubble.bringToTop();
            //
            // var x = Utils.getRandomInt(bubble.width * 4, -bubble.width * 4); 
            //
            // var start = {
            //     x : bubble.x + x,
            //     y :bubble.y - bubble.height * 2
            // };
            // var end = {
            //     x :  start.x, 
            //     y : BubbleShoot.game.height,
            // };
            //
            // // var ease = Phaser.Easing.Elastic.InOut;
            // // var ease = Phaser.Easing.Bounce.Out;
            // var ease = Phaser.Easing.Elastic.OutIn;
            // var anim = BubbleShoot.game.add.tween(bubble);
            // anim.to({ x: [start.x, end.x], y: [start.y, end.y]}, 400, ease);
            // anim.onComplete.add(function() {
            //     bubble.kill();
            // });
            // anim.start();
            // return;




            if (animation == 'remove') {
                bubble.children[0].visible = true;
                var anim = bubble.children[0].animations.add('chispa');
                bubble.children[0].animations.play('chispa', 30, false);
                anim.onComplete.add(function () {
                    bubble.children[0].animations.stop();
                    bubble.children[0].kill();
                    bubble.loadTexture("plop" + bubble.points);
                    var t2 = BubbleShoot.game.add.tween(bubble.scale).to({ x: BubbleShoot.UI.bubble.scale + 0.1, y: BubbleShoot.UI.bubble.scale + 0.1 }, 200, 'Linear', true, 0);
                    t2.onComplete.add(function () {
                        setTimeout(function () {
                            var t3 = BubbleShoot.game.add.tween(bubble.scale).to({ x: 0, y: 0 }, 400, 'Linear', true, 0);
                            t3.onComplete.add(function () {
                                bubble.kill();
                                bubble.loadTexture("sprites", bubble.tag);
                            })
                        }, 200);
                    })

                });
            } else {
                bubble.children[0].visible = true;
                var animx = bubble.children[0].animations.add('chispa');
                bubble.children[0].animations.play('chispa', 30, false);
                animx.onComplete.add(function () {
                    bubble.children[0].animations.stop();
                    bubble.children[0].kill();

                    setTimeout(function () {
                        var t3 = BubbleShoot.game.add.tween(bubble.scale).to({ x: 0, y: 0 }, 400, 'Linear', true, 0);
                        t3.onComplete.add(function () {
                            bubble.kill();
                        })
                    }, 200);

                });
            }
            // if (animation == 'pop') {
            //     var anim = BubbleShoot.game.add.tween(bubble);

            //     if (this.side == BubbleShoot.PLAYER_SIDE_TOP) {
            //         anim.to({ x: bubble.x, y: bubble.y - bubble.radius * 2 }, 100);
            //         anim.to({ x: bubble.x + bubble.radius, y: this.height }, 200);
            //     } else {
            //         anim.to({ x: bubble.x, y: bubble.y - bubble.radius * 2 }, 100);
            //         anim.to({ x: bubble.x + bubble.radius, y: BubbleShoot.game.height }, 200);
            //     }
            // }


        },

        getBubbleAt: function (row, col) {
            if (!this.grid[row] || !this.grid[row][col]) {
                return false;
            }
            return this.grid[row][col];
        },

        getBubblesAround: function (curRow, curCol) {
            var bubbles = [];
            var mod = curRow % 2 === 0;

            for (var rowNum = curRow - 1; rowNum <= curRow + 1; rowNum++) {

                for (var colNum = curCol - 1; colNum <= curCol + 1; colNum++) {

                    if (colNum == curCol && rowNum == curRow) {
                        continue;
                    }

                    if (!mod && rowNum != curRow && colNum === curCol - 1) {
                        continue;
                    }

                    if (mod && rowNum != curRow && colNum === curCol + 1) {
                        continue;
                    }

                    var bubbleAt = this.getBubbleAt(rowNum, colNum);
                    if (bubbleAt) {
                        bubbles.push(bubbleAt);
                    }
                }
            }

            return bubbles;
        },

        getGroup: function (bubble, found, differentColor) {
            var found = found || {};
            var curRow = bubble.row;
            var curCol = bubble.col;

            if (!found[curRow]) {
                found[curRow] = {};
            }
            if (!found.list) {
                found.list = [];
            }
            if (found[curRow][curCol]) {
                return found;
            }

            found[curRow][curCol] = bubble;
            found.list.push(bubble);

            var surrounding = this.getBubblesAround(curRow, curCol);

            for (var i = 0; i < surrounding.length; i++) {
                var bubbleAt = surrounding[i];
                if (bubbleAt.tag == bubble.tag || differentColor) {
                    found = this.getGroup(bubbleAt, found, differentColor);
                }
            }
            return found;
        },

        findOrphans: function () {
            var connected = [], groups = [], orphaned = [];

            for (var row = 0; row < this.grid.length; row++) {
                connected[row] = [];
            }

            for (var col = 0; col < this.grid[0].length; col++) {
                var bubble = this.getBubbleAt(0, col);
                if (bubble && !connected[0][col]) {
                    var group = this.getGroup(bubble, {}, true);
                    group.list.forEach(function (bubble) {
                        connected[bubble.row][bubble.col] = true;
                    });
                }
            }

            for (var row = 0; row < this.grid.length; row++) {
                for (var col = 0; col < this.grid[row].length; col++) {
                    var bubble = this.getBubbleAt(row, col);
                    if (bubble && !connected[row][col]) {
                        orphaned.push(bubble);
                    }
                }
            }

            return orphaned;
        },
        addBubblex: function (bubble, arrayx) {
            var _this = this;
            var found = arrayx.some(function (el) {
                return el === bubble;
            });
            if (!found) {
                console.log(found);
                if (bubble.tag == "magenta") {
                    contadorMagenta++;
                }
                if (bubble.tag == "blue") {
                    contadorBlue++;
                }
                arrayx.push(bubble);
            }
        },
        searchMagentaBlue: function (bubble) {
            var _this = this;

            var bandera = true;
            var oldtag = bubble.tag
            var search = "";
            contadorMagenta = 0;
            contadorBlue = 0;
            if (bubble.tag == "magenta") {
                contadorMagenta++;
                search = "blue"
            } else {
                contadorBlue++;

                search = "magenta"
            }

            bubble.tag = "blue";
            var groupB = this.getGroup(bubble);

            bubble.tag = "magenta";
            var groupM = this.getGroup(bubble);

            bubble.tag = oldtag

            if (bubble.tag == "magenta" || bubble.tag == "blue") {

                if (groupB.list.length >= 3) {

                    groupx.list = [];
                    groupB.list.forEach(function (bubbley) {

                        var oldTag = bubbley.tag;
                        bubbley.tag = search;
                        var entities = _this.getGroup(bubbley)
                        bubbley.tag = "blue";
                        var arrayx = entities.list;
                        if (arrayx.length >= 2) {
                            arrayx.forEach(function (item) {
                                _this.addBubblex(item, groupx.list);
                            })
                        }
                    })

                    if (contadorMagenta != 0 && contadorBlue != 0) {



                        BubbleShoot.animations.purpleX2.visible = true;
                        var start = BubbleShoot.animations.purpleX2.animations.add('explode');

                        BubbleShoot.animations.purpleX2.animations.play('explode', 30, false);

                        start.onComplete.add(function () {
                            BubbleShoot.animations.purpleX2.visible = false;
                        })

                        contadorShoots = 0;
                        BubbleShoot.sound.explosion.play();
                        BubbleShoot.sound.goodjob.play();
                        console.log(groupx);
                        bandera = false;

                        contadorShoots = 0;
                        groupB.list.forEach(function (bubble) {
                            _this.addBubblex(bubble, groupx.list);
                        });
                        groupx.list.forEach(function (bubble) {
                            if (bubble.tag == "magenta" || bubble.tag == "blue") {
                                points += 40;
                                bubble.points = 40;
                            }
                            _this.removeBubble(bubble, 'remove');
                        });

                    } else {
                        bandera = true;
                    }

                }
                console.log("Roll   " + contadorMagenta + "  -  " + contadorBlue);

                contadorMagenta = 0;
                contadorBlue = 0;

                if (groupM.list.length >= 3) {

                    groupx.list = [];
                    groupM.list.forEach(function (bubbley) {
                        var oldTag = bubbley.tag;
                        bubbley.tag = "magenta";
                        var entities = _this.getGroup(bubbley)
                        bubbley.tag = oldTag;
                        var arrayx = entities.list;
                        if (arrayx.length >= 2) {
                            arrayx.forEach(function (item) {
                                _this.addBubblex(item, groupx.list);
                            })
                        }
                    })

                    if (contadorMagenta != 0 && contadorBlue != 0) {

                        BubbleShoot.animations.purpleX2.visible = true;
                        var start = BubbleShoot.animations.purpleX2.animations.add('explode');

                        BubbleShoot.animations.purpleX2.animations.play('explode', 30, false);

                        start.onComplete.add(function () {
                            BubbleShoot.animations.purpleX2.visible = false;
                        })

                        console.log(groupx);
                        contadorShoots = 0;
                        BubbleShoot.sound.explosion.play();
                        BubbleShoot.sound.goodjob.play();
                        bandera = false;
                        contadorShoots = 0;
                        groupM.list.forEach(function (bubble) {
                            _this.addBubblex(bubble, groupx.list);
                        });
                        groupx.list.forEach(function (bubble) {
                            if (bubble.tag == "magenta" || bubble.tag == "blue") {
                                points += 40;
                                bubble.points = 40;
                            }
                            _this.removeBubble(bubble, 'remove');
                        });

                    } else {
                        bandera = true;
                    }


                }
                console.log("Back   " + contadorMagenta + "  -  " + contadorBlue);


                if (bandera == false) {
                    return false;
                } else {
                    return true;
                }
            }
            return true;


        },
        checkMatches: function (bubble) {
            var group = this.getGroup(bubble);
            var _this = this;

            contadorShoots++;
            var continuex = this.searchMagentaBlue(bubble);

            console.log(continuex);



            if (continuex || continuex == undefined) {
                if (group.list.length < 3) {

                } else {
                    BubbleShoot.sound.explosion.play();
                    contadorShoots = 0;
                    if (group.list[0].tag == "magenta") {
                        BubbleShoot.animations.sabor.visible = true;
                        var start = BubbleShoot.animations.sabor.animations.add('explode');

                        BubbleShoot.animations.sabor.animations.play('explode', 30, false);

                        start.onComplete.add(function () {
                            BubbleShoot.animations.sabor.visible = false;
                        })

                    } else if (group.list[0].tag == "blue") {
                        BubbleShoot.animations.mentol.visible = true;
                        var start = BubbleShoot.animations.mentol.animations.add('explode');

                        BubbleShoot.animations.mentol.animations.play('explode', 30, false);

                        start.onComplete.add(function () {
                            BubbleShoot.animations.mentol.visible = false;
                        })
                    }

                    group.list.forEach(function (bubble) {
                        if (bubble.tag == "magenta" || bubble.tag == "blue") {
                            points += 20;
                        } else {
                            points += 10;
                        }
                        _this.removeBubble(bubble, 'remove');
                    });
                }

            }




            if (contadorShoots >= 3) {
                BubbleShoot.player.board.createLine();
                BubbleShoot.player.board.createLine();
            }

            this.updatelifes(contadorShoots);
            console.log(contadorShoots);


        },
        updatelifes: function (c) {
            console.log(this.lifes);
            if (c == 0) {
                this.lifes.children.forEach(function (life, index) {
                    life.loadTexture("bolaon");
                })
            } else if (c == 1) {
                this.lifes.children.forEach(function (life, index) {
                    console.log(index);
                    if (index == 0 || index == 1) {
                        life.loadTexture("bolaon");
                    } else {
                        life.loadTexture("bolaoff");

                    }
                })
            } else if (c == 2) {
                this.lifes.children.forEach(function (life, index) {
                    if (index == 0) {
                        life.loadTexture("bolaon");
                    } else {
                        life.loadTexture("bolaoff");
                    }
                })
            }

        },

        checkOrphans: function () {
            var _this = this;
            this.findOrphans().forEach(function (bubble) {
                // if (bubble.tag == "magenta" || bubble.tag == "blue") {
                //     points += 20;
                // } else {
                //     points += 10;
                // }
                _this.removeBubble(bubble, 'removeOnly');
            });
        },

        getRemaining: function () {
            var remaining = [];
            for (var row = 0; row < this.grid.length; row++) {
                for (var col = 0; col < this.grid[row].length; col++) {
                    var bubble = this.getBubbleAt(row, col);
                    if (bubble) {
                        remaining.push(bubble);
                    }
                }
            }
            return remaining;
        },

        getNextBubbleTag: function (remaining) {
            var tag, diff = [], remaining = remaining || this.getRemaining();
            remaining.forEach(function (bubble) {
                if (diff.indexOf(bubble.tag) === -1) {
                    diff.push(bubble.tag);
                }
            });

            if (diff.length <= 2) {
                return diff[Utils.getRandomInt(0, diff.length - 1)];
            }

            BubbleShoot.Bubble.getRandomSprite();
        },

        getGridMetaData: function () {
            var grid = [];
            for (var row = 0; row < this.grid.length; row++) {
                grid[row] = [];
                for (var col = 0; col < this.grid[row].length; col++) {
                    var bubble = this.getBubbleAt(row, col);
                    grid[row][col] = bubble ? bubble.getMetaData() : bubble;
                }
            }
            return grid;
        },

        getMetaData: function () {
            return {
                x: this.x,
                y: this.y,
                width: this.width,
                height: this.height,
                side: this.side,
                grid: this.getGridMetaData(),
            }
        },
        returnPoints: function () {
            return points;
        },
        secondsToTime(s) {

            function addZ(n) {
                return (n < 10 ? '0' : '') + n;
            }

            var ms = s % 1000;
            s = (s - ms) / 1000;
            var secs = s % 60;
            s = (s - secs) / 60;
            var mins = s % 60;
            var hrs = (s - mins) / 60;

            return addZ(hrs) + ':' + addZ(mins) + ':' + addZ(secs) + '.' + addZ(ms);
        },
        savePoints: function (timex) {
            //ajaxsaso
            if (BubbleShoot.deploy == "produccion") {

                let newPoints = points;
                var time = this.secondsToTime(timex);
                console.log(points + " - " + BubbleShoot.UI.infoUsuarioAPI.pointsOld);

                if (points > BubbleShoot.UI.infoUsuarioAPI.pointsOld) {

                    console.log("SEND POINTS");
                    // this.game.global.dataUserSet(JSON.stringify(infoUsuario));
                    var params = "points=" + newPoints + "&time=" + time;
                    var http = new XMLHttpRequest();
                    if (BubbleShoot.UI.reg == 1) {
                        var url = "https://ddbdev.co/chesterbubbleAPI/public/ranking/" + BubbleShoot.UI.infoUsuarioAPI.idAPI;
                    } else {
                        var url = "https://ddbdev.co/chesterbubbleAPI2/public/ranking/" + BubbleShoot.UI.infoUsuarioAPI.idAPI;

                    }
                    http.open("PUT", url, true);
                    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

                    http.onreadystatechange = function () {//Call a function when the state changes.
                        if (http.status == 200) {
                            if (http.readyState == 4) {
                                console.log(http.responseText);
                                BubbleShoot.UI.infoUsuarioAPI.pointsOld = newPoints;
                            }
                        }
                    }

                    try {
                        http.send(params);
                        points = 0;
                        contadorShoots = 0;
                        return true;
                    } catch (error) {
                        console.log(error);
                        return false;


                    }
                }
            } else {
                points = 0;
                contadorShoots = 0;
                return true;
                console.log("SEND POINTS");
            }

        }

    };

    exports.Board = Board;

})(BubbleShoot);
