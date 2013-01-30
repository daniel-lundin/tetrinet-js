var playfield = require('./playfield.js');

PLAYER_COUNT = 2;

function serialize_field(playfield) {
    var cells = Array(playfield.cells.length);
    for(var i=0;i<cells.length;++i) {
        var cell = 0;
        var x = i % playfield.width;
        var y = Math.floor(i / playfield.width);
        if(playfield.cells[i]) {
            cell = playfield.cells[i];
        } else if(playfield.shape_at(x, y)) {
            cell = playfield.shape_at(x, y);
        }
        cells[i] = cell;
    }
    return {
        "cells": cells,
        "width": playfield.width,
        "height": playfield.height
    };
}

function serialize_fields(game) {
    fields = [];
    for(var playfield in game.playfields) {
        fields.push(serialize_field(game.playfields[playfield]));
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
        clearInterval(game.clock);
    }
}

function Game() {
    this.sockets = [];
    this.playfields = [];
    this.started = false;
    this.player_count = 0;
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
    this.sockets.push(socket);
    this.playfields.push(new playfield.PlayField(10, 20));
    socket.emit('id_assigned', this.player_count);
    ++this.player_count;
    console.log('player added');
    if(this.full()) {
        console.log("game started");
        this.started = true;
        var g = this;
        console.log("starting timer");
        this.clock = setInterval(function() { tick(g); }, 1000);
    }
}

Game.prototype.remove_player = function(socket) {
    var idx = socketidx;
    this.sockets.splice(idx, idx);
    this.playfields.splice(idx, idx);
    --this.player_count;
    console.log('player removed');
}

Game.prototype.full = function() {
    return this.player_count >= PLAYER_COUNT;
}

Game.prototype.move_left = function(socket) {
    var idx = socket.idx;
    var pf = this.playfields[idx];
    pf.move_shape_left();
    socket.emit('playfield_update', serialize_fields(this));
}

Game.prototype.move_right = function(socket) {
    var idx = socket.idx;
    var pf = this.playfields[idx];
    pf.move_shape_right();
    socket.emit('playfield_update', serialize_fields(this));
}

Game.prototype.move_down = function(socket) {
    var idx = socket.idx;
    var pf = this.playfields[idx];
    pf.move_shape_down();
    socket.emit('playfield_update', serialize_fields(this));
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
    socket.emit('playfield_update', serialize_fields(this));
}

exports.Game = Game;
