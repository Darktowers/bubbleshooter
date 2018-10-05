(function(exports) {

    var BubbleShoot = exports.BubbleShoot = {

        MODES : {
            SINGLEPLAYER : 'singleplayer',
        },
        deploy: "produccion",
        PLAYER_SIDE_TOP : 'top',
        PLAYER_SIDE_BOTTOM: 'bottom',

        BUBBLE_STATE_ON_BOARD : 1,
        BUBBLE_STATE_FIRING : 3,
        BUBBLE_STATE_POPPING : 4,
        points:0,
        debug : false,
        newline:0,
        Service : {},
    };

})(this.window || this);
