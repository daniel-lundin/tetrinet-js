var playfield = require('./playfield.js');


GAME_WAITING = 0;
GAME_RUNNING = 1;
GAME_OVER = 2;

function serialize_fields(game) {
    fields = {};
    for(var idx in game.playfields) {
        fields[idx] = game.playfields[idx].serialize();
    }
    return fields;
}

function tick(game) {
    var num_alive = 0;
    for(var i=0;i<game.sockets.length;++i) {
        if(game.playfields[i].alive) {
            ++num_alive;
        }
        game.step(i);
    }
    if(num_alive == 1) {
        console.log('---game over---');
        game.state = GAME_OVER;
        game.broadcast('game_over', undefined);
        clearInterval(game.clock);
    }
}

function Game() {
    this.sockets = [];
    this.playfields = [];
    this.state = GAME_WAITING;
    this.player_count = 0;
    this.id = Math.floor(Math.random()*9999999);
}

Game.prototype.broadcast = function(identifier, data) {
    for(var idx in this.sockets) {
        this.sockets[idx].emit(identifier, data);
    }
}
Game.prototype.step = function(player_idx) {
    var pf = this.playfields[player_idx];
    var lines_reduced = pf.step();
    if(lines_reduced > 1) {
        for(var idx in this.sockets) {
            if(idx != player_idx) {
                this.playfields[idx].increase_from_bottom(lines_reduced-1);
                this.sockets[idx].emit('playfield_update', serialize_fields(this));
            }
        }
        console.log("Increasing others");
    }
    this.sockets[player_idx].emit('playfield_update', serialize_fields(this))
}

Game.prototype.add_player = function(socket) {
    socket.idx = this.player_count;
    socket.game_id = this.id;
    this.sockets.push(socket);
    this.playfields.push(new playfield.PlayField(10, 20));
    socket.emit('id_assigned', this.player_count);
    ++this.player_count;
    console.log('player added');
}

Game.prototype.start_game = function(socket) {
    if(this.state == GAME_WAITING && this.sockets.length > 1) {
        console.log('Starting game with ' + this.sockets.length + ' players...');
        this.state = GAME_RUNNING;
        var game = this;
        this.clock = setInterval(function() { tick(game); }, 1000);
    }
}

Game.prototype.remove_player = function(socket) {
    var idx = socket.idx;
    this.sockets.splice(idx, idx);
    this.playfields.splice(idx, idx);
    --this.player_count;
    console.log('player removed');
    this.emit_player_name_update();
}

Game.prototype.move_left = function(socket) {
    var idx = socket.idx;
    var pf = this.playfields[idx];
    pf.move_shape_left();
    //socket.emit('playfield_update', serialize_fields(this));
}

Game.prototype.move_right = function(socket) {
    var idx = socket.idx;
    var pf = this.playfields[idx];
    pf.move_shape_right();
    //socket.emit('playfield_update', serialize_fields(this));
}

Game.prototype.move_down = function(socket) {
    var idx = socket.idx;
    var pf = this.playfields[idx];
    pf.move_shape_down();
    //socket.emit('playfield_update', serialize_fields(this));
}

Game.prototype.free_fall = function(socket) {
    var idx = socket.idx;
    var pf = this.playfields[idx];
    pf.free_fall();
    this.step(idx);
}

Game.prototype.rotate = function(socket) {
    var idx = socket.idx;
    var pf = this.playfields[idx];
    pf.rotate_shape();
    //socket.emit('playfield_update', serialize_fields(this));
}

Game.prototype.emit_player_name_update = function() {
    list_of_names = this.sockets.map(function(s) {
        return s.name;
    });
    this.broadcast('game_update', list_of_names);
}

//----------------------
//---- GAME MANAGER ----
//----------------------
GAMES = [];
GameMgr = {};

// Joins a not yet started game or creates a new game if nothing found
GameMgr.find_or_create_game = function(socket) {
    for(var g in GAMES) {
        if(GAMES[g].state == GAME_WAITING) {
            console.log('joining existing game');
            GAMES[g].add_player(socket);
            socket.emit('game_joined');
            GAMES[g].emit_player_name_update();
            return;
        }
    }
    console.log('creating brand new game');
    var game = new Game();
    GAMES.push(game);
    game.add_player(socket);
    socket.emit('game_created');
    socket.emit('game_update', [socket.name]);
}

GameMgr.game_for = function(socket) {
    for(var g in GAMES)
        if(socket.game_id == GAMES[g].id)
            return GAMES[g];
    return undefined;
}
exports.Game = Game;
exports.GameMgr = GameMgr;
