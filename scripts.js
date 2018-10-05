(function (exports) {

    var BubbleShoot = exports.BubbleShoot = {

        MODES: {
            SINGLEPLAYER: 'singleplayer'
        },
        deploy: "local",
        PLAYER_SIDE_TOP: 'top',
        PLAYER_SIDE_BOTTOM: 'bottom',

        BUBBLE_STATE_ON_BOARD: 1,
        BUBBLE_STATE_FIRING: 3,
        BUBBLE_STATE_POPPING: 4,
        points: 0,
        debug: false,
        newline: 0,
        Service: {}

    };
})(this.window || this);

(function (exports) {

    /**
     * greatest common divisor 
     * For example, a 1024x768 monitor has a GCD of 256. 
     * When you divide both values by that you get 4x3 or 4:3.
     */
    function gcd(a, b) {
        return b == 0 ? a : gcd(b, a % b);
    }

    var width = screen.width,
        height = screen.height;

    // detect aspect ratio from screen
    var divisor = gcd(width, height);
    exports.aspectRatio = [width / divisor, height / divisor];
})(BubbleShoot);

(function (exports) {

    /**
     * @return string
     */
    function generateUUID() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function degreesToRadians(degrees) {
        return degrees * Math.PI / 180;
    }

    function radiansToDegrees(radians) {
        return radians * 180 / Math.PI;
    }

    /**
     * get average
     */
    var mean = function () {

        // cache 
        function addLast(prev, current) {
            return prev + current;
        }

        return function (arr) {
            return arr.reduce(addLast, 0) / arr.length;
        };
    }();

    function createRect(width, height, color) {
        var bmd = BubbleShoot.game.add.bitmapData(width, height);

        bmd.ctx.beginPath();
        bmd.ctx.rect(0, 0, width, height);
        bmd.ctx.fillStyle = color;
        bmd.ctx.fill();
        bmd.ctx.closePath();
        return bmd;
    }

    function createButton(data) {}

    /**
     * Implements SQL style multi-key asc/desc sorting of object arrays
     * Author: Fil Baumanis ( @unfail, @bitless )
     * @param objarr array of objects
     * @param keys object specifying keys, {KEY1:"asc", "KEY2:"desc", KEY3:"desc"}, also {KEYX:"skip"} for fun
     * @returns array of objects, sorted
     */
    var keySort = function () {

        // from James Coglan/Jeff Atwood's answers at
        // https://stackoverflow.com/questions/5223/length-of-javascript-object-ie-associative-array
        var obLen = function (obj) {
            var size = 0,
                key = 0;
            for (key in obj) {
                if (obj.hasOwnProperty(key)) size++;
            }
            return size;
        };

        // avoiding using Object.keys because i guess did it have IE8 issues?
        // else var obIx = fucntion(obj, ix){ return Object.keys(obj)[ix]; } or
        // whatever
        var obIx = function (obj, ix) {
            var size = 0,
                key = 0;
            for (key in obj) {
                if (obj.hasOwnProperty(key)) {
                    if (size == ix) return key;
                    size++;
                }
            }
            return false;
        };

        var keySort = function (a, b, d) {
            d = d !== null ? d : 1;
            // a = a.toLowerCase(); // this breaks numbers
            // b = b.toLowerCase();
            a = isNum(a) ? a * 1 : a.toLowerCase(); // restore numbers
            b = isNum(b) ? b * 1 : b.toLowerCase();
            if (a == b) return 0;
            return a > b ? 1 * d : -1 * d;
        };

        var isNum = function (v) {
            return !isNaN(parseFloat(v)) && isFinite(v);
        };

        return function (objarr, keys) {

            // not sure what we want to do if no keys provided. 
            // use obIx0 on a member?
            keys = keys || {};

            var KL = obLen(keys);

            // as yet poorly defined -- maybe sort on 
            if (!KL) return objarr.sort(keySort);

            for (var k in keys) {
                // asc unless desc or skip
                keys[k] = keys[k] == 'desc' || keys[k] == -1 ? -1 : keys[k] == 'skip' || keys[k] === 0 ? 0 : 1;
            }

            objarr.sort(function (a, b) {
                var sorted = 0,
                    ix = 0;

                while (sorted === 0 && ix < KL) {
                    var k = obIx(keys, ix);
                    if (k) {
                        var dir = keys[k];
                        sorted = keySort(a[k], b[k], dir);
                        ix++;
                    }
                }
                return sorted;
            });
            return objarr;
        };
    }();

    var removeAccents = function () {

        var changes = [{ 'base': 'A', 'letters': /[\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F]/g }, { 'base': 'AA', 'letters': /[\uA732]/g }, { 'base': 'AE', 'letters': /[\u00C6\u01FC\u01E2]/g }, { 'base': 'AO', 'letters': /[\uA734]/g }, { 'base': 'AU', 'letters': /[\uA736]/g }, { 'base': 'AV', 'letters': /[\uA738\uA73A]/g }, { 'base': 'AY', 'letters': /[\uA73C]/g }, { 'base': 'B', 'letters': /[\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181]/g }, { 'base': 'C', 'letters': /[\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E]/g }, { 'base': 'D', 'letters': /[\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779]/g }, { 'base': 'DZ', 'letters': /[\u01F1\u01C4]/g }, { 'base': 'Dz', 'letters': /[\u01F2\u01C5]/g }, { 'base': 'E', 'letters': /[\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E]/g }, { 'base': 'F', 'letters': /[\u0046\u24BB\uFF26\u1E1E\u0191\uA77B]/g }, { 'base': 'G', 'letters': /[\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E]/g }, { 'base': 'H', 'letters': /[\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D]/g }, { 'base': 'I', 'letters': /[\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197]/g }, { 'base': 'J', 'letters': /[\u004A\u24BF\uFF2A\u0134\u0248]/g }, { 'base': 'K', 'letters': /[\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2]/g }, { 'base': 'L', 'letters': /[\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780]/g }, { 'base': 'LJ', 'letters': /[\u01C7]/g }, { 'base': 'Lj', 'letters': /[\u01C8]/g }, { 'base': 'M', 'letters': /[\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C]/g }, { 'base': 'N', 'letters': /[\u004E\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4]/g }, { 'base': 'NJ', 'letters': /[\u01CA]/g }, { 'base': 'Nj', 'letters': /[\u01CB]/g }, { 'base': 'O', 'letters': /[\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u00D6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C]/g }, { 'base': 'OI', 'letters': /[\u01A2]/g }, { 'base': 'OO', 'letters': /[\uA74E]/g }, { 'base': 'OU', 'letters': /[\u0222]/g }, { 'base': 'P', 'letters': /[\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754]/g }, { 'base': 'Q', 'letters': /[\u0051\u24C6\uFF31\uA756\uA758\u024A]/g }, { 'base': 'R', 'letters': /[\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782]/g }, { 'base': 'S', 'letters': /[\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784]/g }, { 'base': 'T', 'letters': /[\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786]/g }, { 'base': 'TZ', 'letters': /[\uA728]/g }, { 'base': 'U', 'letters': /[\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u00DC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244]/g }, { 'base': 'V', 'letters': /[\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245]/g }, { 'base': 'VY', 'letters': /[\uA760]/g }, { 'base': 'W', 'letters': /[\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72]/g }, { 'base': 'X', 'letters': /[\u0058\u24CD\uFF38\u1E8A\u1E8C]/g }, { 'base': 'Y', 'letters': /[\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE]/g }, { 'base': 'Z', 'letters': /[\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762]/g }, { 'base': 'a', 'letters': /[\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250]/g }, { 'base': 'aa', 'letters': /[\uA733]/g }, { 'base': 'ae', 'letters': /[\u00E6\u01FD\u01E3]/g }, { 'base': 'ao', 'letters': /[\uA735]/g }, { 'base': 'au', 'letters': /[\uA737]/g }, { 'base': 'av', 'letters': /[\uA739\uA73B]/g }, { 'base': 'ay', 'letters': /[\uA73D]/g }, { 'base': 'b', 'letters': /[\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253]/g }, { 'base': 'c', 'letters': /[\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184]/g }, { 'base': 'd', 'letters': /[\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A]/g }, { 'base': 'dz', 'letters': /[\u01F3\u01C6]/g }, { 'base': 'e', 'letters': /[\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD]/g }, { 'base': 'f', 'letters': /[\u0066\u24D5\uFF46\u1E1F\u0192\uA77C]/g }, { 'base': 'g', 'letters': /[\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F]/g }, { 'base': 'h', 'letters': /[\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265]/g }, { 'base': 'hv', 'letters': /[\u0195]/g }, { 'base': 'i', 'letters': /[\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131]/g }, { 'base': 'j', 'letters': /[\u006A\u24D9\uFF4A\u0135\u01F0\u0249]/g }, { 'base': 'k', 'letters': /[\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3]/g }, { 'base': 'l', 'letters': /[\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747]/g }, { 'base': 'lj', 'letters': /[\u01C9]/g }, { 'base': 'm', 'letters': /[\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F]/g }, { 'base': 'n', 'letters': /[\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5]/g }, { 'base': 'nj', 'letters': /[\u01CC]/g }, { 'base': 'o', 'letters': /[\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275]/g }, { 'base': 'oi', 'letters': /[\u01A3]/g }, { 'base': 'ou', 'letters': /[\u0223]/g }, { 'base': 'oo', 'letters': /[\uA74F]/g }, { 'base': 'p', 'letters': /[\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755]/g }, { 'base': 'q', 'letters': /[\u0071\u24E0\uFF51\u024B\uA757\uA759]/g }, { 'base': 'r', 'letters': /[\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783]/g }, { 'base': 's', 'letters': /[\u0073\u24E2\uFF53\u00DF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B]/g }, { 'base': 't', 'letters': /[\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787]/g }, { 'base': 'tz', 'letters': /[\uA729]/g }, { 'base': 'u', 'letters': /[\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289]/g }, { 'base': 'v', 'letters': /[\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C]/g }, { 'base': 'vy', 'letters': /[\uA761]/g }, { 'base': 'w', 'letters': /[\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73]/g }, { 'base': 'x', 'letters': /[\u0078\u24E7\uFF58\u1E8B\u1E8D]/g }, { 'base': 'y', 'letters': /[\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF]/g }, { 'base': 'z', 'letters': /[\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763]/g }];

        return function (str) {
            for (var i = 0; i < changes.length; i++) {
                str = str.replace(changes[i].letters, changes[i].base);
            }
            return str;
        };
    }();

    exports.Utils = {
        mean: mean,
        createRect: createRect,
        createButton: createButton,
        getRandomInt: getRandomInt,
        generateUUID: generateUUID,
        radiansToDegrees: radiansToDegrees,
        degreesToRadians: degreesToRadians,
        keySort: keySort,
        removeAccents: removeAccents
    };
})(this.window || this);

(function (exports) {

    function Background(servieName) {
        this.queue = {};

        if (Worker) {
            this.worker = new Worker('src/js/ai/service.' + servieName + '.js');
        } else {
            alert('Error: Worker not suported!');
            // this.worker = new BubbleShoot.Service.FakeWorker();
        }

        var _this = this;
        this.worker.addEventListener('message', function (event) {
            var data = event.data,
                queue = _this.queue[data.id];
            if (_this.queue[data.id]) {
                _this.queue[data.id].done.apply(queue.context, data.args);
                delete _this.queue[data.id];
            }
        });
    }

    Background.prototype.execute = function (command, args, done, context) {
        var id = Utils.generateUUID();
        if (done) {
            this.queue[id] = { done: done, context: context || null };
        }
        this.worker.postMessage({ id: id, command: command, args: args });
    };

    exports.Background = Background;
})(BubbleShoot);

;(function (exports) {
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
    };

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

            life1.y = BubbleShoot.game.world.height * 0.95 - life1.height * 0.95;
            life1.x = BubbleShoot.game.world.width / 2 - life1.width / 2 + -220;

            life2.y = BubbleShoot.game.world.height * 0.95 - life2.height * 0.95;
            life2.x = BubbleShoot.game.world.width / 2 - life2.width / 2 + -175;

            life3.y = BubbleShoot.game.world.height * 0.95 - life3.height * 0.95;
            life3.x = BubbleShoot.game.world.width / 2 - life3.width / 2 + -130;

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
                            });
                        }, 200);
                    });
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
                        });
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
            var connected = [],
                groups = [],
                orphaned = [];

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
            var oldtag = bubble.tag;
            var search = "";
            contadorMagenta = 0;
            contadorBlue = 0;
            if (bubble.tag == "magenta") {
                contadorMagenta++;
                search = "blue";
            } else {
                contadorBlue++;

                search = "magenta";
            }

            bubble.tag = "blue";
            var groupB = this.getGroup(bubble);

            bubble.tag = "magenta";
            var groupM = this.getGroup(bubble);

            bubble.tag = oldtag;

            if (bubble.tag == "magenta" || bubble.tag == "blue") {

                if (groupB.list.length >= 3) {

                    groupx.list = [];
                    groupB.list.forEach(function (bubbley) {

                        var oldTag = bubbley.tag;
                        bubbley.tag = search;
                        var entities = _this.getGroup(bubbley);
                        bubbley.tag = "blue";
                        var arrayx = entities.list;
                        if (arrayx.length >= 2) {
                            arrayx.forEach(function (item) {
                                _this.addBubblex(item, groupx.list);
                            });
                        }
                    });

                    if (contadorMagenta != 0 && contadorBlue != 0) {

                        BubbleShoot.animations.purpleX2.visible = true;
                        var start = BubbleShoot.animations.purpleX2.animations.add('explode');

                        BubbleShoot.animations.purpleX2.animations.play('explode', 30, false);

                        start.onComplete.add(function () {
                            BubbleShoot.animations.purpleX2.visible = false;
                        });

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
                        var entities = _this.getGroup(bubbley);
                        bubbley.tag = oldTag;
                        var arrayx = entities.list;
                        if (arrayx.length >= 2) {
                            arrayx.forEach(function (item) {
                                _this.addBubblex(item, groupx.list);
                            });
                        }
                    });

                    if (contadorMagenta != 0 && contadorBlue != 0) {

                        BubbleShoot.animations.purpleX2.visible = true;
                        var start = BubbleShoot.animations.purpleX2.animations.add('explode');

                        BubbleShoot.animations.purpleX2.animations.play('explode', 30, false);

                        start.onComplete.add(function () {
                            BubbleShoot.animations.purpleX2.visible = false;
                        });

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
                if (group.list.length < 3) {} else {
                    BubbleShoot.sound.explosion.play();
                    contadorShoots = 0;
                    if (group.list[0].tag == "magenta") {
                        BubbleShoot.animations.sabor.visible = true;
                        var start = BubbleShoot.animations.sabor.animations.add('explode');

                        BubbleShoot.animations.sabor.animations.play('explode', 30, false);

                        start.onComplete.add(function () {
                            BubbleShoot.animations.sabor.visible = false;
                        });
                    } else if (group.list[0].tag == "blue") {
                        BubbleShoot.animations.mentol.visible = true;
                        var start = BubbleShoot.animations.mentol.animations.add('explode');

                        BubbleShoot.animations.mentol.animations.play('explode', 30, false);

                        start.onComplete.add(function () {
                            BubbleShoot.animations.mentol.visible = false;
                        });
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
                });
            } else if (c == 1) {
                this.lifes.children.forEach(function (life, index) {
                    console.log(index);
                    if (index == 0 || index == 1) {
                        life.loadTexture("bolaon");
                    } else {
                        life.loadTexture("bolaoff");
                    }
                });
            } else if (c == 2) {
                this.lifes.children.forEach(function (life, index) {
                    if (index == 0) {
                        life.loadTexture("bolaon");
                    } else {
                        life.loadTexture("bolaoff");
                    }
                });
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
            var tag,
                diff = [],
                remaining = remaining || this.getRemaining();
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
                grid: this.getGridMetaData()
            };
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

                    http.onreadystatechange = function () {
                        //Call a function when the state changes.
                        if (http.status == 200) {
                            if (http.readyState == 4) {
                                console.log(http.responseText);
                                BubbleShoot.UI.infoUsuarioAPI.pointsOld = newPoints;
                            }
                        }
                    };

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

(function (exports) {

    var spriteNames = ['green', 'blue', 'yellow', 'red', 'magenta', 'orange'];

    function Bubble(player, row, col, spriteName) {
        Phaser.Sprite.call(this, BubbleShoot.game, 0, 0, 'sprites', spriteName || Bubble.getRandomSprite());
        BubbleShoot.entities.bubbles.add(this);

        this.player = player;

        // this.body.collideWorldBounds = true;
        // this.body.bounce.setTo(1);

        this.tag = this.frameName;

        this.scale.setTo(BubbleShoot.UI.bubble.scale);
        this.anchor.setTo(0.5);
        this.row = row;
        this.col = col;
        this.radius = BubbleShoot.UI.bubble.radius;
        var chispa = BubbleShoot.game.make.sprite(-250, -250, 'chispa-' + this.frameName);
        chispa.visible = false;
        this.addChild(chispa);
    }

    Bubble.prototype = Object.create(Phaser.Sprite.prototype);
    Bubble.prototype.constructor = Bubble;

    Bubble.prototype.getGridByPosition = function (position) {
        var topSide = this.player.side == BubbleShoot.PLAYER_SIDE_TOP;
        var board = this.player.board;
        var position = position || this.position;
        var separatorHeight = BubbleShoot.UI.board.separatorHeight + 1;

        var row = Math.floor((position.y - board.y) / BubbleShoot.UI.board.rowHeight);

        if (topSide) {
            var row = Math.floor((board.height - position.y) / BubbleShoot.UI.board.rowHeight);
        }

        var marginLeft = row % 2 == 0 ? BubbleShoot.UI.bubble.radius : BubbleShoot.UI.bubble.radius * 2;
        var col = (position.x - board.x + marginLeft) / BubbleShoot.UI.bubble.size;

        col = Math.round(col);

        if (col > BubbleShoot.UI.maxCols) {
            col = BubbleShoot.UI.maxCols;
        }

        if (row % 2 == 1) {
            col -= 2;
        }
        if (row % 2 == 0) {
            col -= 1;
        }
        return { row: row, col: col };
    };

    Bubble.prototype.fixGridByPosition = function (position) {
        var grid = this.getGridByPosition(position);
        this.row = grid.row;
        this.col = grid.col;
    };
    Bubble.prototype.savelength = function (length) {
        this.length = length;
    };

    Bubble.prototype.getPositionByGrid = function (grid) {
        var grid = grid || { row: this.row, col: this.col };

        if (grid.row === undefined || grid.col === undefined) {
            console.error('getPositionByGrid', grid.row, grid.col);
            return false;
        }

        var topSide = this.player.side == BubbleShoot.PLAYER_SIDE_TOP;
        var separatorHeight = BubbleShoot.UI.board.separatorHeight + 1;
        var x = this.player.board.x;
        var y = this.player.board.height + BubbleShoot.UI.bubble.radius;
        if (grid.row % 2 == 0) {
            x += BubbleShoot.UI.bubble.radius;
        } else {
            x += BubbleShoot.UI.bubble.radius * 2;
        }

        if (topSide) {
            y -= (grid.row + 1) * BubbleShoot.UI.board.rowHeight + separatorHeight;
        } else {
            y += grid.row * BubbleShoot.UI.board.rowHeight + separatorHeight * 1.5;
        }

        return { x: x + grid.col * BubbleShoot.UI.bubble.size, y: y };
    };

    Bubble.prototype.fixPositionByGrid = function (grid) {
        var position = this.getPositionByGrid(grid);
        this.position.setTo(position.x, position.y);

        this.createDebugText();
    };

    Bubble.prototype.move = function (steps, done, attach) {
        BubbleShoot.fire = true;
        console.log("Fire");

        BubbleShoot.sound.shoot.play();
        if (false === Array.isArray(steps)) {
            return console.error('invalid parameters, expected Array of steps');
        }

        this.state = BubbleShoot.BUBBLE_STATE_FIRING;
        var attach = attach == undefined ? true : attach;
        var throwAnim = BubbleShoot.game.add.tween(this);

        steps.forEach(function (step) {
            throwAnim.to({ x: step.position.x, y: step.position.y }, step.duration);
        });

        if (attach) {
            var position = steps.pop().position;
            this.fixGridByPosition(position);
            this.player.board.addBubble(this);
            this._endPosition = this.getPositionByGrid();
        }

        throwAnim.onComplete.add(function () {

            if (attach) {
                this.state = BubbleShoot.BUBBLE_STATE_ON_BOARD;
                this.fixPositionByGrid();
                delete this._endPosition;
            }
            if (done) {
                done(this);
            }
        }.bind(this));

        throwAnim.start();
    };

    Bubble.prototype.getMetaData = function () {
        return {
            tag: this.tag,
            radius: this.radius,
            row: this.row,
            col: this.col,
            x: this.x,
            y: this.y,
            position: {
                x: this.x,
                y: this.y
            },
            _endPosition: this._endPosition,
            state: this.state
        };
    };

    Bubble.prototype.createDebugText = function () {
        if (this.tag == "magenta" || this.tag == "blue") {
            this.points = 20;
        } else {
            this.points = 10;
        }

        if (!BubbleShoot.debug) {
            return false;
        }

        if (!this.debugText) {
            var style = { font: "50px Arial", fill: "#ffffff" };
            var text = BubbleShoot.game.add.text(0, 0, '', style);
            text.anchor.setTo(0.5);
            this.addChild(text);
            this.debugText = text;
        }

        if (this.row == undefined || this.col == undefined) {
            return this.debugText.setText('');
        }

        this.debugText.setText(String(this.row) + ' - ' + String(this.col));
    };

    Bubble.RADIUS = 177 / 2; //189/2;
    Bubble.SIZE = Bubble.RADIUS * 2;

    Bubble.create = function (player, row, col, spriteName) {
        var bubble;
        var spriteName = spriteName;
        if (bubble) {
            bubble.revive();
            bubble.row = row;
            bubble.col = col;
            bubble.frameName = spriteName;
            bubble.tag = spriteName;
            bubble.player = player;
        }

        if (!bubble) {
            bubble = new Bubble(player, row, col, spriteName);
        }

        bubble.createDebugText();

        return bubble;
    };

    Bubble.getRandomSprite = function () {
        return spriteNames[Utils.getRandomInt(0, spriteNames.length - 1)];
    };

    exports.Bubble = Bubble;
})(BubbleShoot);

;(function (exports) {

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
    };

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
            this.changeAlterBubble(tagOld);
        } else {
            BubbleShoot.player.shooter._nextLoaded.push(BubbleShoot.Bubble.getRandomSprite());
            var tagOld = BubbleShoot.player.shooter.bubble.tag;
            BubbleShoot.player.shooter.bubble.tag = this._nextLoaded.shift();
            BubbleShoot.player.shooter.bubble.loadTexture("sprites", BubbleShoot.player.shooter.bubble.tag);
            this._nextLoaded.push(tagOld);
            console.log(tagOld);
            this.changeAlterBubble(tagOld);
        }
    };
    Shooter.prototype.changeAlterBubble = function (tag) {
        BubbleShoot.alterBubble.loadTexture("sprites", tag);
        BubbleShoot.alterBubble.tag = tag;
    };

    Shooter.prototype.createAlterBubble = function () {
        if (this._nextLoaded.length) {
            BubbleShoot.alterBubble = BubbleShoot.Bubble.create(this.player, undefined, undefined, this._nextLoaded[0]);
            BubbleShoot.alterBubble.scale.setTo(0.3);
            BubbleShoot.alterBubble.position.set(BubbleShoot.game.world.centerX - 70, BubbleShoot.game.height - 150);
        } else {

            BubbleShoot.player.shooter._nextLoaded.push(BubbleShoot.Bubble.getRandomSprite());
            BubbleShoot.alterBubble = BubbleShoot.Bubble.create(this.player, undefined, undefined, BubbleShoot.player.shooter._nextLoaded[0]);
            BubbleShoot.alterBubble.scale.setTo(0.3);
            BubbleShoot.alterBubble.position.set(BubbleShoot.game.world.centerX - 70, BubbleShoot.game.height - 150);
        }
    };
    Shooter.prototype.getBitmapData = function () {
        if (!this.bmd) {
            this.bmd = BubbleShoot.game.add.bitmapData(this.player.board.width, BubbleShoot.UI.height);

            this.BitmapSprite = BubbleShoot.game.add.sprite(this.player.board.x, this.player.board.y, this.bmd);

            BubbleShoot.entities.add(this.BitmapSprite);
        }
        return this.bmd;
    };

    Shooter.prototype.showTrajectory = function (bolean) {

        var trajectory = BubbleShoot.Collision.trajectory(this.position, this.rotation, this.player.board);
        if (bolean) {
            this.BitmapSprite.visible = true;
        } else {
            this.BitmapSprite.visible = false;
        }
        var bmd = this.getBitmapData();

        var context = bmd.context;
        var board = this.player.board;
        bmd.clear();

        context.beginPath();
        context.strokeStyle = 'white';
        context.lineWidth = 10;
        //context.setLineDash([10]);
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
        context.globalAlpha = 0.5;
        context.stroke();
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
    };
    Shooter.prototype.reload = function (force, nextTag) {
        if (this.bubble || this._loading) {
            return false;
        }

        this._loading = true;
        this._loaded = false;

        var bubble = BubbleShoot.Bubble.create(this.player, undefined, undefined, this._nextLoaded.shift());

        bubble.anchor.setTo(0.5);
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
    };

    Shooter.prototype.getMetaData = function () {
        return {
            x: this.x,
            y: this.y,
            position: {
                x: this.x,
                y: this.y
            },
            rotation: this.rotation
        };
    };

    exports.Shooter = Shooter;
})(BubbleShoot);

;(function (exports) {
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
                board: this.board.getMetaData()
            };
        },

        fire: function (done, trajectory) {
            if (BubbleShoot.player.board.grid.length > 12) {
                BubbleShoot.player.board.grid[12].map(function (item) {
                    if (item != undefined) {
                        lose = true;
                    }
                });
            }
            var fire = function (bubble) {
                var win = false,
                    lose = false;

                // lose
                if (this.side == BubbleShoot.PLAYER_SIDE_BOTTOM && bubble.y + bubble.radius > this.shooter.y - this.shooter.height / 2 || this.side == BubbleShoot.PLAYER_SIDE_TOP && bubble.y - bubble.radius < this.shooter.y + this.shooter.height / 2) {
                    lose = true;
                }

                if (!lose) {
                    this.board.checkMatches(bubble);
                    this.board.checkOrphans();

                    var remaining = this.board.getRemaining();

                    console.log("Choca");

                    setTimeout(function () {
                        BubbleShoot.textPuntos.text = BubbleShoot.player.board.returnPoints();
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
            };
            this.shooter.fire(fire.bind(this), trajectory);
            this.shooter.reload();
            BubbleShoot.player.shooter._nextLoaded.push(BubbleShoot.Bubble.getRandomSprite());

            this.shooter.changeAlterBubble(BubbleShoot.player.shooter._nextLoaded[0]);
        }
    };

    exports.Player = Player;
})(BubbleShoot);

(function (exports) {

    var Collision = {

        config: {
            gameWidth: 0,
            bubbleRadius: 0,
            trajectory: {
                distance: 0,
                duration: 600
            }
        },

        circleCollision: function (circleFirst, circleSecond, cutback) {
            var distance = this.circleCollisionDistance(circleFirst.position, circleSecond.position);
            var radius = circleFirst.radius + circleSecond.radius;

            if (cutback) {
                radius -= circleFirst.radius * cutback + circleSecond.radius * cutback;
            }
            return distance < radius;
        },

        circleCollisionDistance: function (circleFirst, circleSecond) {
            var dx = circleFirst.x - circleSecond.x;
            var dy = circleFirst.y - circleSecond.y;
            return Math.sqrt(dx * dx + dy * dy);
        },

        bubbleIntersection: function (bubble, grid) {

            for (var row = 0; row < grid.length; row++) {

                var cols = grid[row];

                if (!cols) {
                    continue;
                }

                for (var col = 0; col < cols.length; col++) {

                    var curBubble = cols[col];

                    if (!curBubble) {
                        continue;
                    }

                    var curBubblePosition = curBubble.position;
                    if (curBubble.state == BubbleShoot.BUBBLE_STATE_FIRING) {
                        curBubblePosition = curBubble._endPosition;
                    }

                    var collision = Collision.circleCollision({ position: bubble.position, radius: bubble.radius }, { position: curBubblePosition, radius: curBubble.radius }, 0.1);

                    if (collision) {
                        return curBubble;
                    }
                }
            }

            return false;
        }

    };

    // module trajectory
    (function (exports) {

        // step distance/duration

        function step(position, dx, dy, board, stepIteration) {

            var safeLimit = 2000;
            var radius = Collision.config.bubbleRadius;

            var topSide = board.side == BubbleShoot.PLAYER_SIDE_TOP;

            var limitRight = Collision.config.gameWidth - radius;
            var limitLeft = radius;

            var limitTop = board.y + radius;

            if (topSide) {
                limitTop = board.y + board.height - radius;
            }

            var stepIteration = stepIteration ? ++stepIteration : 1;

            var collideWorldBounds = false;
            var bubbleCollision = false;

            position.x += dx;
            position.y -= dy;

            // top wall 
            if (!topSide && position.y <= limitTop) {
                position.y = limitTop;
                collideWorldBounds = 'top';
            }

            if (topSide && position.y >= limitTop) {
                position.y = limitTop;
                collideWorldBounds = 'top';
            }

            // left wall
            if (position.x <= limitLeft) {
                position.x = limitLeft;
                collideWorldBounds = 'left';
            }

            // right wall
            if (position.x >= limitRight) {
                position.x = limitRight;
                collideWorldBounds = 'right';
            }

            // bug?
            if (stepIteration > safeLimit) {
                console.error('Collision.Trajectory.step atingiu limit de iteracoes');
                return position;
            }

            bubbleCollision = Collision.bubbleIntersection({ position: position, radius: Collision.config.bubbleRadius }, board.grid);

            if (collideWorldBounds || bubbleCollision) {

                var distToCollision = stepIteration * Collision.config.trajectory.distance;
                // var duration = Math.round( Collision.config.trajectory.duration * distToCollision / 1000);

                var speed = 1500;
                var delta = 1000;
                var duration = Math.round(distToCollision / speed * delta);

                return {
                    position: { x: position.x, y: position.y },
                    duration: duration,

                    collision: {
                        dist: distToCollision,
                        worldBounds: collideWorldBounds,
                        bubble: bubbleCollision
                    }
                };
            }

            return step(position, dx, dy, board, stepIteration);
        }

        function trajectory(bubble, angle, board) {
            var steps = [];

            var position = { x: bubble.x, y: bubble.y };
            var safeLimit = 2000;
            var dx = Math.sin(angle) * Collision.config.trajectory.distance;
            var dy = Math.cos(angle) * Collision.config.trajectory.distance;

            var steps = [];
            var iteration = 0;

            while (true) {

                iteration++;

                var currentStep = step(position, dx, dy, board);

                if (currentStep.collision.worldBounds) {
                    dx *= -1;
                }

                currentStep.angle = angle;
                steps.push(currentStep);

                if (iteration > safeLimit) {
                    console.error('while limit');
                    break;
                }

                if (!currentStep || currentStep.collision.bubble || currentStep.collision.worldBounds == 'top') {
                    break;
                }
            }

            return steps;
        }

        exports.trajectory = trajectory;
    })(Collision);

    exports.Collision = Collision;
})(BubbleShoot);

(function (exports) {

    var maxRows = 4;
    var maxCols = 9;

    var colWidth = BubbleShoot.Bubble.SIZE;
    var rowHeight = BubbleShoot.Bubble.SIZE;

    var screenWidth = Math.min(window.innerWidth, window.innerHeight);
    var screenHeight = Math.min(window.innerWidth, screenWidth * 2);

    var screenWidth = 586;
    var screenHeight = 1024;

    // 16:9 640x360
    // screenWidth = 360; screenHeight = 640;

    var width = screenWidth;
    var height = screenHeight;

    var boardWidht = screenWidth;
    var boardHeight = 0;

    // var scale = Math.min((boardWidht/colWidth/maxCols), (boardHeight/rowHeight/maxRows));
    // var bubbleScale = Utils.mean([boardWidht/colWidth/maxCols, boardHeight/rowHeight/maxRows]);
    var bubbleScale = boardWidht / colWidth / maxCols;
    var bubbleSize = BubbleShoot.Bubble.SIZE * bubbleScale;
    var points = 0;
    var UI = {
        gameApiInst: {},
        contadorSlides: 0,
        background: '#fff',
        width: width,
        height: height,

        maxRows: maxRows,
        maxCols: maxCols,

        bubble: {
            scale: bubbleScale,
            size: bubbleSize,
            radius: bubbleSize / 2
        },

        board: {
            width: boardWidht,
            height: boardHeight,
            rowHeight: bubbleSize - 9,
            separatorHeight: 2
        },

        createComojugar: function () {
            this.modal = BubbleShoot.game.add.sprite(0, 0, 'modal');
            this.modal.alpha = 0;
            var style = {
                font: "90px din_condensedbold",
                fill: "#fff",
                align: "center", // the alignment of the text is independent of the bounds, try changing to 'center' or 'right'
                boundsAlignH: "right",
                boundsAlignV: "middle",
                wordWrap: true,
                wordWrapWidth: 300
            };
            this.mecGroup = BubbleShoot.game.add.group();

            this.modal.scale.setTo(0.7);
            this.modal.y = BubbleShoot.game.world.height / 2 - this.modal.height / 2;
            this.modal.x = BubbleShoot.game.world.width / 2 - this.modal.width / 2;

            var mec2 = BubbleShoot.game.add.sprite(0, 0, 'mec2');
            var mec6 = BubbleShoot.game.add.sprite(0, 0, 'mec6');
            var mec8 = BubbleShoot.game.add.sprite(0, 0, 'mec8');
            var mec10 = BubbleShoot.game.add.sprite(0, 0, 'mec10');

            var animMec2 = BubbleShoot.game.add.sprite(0, 0, 'animMec2');
            var animMec2P = BubbleShoot.game.make.sprite(0, 0, 'animMec2P');
            animMec2P.visible = false;

            var animMec3 = BubbleShoot.game.add.sprite(0, 0, 'animMec3');
            var animMec3P = BubbleShoot.game.make.sprite(0, 0, 'animMec3P');
            animMec3P.visible = false;

            var animMec4 = BubbleShoot.game.add.sprite(0, 0, 'animMec4');
            var animMec4P = BubbleShoot.game.make.sprite(0, 0, 'animMec4P');
            animMec4P.visible = false;

            var animMec5 = BubbleShoot.game.add.sprite(0, 0, 'animMec4');
            var animMec5P = BubbleShoot.game.make.sprite(0, 0, 'animMec4P');
            animMec5P.visible = false;
            this.cerrar = BubbleShoot.game.add.button(0, 0, 'icocerrar');

            var generalPositionMecY = BubbleShoot.game.world.height / 2 - mec2.height / 2;
            var generalPositionMecX = BubbleShoot.game.world.width / 2 - mec2.width / 2;

            mec2.position.set(generalPositionMecX, generalPositionMecY);
            mec6.position.set(generalPositionMecX, generalPositionMecY);
            mec8.position.set(generalPositionMecX, generalPositionMecY);
            mec10.position.set(generalPositionMecX, generalPositionMecY);

            animMec2.position.set(generalPositionMecX + 60, generalPositionMecY + 180.5);
            animMec2P.position.set(generalPositionMecX + 60, generalPositionMecY + 180.5);

            mec2.addChild(animMec2);
            mec2.addChild(animMec2P);

            animMec3.position.set(generalPositionMecX + 60, generalPositionMecY + 180.5);
            animMec3P.position.set(generalPositionMecX + 60, generalPositionMecY + 180.5);

            mec6.addChild(animMec3);
            mec6.addChild(animMec3P);

            animMec4.position.set(generalPositionMecX + 60, generalPositionMecY + 180.5);
            animMec4P.position.set(generalPositionMecX + 60, generalPositionMecY + 180.5);

            mec8.addChild(animMec4);
            mec8.addChild(animMec4P);

            animMec5.position.set(generalPositionMecX + 60, generalPositionMecY + 180.5);
            animMec5P.position.set(generalPositionMecX + 60, generalPositionMecY + 180.5);

            mec10.addChild(animMec5);
            mec10.addChild(animMec5P);

            this.cerrar.position.set(BubbleShoot.game.world.width / 2 - this.cerrar.width / 2 + 210, 120);

            this.mecGroup.add(mec2);
            this.mecGroup.add(mec6);
            this.mecGroup.add(mec8);
            this.mecGroup.add(mec10);

            this.mecGroup.forEach(function (item) {
                item.visible = false;
            });
            this.contadorSlides = 0;
            this.mecGroup.children[this.contadorSlides].visible = true;
            this.contadorSlides++;

            this.modal.inputEnabled = true;
            this.modal.events.onInputDown.add(this.showSlide, this);
            this.cerrar.events.onInputDown.add(this.destroyComojugar, this);

            this.buttonJ = BubbleShoot.game.add.button(0, 0, "botonModal");
            this.buttonJ.scale.setTo(0.68);
            this.buttonJ.alpha = 0.6;
            this.buttonJ.y = BubbleShoot.game.world.height * 0.84 - this.buttonJ.height * 0.84;
            this.buttonJ.x = BubbleShoot.game.world.width / 2 - this.buttonJ.width / 2;

            style.font = "40px din_condensedbold";
            this.textd = BubbleShoot.game.add.text(0, 0, "JUGAR", style);
            this.textd.y = BubbleShoot.game.world.height * 0.835 - this.textd.height * 0.835;
            this.textd.x = BubbleShoot.game.world.width / 2 - this.textd.width / 2;

            this.buttonJ.events.onInputDown.add(function () {
                BubbleShoot.UI.clickSound();
                BubbleShoot.game.state.start('game');
            }, this);
        },
        showSlide: function () {
            if (this.contadorSlides == this.mecGroup.length) {
                this.contadorSlides = 0;
            }
            this.mecGroup.forEach(function (item) {
                item.visible = false;
            });
            this.mecGroup.children[this.contadorSlides].visible = true;

            if (this.mecGroup.children[this.contadorSlides].children.length) {
                console.log(this.mecGroup.children[this.contadorSlides].children);
                console.log("entra");
                var childrens = this.mecGroup.children[this.contadorSlides].children;
                this.animateMecanica(childrens);
            }
            this.contadorSlides++;
        },
        animateMecanica(childrens) {
            childrens[1].visible = false;
            childrens[0].visible = true;
            var anim = childrens[0].animations.add('animar');
            childrens[0].animations.play('animar', 30, false);
            var this_ = this;
            anim.onComplete.add(function () {
                childrens[0].visible = false;
                childrens[1].visible = true;
                var anim = childrens[1].animations.add('animarp');
                childrens[1].animations.play('animarp', 30, false);
                anim.onComplete.add(function () {
                    this_.animateMecanica(childrens);
                });
            });
        },
        destroyComojugar: function () {
            this.mecGroup.forEach(function (item) {
                item.kill();
            });
            this.textd.kill();
            this.buttonJ.kill();

            this.modal.kill();
            this.cerrar.kill();
            this.clickSound();
        },
        destroyMecanica: function () {
            this.modal.kill();
            this.cerrar.kill();
            this.mecanicaGroup.forEach(function (item) {
                item.kill();
            });
            this.clickSound();
        },
        createMecanica: function () {

            this.mecanicaGroup = BubbleShoot.game.add.group();
            this.modal = BubbleShoot.game.add.image(0, 0, 'backGame2');
            this.modal.inputEnabled = true;
            this.modal.events.onInputDown.add(function () {
                return false;
            }, this);
            this.modal.y = BubbleShoot.game.world.height / 2 - this.modal.height / 2;
            this.modal.x = BubbleShoot.game.world.width / 2 - this.modal.width / 2;
            this.cerrar = BubbleShoot.game.add.button(0, 0, 'icocerrar');
            this.cerrar.position.set(BubbleShoot.game.world.width / 2 - this.cerrar.width / 2 + 232, 86);
            this.cerrar.events.onInputDown.add(this.destroyMecanica, this);
            var style = {
                font: "90px din_condensedbold", fill: "#fff",
                align: "center", // the alignment of the text is independent of the bounds, try changing to 'center' or 'right'
                boundsAlignH: "right",
                boundsAlignV: "middle",
                wordWrap: true,
                wordWrapWidth: 300
            };

            style.font = "60px din_condensedbold";
            var text = BubbleShoot.game.add.text(0, 0, 'TÉRMINOS & CONDICIONES', style);
            text.y = 80;
            text.x = BubbleShoot.game.world.width / 2 - text.width / 2;
            style.font = "23px din_condensedbold";

            style.wordWrapWidth = 520;
            if (BubbleShoot.UI.reg == 1) {
                templateText = `El juego estará disponible exclusivamente para Los Propios, desde el 12 de febrero hasta el 30 de marzo de 2018
Recibirás 60 puntos la primera vez que juegues. 
Puedes jugar todas las veces que quieras para mejorar tu posición, pero solo se tendrá en cuenta para el ranking el mejor alcanzado en el menor tiempo.  
El juego tiene solamente un nivel y las cápsulas aparecerán de forma aleatoria.    
El objetivo del juego es unir 3 o más cápsulas del mismo color o crear combinaciones para obtener puntos (las cápsulas se pueden unir de forma horizontal, vertical o diagonal)
Ve al botón “¿Cómo Jugar?” en el inicio para saber cómo sumar puntos en el juego.
Si en 3 lanzamientos no logras unir cápsulas del mismo color, las cápsulas del tablero bajarán progresivamente.
Si las cápsulas del tablero llegan a la línea horizontal que está en la parte inferior de la pantalla, perderás la partida.
Si estás entre los mejores 10 puntajes de tu regional, el 30 de marzo a las 14:00, recibirás 1.000 puntos en tu cuenta www.lospropios.net.
Por ningún motivo el reconocimiento será entregado en dinero en efectivo.`;
            } else {
                templateText = `El juego estará disponible exclusivamente para Los Propios desde el 12 de febrero hasta el 30 de marzo de 2018
Recibirás 60 puntos la primera vez que juegues.
Puedes jugar todas las veces que quieras para mejorar tu posición, pero solo se tendrá en cuenta para el ranking el mejor puntaje alcanzado en el menor tiempo.
El juego tiene solamente un nivel y las cápsulas aparecerán de forma aleatoria.
El objetivo del juego es unir 3 o más cápsulas del mismo color para obtener puntos (las cápsulas se pueden unir de forma horizontal, vertical o diagonal)
Ve al botón “¿Cómo Jugar?” en el inicio para saber cómo sumar puntos en el juego.
Si en 3 lanzamientos no logras unir cápsulas del mismo color, las cápsulas del tablero bajarán progresivamente.
Si las cápsulas del tablero llegan a la linea horizontal que está en la parte inferior de la pantalla, perderás la partida.
Si estás entre los mejores 10 puntajes de tu regional el 30 de marzo a las 14:00, recibirás 1.500 puntos en tu cuenta www.lospropios.net.
Por ningún motivo el reconocimiento será entregado en dinero en efectivo.`;
            }

            var text2 = BubbleShoot.game.add.text(0, 0, templateText, style);
            text2.y = BubbleShoot.game.world.height * 0.8 - text2.height * 0.8;
            text2.x = BubbleShoot.game.world.width / 2 - text2.width / 2;

            this.mecanicaGroup.add(this.modal);
            this.mecanicaGroup.add(text);
            this.mecanicaGroup.add(text2);
        },
        clickSound: function () {
            BubbleShoot.sound.clic.play();
        },
        changeBack: function () {
            document.getElementById("backDeskNorm").style.cssText = "z-index:0";
            document.getElementById("backDeskGame").style.cssText = "z-index:1";
        },
        changeBack2: function () {
            document.getElementById("backDeskNorm").style.cssText = "z-index:1";
            document.getElementById("backDeskGame").style.cssText = "z-index:0";
        },
        reg: 1,
        gameApi: {
            getUserInformation: () => {
                UI.gameApiInst.getUserInformation();
                var promise = new Promise((resolve, reject) => {
                    UI.gameApiInst.onSuccess = data => {
                        resolve(data);
                    };
                    UI.gameApiInst.onError = error => {
                        reject(error);
                    };
                });
                return promise;
            },
            createGameSession: () => {
                UI.gameApiInst.createGameSession();
                var promise = new Promise((resolve, reject) => {
                    UI.gameApiInst.onSuccess = data => {
                        resolve(data);
                    };
                    UI.gameApiInst.onError = error => {
                        reject(error);
                    };
                });
                return promise;
            },
            getGameSession: getGameSessionArgs => {
                UI.gameApiInst.getGameSession(getGameSessionArgs);
                var promise = new Promise((resolve, reject) => {
                    UI.gameApiInst.onSuccess = data => {
                        resolve(data);
                    };
                    UI.gameApiInst.onError = error => {
                        reject(error);
                    };
                });
                return promise;
            },
            sendPoints: sendPointsArgs => {
                UI.gameApiInst.sendPoints(sendPointsArgs);
                var promise = new Promise((resolve, reject) => {
                    UI.gameApiInst.onSuccess = data => {
                        resolve(data);
                    };
                    UI.gameApiInst.onError = error => {
                        reject(error);
                    };
                });
                return promise;
            }
        }

    };
    BubbleShoot.UI = UI;
    if (BubbleShoot.deploy == "produccion") {
        BubbleShoot.UI.gameApiInst = new GameAPI();

        console.log(BubbleShoot.UI.gameApiInst);
    }

    exports.UI = UI;
})(BubbleShoot);

(function (exports) {

    function AI(player) {
        this.player = player;
        this.service = new BubbleShoot.Background('ai');
        this.state = 'bootstrap';

        var collisionProperties = {
            bubbleRadius: BubbleShoot.UI.bubble.radius,
            gameWidth: BubbleShoot.game.width
        };
        var args = [this.player.getMetaData(), collisionProperties];
        this.service.execute('bootstrap', args, this.tick, this);
    }

    AI.prototype.stop = function () {
        this.state = 'stop';
        return clearTimeout(this.timer);
    };

    AI.prototype.tick = function () {
        clearTimeout(this.timer);
        if (this.state != 'stop') {
            this.timer = setTimeout(this.update.bind(this), 1500);
        }
    };

    AI.prototype.update = function () {
        if (this.state == 'updating' || !this.player.shooter.bubble) {
            return this.tick();
        }

        this.state = 'updating';

        this.fire(function () {
            this.updateGrid(function () {
                if (this.state != 'stop') {
                    this.state = 'updated';
                }
                this.tick();
            });
        });
    };

    AI.prototype.updateGrid = function (done) {
        this.service.execute('updateGrid', [this.player.board.getGridMetaData()], done, this);
    };

    AI.prototype.fire = function (done) {
        var find = function (data) {
            // BubbleShoot.game.tweens.removeFrom(this.player.shooter);

            var speed = 2000;
            var delta = 1000;
            var diff = this.player.shooter.rotation - data.rotation;

            if (this.player.shooter.rotation < data.rotation) {
                diff = data.rotation - this.player.shooter.rotation;
            }

            var time = Math.round(diff * 1000 / speed * delta);
            if (time <= 0) {
                time = 50;
            }

            var tween = BubbleShoot.game.add.tween(this.player.shooter);
            tween.to({ rotation: data.rotation }, time);
            tween.onComplete.add(function () {
                this.player.fire(done.bind(this), data.trajectory);
            }.bind(this));
            tween.start();
        };

        this.service.execute('findBestAgle', [this.player.shooter.bubble.tag], find, this);
    };

    AI.prototype.randomMove = function () {
        var increase = 33;
        var _angle = Math.abs(this.player.shooter.angle);
        var _angle = Math.abs(180);
        var min = Math.max(95, _angle - increase);
        var max = Math.min(265, _angle + increase);
        var data = { angle: Utils.getRandomInt(min, max) };
        data.rotation = Utils.degreesToRadians(data.angle);

        var tween = BubbleShoot.game.add.tween(this.player.shooter);
        tween.to({ rotation: data.rotation }, 1000);
        tween.onComplete.add(function () {
            this.randomMove();
        }, this);
        tween.start();
    };

    exports.AI = AI;
})(BubbleShoot);

;
(function (global) {

    'use strict';

    var fpsText = "Hola";

    var Game = function (_game) {
        this.game = _game;
    };

    Game.prototype = {

        create: function () {

            this.game.stage.disableVisibilityChange = true;
            BubbleShoot.UI.changeBack();
            BubbleShoot.CurrenteState = this;
            BubbleShoot.state = 'stated';
            this.background = BubbleShoot.game.add.image(0, 0, 'backGame');
            this.background.inputEnabled = true;

            this.boardShoot = BubbleShoot.game.add.image(0, BubbleShoot.game.height - 260, 'shooterx');
            BubbleShoot.spinBtn = BubbleShoot.game.add.button(0, 0, 'spin');
            BubbleShoot.spinBtn.position.set(BubbleShoot.game.world.centerX + 20, BubbleShoot.game.height - 190);
            BubbleShoot.spinBtn.scale.setTo(0.5);
            BubbleShoot.spinBtn.events.onInputDown.add(this.changeBubble, this);
            if (!this.game.device.touch) {
                BubbleShoot.spinBtn.events.onInputOver.add(function () {
                    this.boardShoot.loadTexture("shooterxHov");
                }, this);
                BubbleShoot.spinBtn.events.onInputOut.add(function () {
                    this.boardShoot.loadTexture("shooterx");
                }, this);
            }

            // var background = this.game.add.tileSprite(0, 0, BubbleShoot.UI.width, BubbleShoot.UI.height, "background");
            // background.alpha = 0.8;

            this.game.time.advancedTiming = true;

            BubbleShoot.fire = true;
            BubbleShoot.entities = BubbleShoot.game.add.group();

            var bubblesGroup = BubbleShoot.game.add.group();
            bubblesGroup.enableBody = true;

            BubbleShoot.entities.add(bubblesGroup);
            BubbleShoot.entities.bubbles = bubblesGroup;

            BubbleShoot.isTouch = this.game.device.touch;
            console.log(BubbleShoot.isTouch);
            this.createPlayers(function () {
                this.configureCollision();
                this.createTablero();
                this.attachEvents();
            });

            BubbleShoot.entities.bringToTop(BubbleShoot.entities.bubbles);

            this.timerGame = this.game.time.create(false);

            //  Set a TimerEvent to occur after 2 seconds
            this.timerGame.loop(1, this.cronometro, this);
            this.timerGame.loop(1000, this.updateTextTime, this);

            //  Start the timer running - this is important!
            //  It won't start automatically, allowing you to hook it to button events and the like.
            this.timerGame.start();

            BubbleShoot.sessionTime = "00:00";
            this.horas = 0;
            this.centesimas = 0;
            this.segundos = 0;
            this.minutos = 0;
            this.totalSegundos = 0;

            var style = {
                font: "38px din_condensedbold",
                fill: "#fff",
                align: "left", // the alignment of the text is independent of the bounds, try changing to 'center' or 'right'
                boundsAlignH: "right",
                boundsAlignV: "middle",
                wordWrap: true,
                wordWrapWidth: 300
            };

            BubbleShoot.timeText = this.game.add.text(0, 0, '00:00', style);

            BubbleShoot.timeText.setTextBounds(70, 20, 135, 53);

            BubbleShoot.sound.shoot = this.game.add.sound('launch');
            BubbleShoot.sound.explosion = this.game.add.sound('explosion');
            BubbleShoot.sound.fail = this.game.add.sound('fail');
            BubbleShoot.sound.win = this.game.add.sound('win');
            BubbleShoot.sound.goodjob = this.game.add.sound('goodjob');

            BubbleShoot.animations = {};
            BubbleShoot.animations.mentol = BubbleShoot.game.add.sprite(-250, -250, 'mentol');
            BubbleShoot.animations.mentol.visible = false;
            BubbleShoot.animations.mentol.y = this.world.height / 2 - BubbleShoot.animations.mentol.height / 2;
            BubbleShoot.animations.mentol.x = this.world.width / 2 - BubbleShoot.animations.mentol.width / 2;

            BubbleShoot.animations.purpleX2 = BubbleShoot.game.add.sprite(-250, -250, 'purplex2');
            BubbleShoot.animations.purpleX2.visible = false;
            BubbleShoot.animations.purpleX2.y = this.world.height / 2 - BubbleShoot.animations.purpleX2.height / 2;
            BubbleShoot.animations.purpleX2.x = this.world.width / 2 - BubbleShoot.animations.purpleX2.width / 2;

            BubbleShoot.animations.sabor = BubbleShoot.game.add.sprite(-250, -250, 'sabor');
            BubbleShoot.animations.sabor.visible = false;
            BubbleShoot.animations.sabor.y = this.world.height / 2 - BubbleShoot.animations.sabor.height / 2;
            BubbleShoot.animations.sabor.x = this.world.width / 2 - BubbleShoot.animations.sabor.width / 2;
        },
        updateTextTime() {
            setTimeout(function () {
                BubbleShoot.timeText.text = BubbleShoot.sessionTime;
                BubbleShoot.timeText.updateText();
                BubbleShoot.timeText.dirty = false;
            }, null);
        },
        cronometro: function () {

            if (this.centesimas < 59) {
                this.centesimas++;
                //if (this.centesimas < 10) { this.centesimas = "0"+this.centesimas }
                //this.Centesimas.innerHTML = ":"+this.centesimas;
            }
            if (this.centesimas == 59) {
                this.centesimas = -1;
            }
            if (this.centesimas == 0) {
                this.segundos++;
                this.totalSegundos++;
                if (this.segundos < 10 && this.minutos < 10) {
                    BubbleShoot.sessionTime = "0" + this.minutos + ":0" + this.segundos;
                } else if (this.segundos < 10) {
                    BubbleShoot.sessionTime = this.minutos + ":0" + this.segundos;
                } else if (this.minutos < 10) {
                    BubbleShoot.sessionTime = "0" + this.minutos + ":" + this.segundos;
                } else {
                    BubbleShoot.sessionTime = this.minutos + ":" + this.segundos;
                }
            }
            if (this.segundos == 59) {
                this.segundos = -1;
            }
            if (this.centesimas == 0 && this.segundos == 0) {
                this.minutos++;
                //if (this.minutos < 10) { this.minutos = "0"+this.minutos }
                //this.Minutos.innerHTML = ":"+this.minutos;
            }
            if (this.minutos == 59) {
                this.minutos = -1;
            }
            if (this.centesimas == 0 && this.segundos == 0 && this.minutos == 0) {
                this.horas++;
                //if (this.horas < 10) { this.horas = "0"+this.horas }
                //this.Horas.innerHTML = this.horas;
            }
            BubbleShoot.totalSegundos = parseFloat(this.totalSegundos + "." + this.centesimas) * 1000;
        },
        createPlayers: function (done) {
            if (BubbleShoot.mode == BubbleShoot.MODES.SINGLEPLAYER) {

                BubbleShoot.player = new BubbleShoot.Player('You', BubbleShoot.PLAYER_SIDE_BOTTOM);

                var maxRows = Math.round(BubbleShoot.UI.maxRows);
                var maxCols = BubbleShoot.UI.maxCols;

                BubbleShoot.player.board.createGrid(maxRows, maxCols);
                BubbleShoot.player.board.createBubbles();
                BubbleShoot.player.shooter.showTrajectory(false);
                BubbleShoot.player.shooter.reload(true);

                BubbleShoot.player.enemy = BubbleShoot.enemy;

                BubbleShoot.player.shooter.createAlterBubble();

                return done.call(this);
            }
        },
        changeBubble: function () {
            BubbleShoot.player.shooter.changeBubble();
        },
        createTablero: function () {
            BubbleShoot.tablero = this.game.add.button(0, 0, 'tablero');
            var copy = "0";
            var fill = "#fff";

            var style = {
                font: "38px din_condensedbold",
                fill: "#fff",
                align: "left", // the alignment of the text is independent of the bounds, try changing to 'center' or 'right'
                boundsAlignH: "right",
                boundsAlignV: "middle",
                wordWrap: true,
                wordWrapWidth: 300
            };

            BubbleShoot.textPuntos = this.game.add.text(0, 0, copy, style);

            BubbleShoot.textPuntos.setTextBounds(345, 20, 135, 53);

            BubbleShoot.tablero.onInputDown.add(function () {
                this.createPause();
                BubbleShoot.tablero.loadTexture("tablero-press");
            }, this);

            BubbleShoot.player.board.createLifes();
        },

        createPause: function () {
            BubbleShoot.UI.clickSound();
            BubbleShoot.state = 'pause';
            this.timerGame.paused = true;
            this.detachEvents();
            this.createModalLayer();
        },
        configureCollision: function () {
            var config = BubbleShoot.Collision.config;
            config.bubbleRadius = BubbleShoot.UI.bubble.radius;
            config.trajectory.distance = BubbleShoot.UI.bubble.radius / 5;
            config.trajectory.duration = 600;
            config.gameWidth = BubbleShoot.game.width;
        },

        attachEvents: function () {
            BubbleShoot.tablero.inputEnabled = true;
            this.game.input.addMoveCallback(this.inputMove, this);
            this.background.events.onInputDown.add(this.inputDown, this);

            this.background.events.onInputUp.add(this.inputUp, this);
            this.game.canvas.style.cursor = 'crosshair';
        },

        detachEvents: function () {
            BubbleShoot.tablero.inputEnabled = false;
            this.game.input.deleteMoveCallback(this.inputMove, this);
            this.background.events.onInputUp.remove(this.inputUp, this);
            this.game.canvas.style.cursor = 'default';
        },

        update: function () {
            if (BubbleShoot.player.board.grid.length > 12) {}
            var this_ = this;
            if (BubbleShoot.player.board.grid.length > 12) {
                BubbleShoot.player.board.grid[12].map(function (item) {
                    if (item != undefined) {
                        this_.finish();
                    }
                });
            }
            if (BubbleShoot.fire) {
                BubbleShoot.player.shooter.showTrajectory(false);
            } else {
                BubbleShoot.player.shooter.showTrajectory(true);
            }
        },

        render: function () {
            // var _this = this;
            // BubbleShoot.player.bubbles.forEachAlive(function(bubble) {
            //     this.game.debug.body(bubble);
            // }.bind(this));
            //this.game.debug.geom(BubbleShoot.textPuntos.textBounds, 'rgba(255,0,0,0.5)');
            BubbleShoot.game.debug.geom(BubbleShoot.pause, '#0fffff');
        },
        inputDown: function (input, event) {

            BubbleShoot.fire = false;
        },
        inputUp: function (input, event) {
            BubbleShoot.fire = true;

            if (BubbleShoot.state != 'finished' && BubbleShoot.state != 'pause') {
                BubbleShoot.player.fire();
            }
        },

        inputMove: function (input, x, y, fromClick) {
            var rotation = this.game.physics.arcade.angleToPointer(BubbleShoot.player.shooter);
            // fix rotation: imagem deveria estar apontada para direita, esta para cima
            rotation += 1.57079633;

            BubbleShoot.player.shooter.setRotation(rotation);
        },

        finish: function (winner) {

            if (BubbleShoot.state == 'finished') {
                return false;
            }
            BubbleShoot.sound.fail.play();
            BubbleShoot.state = 'finished';
            this.timerGame.stop();
            this.detachEvents();
            this.createModalLayer();
            BubbleShoot.player.board.savePoints(BubbleShoot.totalSegundos);
        },

        createModalLayer: function () {
            this.detachEvents();
            BubbleShoot.spinBtn.inputEnabled = false;

            var modalGroup = this.game.add.group();
            var modal = this.add.sprite(0, 0, 'modal');
            modal.scale.setTo(0.7);
            this.background.inputEnabled = false;
            modal.y = this.world.height / 2 - modal.height / 2;
            modal.x = this.world.width / 2 - modal.width / 2;
            var style = {
                font: "90px din_condensedbold",
                fill: "#fff",
                align: "center", // the alignment of the text is independent of the bounds, try changing to 'center' or 'right'
                boundsAlignH: "right",
                boundsAlignV: "middle",
                wordWrap: true,
                wordWrapWidth: 300
            };
            var btnHome = this.game.add.button(0, 0, "icoinicio");
            btnHome.scale.setTo(1.2);
            btnHome.alpha = 0.6;
            btnHome.y = this.world.height * 0.7 - btnHome.height * 0.7;
            btnHome.x = this.world.width / 2 - btnHome.width / 2 - 200;

            var btnRanking = this.game.add.button(0, 0, "icoranking");
            btnRanking.scale.setTo(1.2);
            btnRanking.alpha = 0.6;
            btnRanking.y = this.world.height * 0.7 - btnRanking.height * 0.7;
            btnRanking.x = this.world.width / 2 - btnRanking.width / 2 - 70;

            var btnMecanica = this.game.add.button(0, 0, "icomecanica");
            btnMecanica.scale.setTo(1.2);
            btnMecanica.alpha = 0.6;
            btnMecanica.y = this.world.height * 0.7 - btnMecanica.height * 0.7;
            btnMecanica.x = this.world.width / 2 - btnMecanica.width / 2 + 70;

            var btnSonido = this.game.add.button(0, 0, "icosonido");
            btnSonido.scale.setTo(1.2);
            btnSonido.alpha = 0.6;
            btnSonido.y = this.world.height * 0.7 - btnSonido.height * 0.7;
            btnSonido.x = this.world.width / 2 - btnSonido.width / 2 + 200;

            if (BubbleShoot.state == 'pause') {
                var text = this.game.add.text(0, 0, 'PAUSA', style);
                text.y = 250;
                text.x = this.world.width / 2 - text.width / 2;
                style.font = "35px din_condensedbold";
                // var text2 = this.game.add.text(0, 0, 'Tienes', style);
                // text2.y = (this.world.height / 3) - (text2.height / 3);
                // text2.x = (this.world.width / 2) - (text2.width / 2);
                // style.font = "90px din_condensedbold";
                // var text3 = this.game.add.text(0, 0, BubbleShoot.player.board.returnPoints(), style);
                // text3.y = (this.world.height * 0.42) - (text3.height * 0.42);
                // text3.x = (this.world.width / 2) - (text3.width / 2);
                // style.font = "50px din_condensedbold";
                // var text4 = this.game.add.text(0, 0, "PUNTOS", style);
                // text4.y = (this.world.height * 0.5) - (text4.height * 0.5);
                // text4.x = (this.world.width / 2) - (text4.width / 2);
                var button = this.game.add.button(0, 0, "botonModal");
                button.scale.setTo(0.7);
                button.alpha = 0.2;
                button.y = this.world.height * 0.84 - button.height * 0.84;
                button.x = this.world.width / 2 - button.width / 2;
                style.font = "40px din_condensedbold";
                this.text5 = this.game.add.text(0, 0, "CONTINUAR JUGANDO", style);
                this.text5.y = this.world.height * 0.835 - this.text5.height * 0.835;
                this.text5.x = this.world.width / 2 - this.text5.width / 2;

                modalGroup.add(modal);
                modalGroup.add(text);
                // modalGroup.add(text2);
                // modalGroup.add(text3);
                // modalGroup.add(text4);
                modalGroup.add(button);
                modalGroup.add(this.text5);

                button.events.onInputDown.add(function () {
                    BubbleShoot.UI.clickSound();
                    BubbleShoot.tablero.loadTexture("tablero");

                    modalGroup.forEach(function (item) {
                        var anim = BubbleShoot.game.add.tween(item).to({
                            alpha: 0
                        }, 300, 'Linear', true, 0);
                    });

                    BubbleShoot.state = 'running';
                    this.timerGame.paused = false;

                    BubbleShoot.spinBtn.inputEnabled = true;
                    button.destroy();
                    btnRanking.destroy();
                    btnHome.destroy();
                    btnMecanica.destroy();
                    btnSonido.destroy();

                    this.attachEvents();
                    this.background.inputEnabled = true;
                }, this);
            } else {

                style.font = "45px din_condensedbold";
                var text = this.game.add.text(0, 0, 'OUCH', style);
                text.y = 160;
                text.x = this.world.width / 2 - text.width / 2;
                style.font = "35px din_condensedbold";
                style.wordWrapWidth = 500;
                var text2 = this.game.add.text(0, 0, 'Vuelve a empezar y mejora tu puntaje', style);
                text2.y = this.world.height / 4 - text2.height / 4;
                text2.x = this.world.width / 2 - text2.width / 2;
                style.font = "60px din_condensedbold";
                var text3 = this.game.add.text(0, 0, BubbleShoot.player.board.returnPoints(), style);
                text3.y = this.world.height * 0.4 - text3.height * 0.4;
                text3.x = this.world.width / 2 - text3.width / 2;
                style.font = "26px din_condensedbold";
                var text4 = this.game.add.text(0, 0, "PUNTOS", style);
                text4.y = this.world.height * 0.45 - text4.height * 0.45;
                text4.x = this.world.width / 2 - text4.width / 2;
                var button = this.game.add.button(0, 0, "botonModal");
                button.scale.setTo(0.68);
                button.alpha = 0.6;
                button.y = this.world.height * 0.84 - button.height * 0.84;
                button.x = this.world.width / 2 - button.width / 2;
                style.font = "45px din_condensedbold";
                this.text5 = this.game.add.text(0, 0, "VOLVER A JUGAR", style);
                this.text5.y = this.world.height * 0.84 - this.text5.height * 0.84;
                this.text5.x = this.world.width / 2 - this.text5.width / 2;

                modalGroup.add(modal);
                modalGroup.add(text);
                modalGroup.add(text2);
                modalGroup.add(text3);
                modalGroup.add(text4);
                modalGroup.add(button);
                modalGroup.add(this.text5);

                button.events.onInputDown.add(function () {
                    BubbleShoot.UI.clickSound();

                    BubbleShoot.player.board.savePoints(BubbleShoot.totalSegundos);
                    BubbleShoot.tablero.loadTexture("tablero-press");

                    this.game.state.start('game');
                }, this);
            }

            this.text5.alpha = 0.6;

            button.events.onInputOver.add(this.hoverBtnx, this);
            button.events.onInputOut.add(this.unHoverBtnx, this);

            btnHome.events.onInputOver.add(this.hoverBtn, this);
            btnHome.events.onInputOut.add(this.unHoverBtn, this);

            btnRanking.events.onInputOver.add(this.hoverBtn, this);
            btnRanking.events.onInputOut.add(this.unHoverBtn, this);

            btnMecanica.events.onInputOver.add(this.hoverBtn, this);
            btnMecanica.events.onInputOut.add(this.unHoverBtn, this);

            btnSonido.events.onInputOver.add(this.hoverBtn, this);
            btnSonido.events.onInputOut.add(this.unHoverBtn, this);

            btnRanking.events.onInputDown.add(function () {
                BubbleShoot.UI.clickSound();
                BubbleShoot.player.board.savePoints(BubbleShoot.totalSegundos);

                this.state.start('ranking');
            }, this);
            btnHome.events.onInputDown.add(function () {
                BubbleShoot.UI.clickSound();
                BubbleShoot.player.board.savePoints(BubbleShoot.totalSegundos);
                this.game.state.start('menu');
            }, this);

            btnMecanica.events.onInputDown.add(function () {
                BubbleShoot.UI.clickSound();
                BubbleShoot.UI.createMecanica();
            }, this);

            btnSonido.events.onInputDown.add(function () {
                BubbleShoot.UI.clickSound();
                BubbleShoot.game.sound.mute = !BubbleShoot.game.sound.mute;
            }, this);
        },
        hoverBtn: function (btn) {
            var anim = BubbleShoot.game.add.tween(btn).to({
                alpha: 0.8
            }, 300, 'Linear', true, 0);
        },
        unHoverBtn: function (btn) {
            var anim = BubbleShoot.game.add.tween(btn).to({
                alpha: 0.6
            }, 300, 'Linear', true, 0);
        },
        hoverBtnx: function (btn) {
            var text = BubbleShoot.game.add.tween(this.text5).to({
                alpha: 0.8
            }, 300, 'Linear', true, 0);
            var anim = BubbleShoot.game.add.tween(btn).to({
                alpha: 0.8
            }, 300, 'Linear', true, 0);
        },
        unHoverBtnx: function (btn) {
            var text = BubbleShoot.game.add.tween(this.text5).to({
                alpha: 0.6
            }, 300, 'Linear', true, 0);
            var anim = BubbleShoot.game.add.tween(btn).to({
                alpha: 0.6
            }, 300, 'Linear', true, 0);
        }

    };

    global.Game = Game;
})(this, BubbleShoot);
(function (exports) {

    var Menu = function (_game) {
        this.game = _game;
    };

    Menu.prototype = {

        create: function () {
            BubbleShoot.UI.changeBack2();

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

            var button = this.add.button(0, 0, "botonModal");
            button.scale.setTo(0.85);
            button.alpha = 0.6;
            button.y = this.world.height * 0.54 - button.height * 0.54;
            button.x = this.world.width / 2 - button.width / 2;

            style.font = "40px din_condensedbold";
            this.text5 = this.add.text(0, 0, "JUGAR", style);
            this.text5.y = this.world.height * 0.54 - this.text5.height * 0.54;
            this.text5.x = this.world.width / 2 - this.text5.width / 2;

            var comoJugar = this.add.button(0, 0, "botonModal");
            comoJugar.scale.setTo(0.85);
            comoJugar.alpha = 0.66;
            comoJugar.y = this.world.height * 0.66 - comoJugar.height * 0.66;
            comoJugar.x = this.world.width / 2 - comoJugar.width / 2;

            style.font = "40px din_condensedbold";
            this.text8 = this.add.text(0, 0, "¿CÓMO JUGAR?", style);
            this.text8.y = this.world.height * 0.66 - this.text8.height * 0.66;
            this.text8.x = this.world.width / 2 - this.text8.width / 2;

            var btnMecanica = this.add.button(0, 0, "icomecanica");
            btnMecanica.scale.setTo(1.1);
            btnMecanica.alpha = 0.6;
            btnMecanica.y = this.world.height * 0.8 - btnMecanica.height * 0.8;
            btnMecanica.x = this.world.width / 2 - btnMecanica.width / 2 - 138;

            var btnRanking = this.add.button(0, 0, "icoranking");
            btnRanking.scale.setTo(1.1);
            btnRanking.alpha = 0.6;
            btnRanking.y = this.world.height * 0.8 - btnRanking.height * 0.8;
            btnRanking.x = this.world.width / 2 - btnRanking.width / 2 + 140;

            button.events.onInputDown.add(function () {
                BubbleShoot.UI.clickSound();
                this.state.start('game');
            }, this);
            btnRanking.events.onInputDown.add(function () {
                BubbleShoot.UI.clickSound();
                this.state.start('ranking');
            }, this);
            comoJugar.events.onInputDown.add(function () {
                BubbleShoot.UI.clickSound();

                BubbleShoot.UI.createComojugar();
            }, this);

            btnMecanica.events.onInputDown.add(function () {
                BubbleShoot.UI.clickSound();
                BubbleShoot.UI.createMecanica();
            }, this);
            button.events.onInputOver.add(this.hoverBtnx, this);
            button.events.onInputOut.add(this.unHoverBtnx, this);

            btnMecanica.events.onInputOver.add(this.hoverBtn, this);
            btnMecanica.events.onInputOut.add(this.unHoverBtn, this);

            btnRanking.events.onInputOver.add(this.hoverBtn, this);
            btnRanking.events.onInputOut.add(this.unHoverBtn, this);

            comoJugar.events.onInputOver.add(this.hoverBtn, this);
            comoJugar.events.onInputOut.add(this.unHoverBtn, this);
        },
        hoverBtn: function (btn) {
            var anim = BubbleShoot.game.add.tween(btn).to({ alpha: 0.8 }, 300, 'Linear', true, 0);
        },
        unHoverBtn: function (btn) {
            var anim = BubbleShoot.game.add.tween(btn).to({ alpha: 0.6 }, 300, 'Linear', true, 0);
        },
        hoverBtnx: function (btn) {
            var anim = BubbleShoot.game.add.tween(btn).to({ alpha: 0.8 }, 300, 'Linear', true, 0);
        },
        unHoverBtnx: function (btn) {
            var anim = BubbleShoot.game.add.tween(btn).to({ alpha: 0.6 }, 300, 'Linear', true, 0);
        },
        startFullScreen: function () {
            this.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.startFullScreen(false);
        }

    };

    exports.Menu = Menu;
})(this);

(function (exports) {

    var Preloader = function (game) {
        this.game = game;
    };

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

            loading.y = this.world.height / 2 - loading.height / 2;
            loading.x = this.world.width / 2 - loading.width / 2;
            //  Here we add a new animation called 'walk'
            //  Because we didn't give any other parameters it's going to make an animation from all available frames in the 'mummy' sprite sheet
            var start = loading.animations.add('start');

            //  And this starts the animation playing by using its key ("walk")
            //  30 is the frame rate (30fps)
            //  true means it will loop when it finishes
            loading.animations.play('start', 30, true);

            //this.load.setPreloadSprite(preloadBar);

            this.load.atlasJSONHash('sprites', assetsPath + '/img/sprites3.png', assetsPath + '/json/sprites.json');
            //this.load.image("background", "src/img/background.jpg");


            this.load.image('tablero', assetsPath + '/img/tablero.png');
            this.load.image('tablero-press', assetsPath + '/img/tablero-press.png');

            if (this.game.device.touch) {
                this.load.image('shooterx', assetsPath + '/img/shooter.png');
            } else {
                this.load.image('shooterxHov', assetsPath + '/img/shooter.png');
                this.load.image('shooterx', assetsPath + '/img/shooterMovil.png');
            }

            this.load.image('spin', assetsPath + '/img/spin.png');
            this.load.image('backGame2', assetsPath + '/img/back2.png');

            this.load.image('backGame', assetsPath + '/img/back.png');
            this.load.image('plop40', assetsPath + '/img/plop40.png');
            this.load.image('plop20', assetsPath + '/img/plop20.png');
            this.load.image('plop10', assetsPath + '/img/plop10.png');
            this.load.image('modal', assetsPath + '/img/modal.png');
            this.load.image('intro', assetsPath + '/img/intro.png');
            this.load.image('barra', assetsPath + '/img/barra.png');

            this.load.image('icocerrar', assetsPath + '/img/icocerrar.png');
            this.load.image('icoinicio', assetsPath + '/img/icoinicio.png');
            this.load.image('icomecanica', assetsPath + '/img/icomecanica.png');
            this.load.image('icoranking', assetsPath + '/img/icoranking.png');
            this.load.image('icoterminos', assetsPath + '/img/icoterminos.png');
            this.load.image('icosonido', assetsPath + '/img/icosonido.png');

            //Como jugar
            this.load.image('mec1', assetsPath + '/img/mecanica/1-01.png');
            this.load.image('mec2', assetsPath + '/img/mecanica/2-01.png');
            this.load.image('mec3', assetsPath + '/img/mecanica/3-01.png');
            this.load.image('mec4', assetsPath + '/img/mecanica/4-01.png');
            this.load.image('mec5', assetsPath + '/img/mecanica/5-01.png');
            this.load.image('mec6', assetsPath + '/img/mecanica/6-01.png');
            this.load.image('mec7', assetsPath + '/img/mecanica/7-01.png');
            this.load.image('mec8', assetsPath + '/img/mecanica/8-01.png');
            this.load.image('mec10', assetsPath + '/img/mecanica/10-01.png');

            this.load.image('bolaon', assetsPath + '/img/bolaon.png');
            this.load.image('bolaoff', assetsPath + '/img/bolaoff.png');

            this.load.image('boton', assetsPath + '/img/boton.png');
            this.load.image('botonModal', assetsPath + '/img/boton-modal.png');

            this.load.image('icoterminos', assetsPath + '/img/icoterminos.png');

            this.load.atlasJSONHash('chispa-orange', assetsPath + '/img/chispas/gris/gris.png', assetsPath + '/img/chispas/gris/gris.json');
            this.load.atlasJSONHash('chispa-yellow', assetsPath + '/img/chispas/amarillo/sprites.png', assetsPath + '/img/chispas/amarillo/sprites.json');
            this.load.atlasJSONHash('chispa-blue', assetsPath + '/img/chispas/azul/sprites.png', assetsPath + '/img/chispas/azul/sprites.json');
            this.load.atlasJSONHash('chispa-magenta', assetsPath + '/img/chispas/morada/sprites.png', assetsPath + '/img/chispas/morada/sprites.json');
            this.load.atlasJSONHash('chispa-red', assetsPath + '/img/chispas/roja/sprites.png', assetsPath + '/img/chispas/roja/sprites.json');
            this.load.atlasJSONHash('chispa-green', assetsPath + '/img/chispas/verde/sprites.png', assetsPath + '/img/chispas/verde/sprites.json');

            this.load.atlasJSONHash('mentol', assetsPath + '/img/textos/mentol.png', assetsPath + '/img/textos/mentol.json');
            this.load.atlasJSONHash('purplex2', assetsPath + '/img/textos/purplex2.png', assetsPath + '/img/textos/purplex2.json');
            this.load.atlasJSONHash('sabor', assetsPath + '/img/textos/sabor.png', assetsPath + '/img/textos/sabor.json');

            this.load.atlasJSONHash('animMec2', assetsPath + '/img/mecanica/mecanica1.png', assetsPath + '/img/mecanica/mecanica1.json');
            this.load.atlasJSONHash('animMec2P', assetsPath + '/img/mecanica/mecanica1puntos.png', assetsPath + '/img/mecanica/mecanica1puntos.json');

            this.load.atlasJSONHash('animMec3', assetsPath + '/img/mecanica/mecanica2.png', assetsPath + '/img/mecanica/mecanica2.json');
            this.load.atlasJSONHash('animMec3P', assetsPath + '/img/mecanica/mecanica2puntos.png', assetsPath + '/img/mecanica/mecanica2puntos.json');

            this.load.atlasJSONHash('animMec4', assetsPath + '/img/mecanica/mecanica3.png', assetsPath + '/img/mecanica/mecanica3.json');
            this.load.atlasJSONHash('animMec4P', assetsPath + '/img/mecanica/mecanica3puntos.png', assetsPath + '/img/mecanica/mecanica3puntos.json');

            this.load.audio('explosion', [assetsPath + '/sounds/explosion.ogg', assetsPath + '/sounds/explosion.mp3']);
            this.load.audio('launch', [assetsPath + '/sounds/launch.ogg', assetsPath + '/sounds/launch.mp3']);
            this.load.audio('win', [assetsPath + '/sounds/win.ogg', assetsPath + '/sounds/win.mp3']);
            this.load.audio('fail', [assetsPath + '/sounds/fail.ogg', assetsPath + '/sounds/fail.mp3']);
            this.load.audio('goodjob', [assetsPath + '/sounds/goodjob.mp3']);

            this.load.audio('clic', [assetsPath + '/sounds/clic.mp3']);
        },

        create: function () {
            BubbleShoot.sound.clic = this.game.add.sound('clic');

            this.state.start('menu');
        }

    };

    exports.Preloader = Preloader;
})(this);

(function (exports) {

    var Boot = function (game) {
        this.game = game;
    };

    Boot.prototype = {

        preload: function () {

            this.load.crossOrigin = 'anonymous';

            this.load.spritesheet('loading', assetsPath + '/img/loading.png', 512, 256, 13);
            this.load.audio('main', [assetsPath + '/sounds/main.mp3', assetsPath + '/sounds/main.ogg']);
        },

        create: function () {
            BubbleShoot.sound = {};
            BubbleShoot.sound.main = this.game.add.sound('main');
            BubbleShoot.sound.main.volume = 0.050;
            BubbleShoot.sound.main.loop = true;
            BubbleShoot.sound.main.play();

            // set scale options
            this.input.maxPointers = 1;
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = true;
            // this.scale.setScreenSize(true);
            if (BubbleShoot.deploy == "produccion") {
                this.getUser();
            }
            // this.scale.maxWidth = Math.round(BubbleShoot.UI.width * 0.7);
            // this.scale.maxHeight = Math.round(BubbleShoot.UI.height * 0.7);

            // this.scale.forceOrientation(true, false);

            // start the Preloader state
            this.state.start('preloader');
        },
        getUser: function () {
            BubbleShoot.UI.gameApi.getUserInformation().then(data => {
                console.log(data);
                BubbleShoot.UI.infoUsuarioAPI = data;
                var xmlhttp = new XMLHttpRequest();
                if (BubbleShoot.UI.reg == 1) {
                    var url = "https://ddbdev.co/chesterbubbleAPI/public/userIdPropios/" + BubbleShoot.UI.infoUsuarioAPI.respondentGUID;
                } else {
                    var url = "https://ddbdev.co/chesterbubbleAPI2/public/userIdPropios/" + BubbleShoot.UI.infoUsuarioAPI.respondentGUID;
                }
                var this_ = this;
                xmlhttp.onreadystatechange = function () {
                    if (this.readyState == 4) {
                        var response = JSON.parse(this.responseText);
                        this_.createRank(response);
                    }
                };
                xmlhttp.open("GET", url, true);
                try {
                    xmlhttp.send();
                } catch (error) {
                    console.log(error);
                }
            }).catch(error => {
                console.log(error);
            });
        },
        createRank: function (response) {
            if (response.length === 0) {
                var params = "name=" + BubbleShoot.UI.infoUsuarioAPI.firstName + " " + BubbleShoot.UI.infoUsuarioAPI.lastName + "&id_los_propios=" + BubbleShoot.UI.infoUsuarioAPI.respondentGUID + "";

                var http = new XMLHttpRequest();
                if (BubbleShoot.UI.reg == 1) {

                    var url = "https://ddbdev.co/chesterbubbleAPI/public/ranking";
                } else {
                    var url = "https://ddbdev.co/chesterbubbleAPI2/public/ranking";
                }
                http.open("POST", url, true);

                //Send the proper header information along with the request
                http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

                http.onreadystatechange = function () {
                    //Call a function when the state changes.
                    if (http.readyState == 4 && http.status == 200) {
                        console.log(http.responseText);
                        var lala = JSON.parse(http.responseText);
                        BubbleShoot.UI.infoUsuarioAPI.pointsOld = 0;
                        BubbleShoot.UI.infoUsuarioAPI.idAPI = lala.data[0].id === '' ? 0 : lala.data[0].id;
                    }
                };
                http.send(params);

                BubbleShoot.UI.gameApi.createGameSession().then(data => {
                    BubbleShoot.UI.gameSession = data.gameSessionID;
                    var sendPointsArgs = {
                        "gameSessionID": BubbleShoot.UI.gameSession,
                        "points": 60
                    };
                    BubbleShoot.UI.gameApi.sendPoints(sendPointsArgs).then(data => {
                        console.log(data);
                    }).catch(error => {
                        console.log(error);
                    });
                }).catch(error => {
                    console.error(error);
                });
            } else {
                BubbleShoot.UI.infoUsuarioAPI.pointsOld = response[0].points === '' ? 0 : response[0].points;
                BubbleShoot.UI.infoUsuarioAPI.idAPI = response[0].id === '' ? 0 : response[0].id;
                BubbleShoot.UI.infoUsuarioAPI.time = response[0].time === '' ? 0 : response[0].time;
                BubbleShoot.UI.infoUsuarioAPI.name = response[0].name === '' ? 0 : response[0].name;
                BubbleShoot.UI.infoUsuarioAPI.position = response[0].position === '' ? 0 : response[0].position;
            }
        }

    };

    exports.Boot = Boot;
})(this);

(function (exports) {

    var Ranking = function (_game) {
        this.game = _game;
    };

    Ranking.prototype = {

        create: function () {
            this.background = BubbleShoot.game.add.image(0, 0, 'backGame2');
            BubbleShoot.UI.changeBack2();

            var style = {
                font: "90px din_condensedbold", fill: "#fff",
                align: "center", // the alignment of the text is independent of the bounds, try changing to 'center' or 'right'
                boundsAlignH: "right",
                boundsAlignV: "middle",
                wordWrap: true,
                wordWrapWidth: 300
            };
            this.loading = this.game.add.sprite(0, 0, 'loading');
            this.loading.scale.setTo(0.3);

            this.loading.y = this.game.world.height / 2 - this.loading.height / 2;
            this.loading.x = this.game.world.width / 2 - this.loading.width / 2;
            //  Here we add a new animation called 'walk'
            //  Because we didn't give any other parameters it's going to make an animation from all available frames in the 'mummy' sprite sheet
            var start = this.loading.animations.add('start');

            //  And this starts the animation playing by using its key ("walk")
            //  30 is the frame rate (30fps)
            //  true means it will loop when it finishes
            this.loading.animations.play('start', 30, true);
            style.font = "60px din_condensedbold";
            var titulo = BubbleShoot.game.add.text(0, 0, 'RANKING', style);
            titulo.y = 80;
            titulo.x = BubbleShoot.game.world.width / 2 - titulo.width / 2;
            //Call Users
            var xmlhttp = new XMLHttpRequest();
            if (BubbleShoot.UI.reg == 1) {

                var url = "https://ddbdev.co/chesterbubbleAPI/public/positions";
            } else {
                var url = "https://ddbdev.co/chesterbubbleAPI2/public/positions";
            }
            var this_ = this;
            xmlhttp.onreadystatechange = function () {
                if (this.readyState == 4) {
                    var usuarios = JSON.parse(this.responseText);
                    this_.updateUsuarios(usuarios);
                }
            };
            xmlhttp.open("GET", url, true);
            try {
                xmlhttp.send();
            } catch (error) {
                console.log(error);
            }
        },
        updateUsuarios: function (usuarios) {
            this.loading.animations.stop('start');
            this.loading.visible = false;

            //Call Users
            var usuariosList = [];
            var style = {
                font: "90px din_condensedbold", fill: "#fff",
                align: "center" // the alignment of the text is independent of the bounds, try changing to 'center' or 'right'
            };
            usuarios[0].map(function (usuario) {
                //★
                if (usuario.name.length > 25) {
                    usuario.name = usuario.name.substring(0, 20) + "...";
                }
                usuario.name = usuario.name.toLowerCase();
                usuario.name = usuario.name.replace(/\b[a-z]/g, function (f) {
                    return f.toUpperCase();
                });
                newUsuario = [usuario.position + "", usuario.name, usuario.points + "", usuario.time];
                usuariosList.push(newUsuario);
            });
            style.tabs = [120, 230, 100, 80];
            style.font = "30px din_condensedbold";

            var headers = ['POSICIÓN', 'NOMBRES', 'PUNTOS', 'TIEMPO'];
            var rankHeaders = this.game.add.text(0, 0, "", style);
            rankHeaders.parseList(headers);
            rankHeaders.x = BubbleShoot.game.world.width / 2 - rankHeaders.width / 2;
            rankHeaders.y = BubbleShoot.game.world.height / 2 - rankHeaders.height / 2 - 270;

            style.font = "30px din_condensedbold";
            var barra = this.game.add.image(0, 0, 'barra');
            barra.scale.setTo(0.75);
            barra.x = BubbleShoot.game.world.width / 2 - barra.width / 2;
            barra.y = rankHeaders.y + 50;
            barra.alpha = 0.3;
            if (BubbleShoot.deploy != "produccion") {

                BubbleShoot.UI.infoUsuarioAPI = {};
                BubbleShoot.UI.infoUsuarioAPI.pointsOld = 85000000;
                BubbleShoot.UI.infoUsuarioAPI.name = "Cristian Andres Arrieta";
                BubbleShoot.UI.infoUsuarioAPI.time = "00:00:20";
                BubbleShoot.UI.infoUsuarioAPI.position = "1";
            }

            var currentUser = [BubbleShoot.UI.infoUsuarioAPI.position, BubbleShoot.UI.infoUsuarioAPI.name, BubbleShoot.UI.infoUsuarioAPI.pointsOld, BubbleShoot.UI.infoUsuarioAPI.time];
            //  Or you can modify the tabs property directly:
            // text.tabs = 132;
            var currentPosition = this.game.add.text(0, 0, "", style);
            currentPosition.parseList(currentUser);
            currentPosition.x = BubbleShoot.game.world.width / 2 - rankHeaders.width / 2;
            currentPosition.y = rankHeaders.y + 50;

            //  Or you can modify the tabs property directly:
            // text.tabs = 132;
            var text2 = this.game.add.text(0, 0, "", style);
            text2.parseList(usuariosList);
            text2.x = BubbleShoot.game.world.width / 2 - rankHeaders.width / 2;
            text2.y = BubbleShoot.game.world.height / 2 - text2.height / 2 + 10;

            var btnHome = this.game.add.button(0, 0, "icoinicio");
            btnHome.scale.setTo(1.2);
            btnHome.alpha = 0.6;
            btnHome.y = this.world.height * 0.8 - btnHome.height * 0.8;
            btnHome.x = this.world.width / 2 - btnHome.width / 2 - 200;

            // var btnRanking = this.game.add.button(0, 0, "icoranking");
            // btnRanking.scale.setTo(1.2);
            // btnRanking.alpha = 0.6;
            // btnRanking.y = (this.world.height * 0.8) - (btnRanking.height * 0.8);
            // btnRanking.x = (this.world.width / 2) - (btnRanking.width / 2) - 70;

            var btnMecanica = this.game.add.button(0, 0, "icomecanica");
            btnMecanica.scale.setTo(1.2);
            btnMecanica.alpha = 0.6;
            btnMecanica.y = this.world.height * 0.8 - btnMecanica.height * 0.8;
            btnMecanica.x = this.world.width / 2 - btnMecanica.width / 2 + 70;

            var btnSonido = this.game.add.button(0, 0, "icosonido");
            btnSonido.scale.setTo(1.2);
            btnSonido.alpha = 0.6;
            btnSonido.y = this.world.height * 0.8 - btnSonido.height * 0.8;
            btnSonido.x = this.world.width / 2 - btnSonido.width / 2 + 200;

            var button = this.add.button(0, 0, "botonModal");
            button.scale.setTo(0.75);
            button.alpha = 0.6;
            button.y = BubbleShoot.game.world.height * 0.92 - button.height * 0.92;
            button.x = BubbleShoot.game.world.width / 2 - button.width / 2;

            style.font = "40px din_condensedbold";
            this.text5 = BubbleShoot.game.add.text(0, 0, "JUGAR", style);
            this.text5.y = BubbleShoot.game.world.height * 0.91 - this.text5.height * 0.91;
            this.text5.x = BubbleShoot.game.world.width / 2 - this.text5.width / 2;

            button.events.onInputDown.add(function () {
                BubbleShoot.UI.clickSound();
                this.state.start('game');
            }, this);

            btnHome.events.onInputDown.add(function () {
                BubbleShoot.UI.clickSound();
                this.game.state.start('menu');
            }, this);
            btnMecanica.events.onInputDown.add(function () {
                BubbleShoot.UI.clickSound();
                BubbleShoot.UI.createMecanica();
            }, this);
            btnSonido.events.onInputDown.add(function () {
                BubbleShoot.UI.clickSound();
                BubbleShoot.game.sound.mute = !BubbleShoot.game.sound.mute;
            }, this);
        }

    };

    exports.Ranking = Ranking;
})(this);

(function (exports) {

    var game = new Phaser.Game(BubbleShoot.UI.width, BubbleShoot.UI.height, Phaser.AUTO, 'game', null, true);
    game.state.add('boot', Boot);
    game.state.add('ranking', Ranking);
    game.state.add('preloader', Preloader);
    game.state.add('menu', Menu);
    game.state.add('game', Game);
    game.state.start('boot');

    BubbleShoot.game = game;
})(this);