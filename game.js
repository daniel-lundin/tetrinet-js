var playfield = require('./playfield.js');

PLAYER_COUNT=1;

function serialize_field(playfield) {
    var cells = Array(playfield.cells.length);
    for(var i=0;i<cells.length;++i) {
        var cell = 0;
        var x = i % playfield.width;
        var y = Math.floor(i / playfield.width);
        if(playfield.cells[i]) {
            cell = playfield.cells[i];
        } else if(playfield.shape_at(x, y)) {
            cell = 99;
        }
        cells[i] = cell;
    }
    return {
        "cells": cells,
        "width": playfield.width,
        "height": playfield.height
    };
}

function tick(game) {
    console.log("ticking");
    console.log(game.sockets);
    for(var i=0;i<game.sockets.length;++i) {
        var pf = game.playfields[i];
        pf.step();
        game.sockets[i].emit('playfield update', serialize_field(pf))
    }
}

function Game() {
    this.sockets = [];
    this.playfields = [];
    this.started = false;
    this.player_count = 0;
}

Game.prototype.add_player = function(socket) {
    socket.set('idx', this.player_count);
    this.sockets.push(socket);
    this.playfields.push(new playfield.PlayField(10, 20));
    ++this.player_count;
    console.log('player added');
    if(this.full()) {
        console.log("Game started");
        this.started = true;
        var g = this;
        this.clock = setInterval(function() { tick(g); }, 1000);
    }
}

Game.prototype.full = function() {
    return this.player_count >= PLAYER_COUNT;
}

Game.prototype.move_left = function(socket) {
    var g = this;
    socket.get('idx', function(err, idx) {
        var pf = g.playfields[idx];
        pf.move_shape_left();
        socket.emit('playfield update', serialize_field(pf));
    });
}

Game.prototype.move_right = function(socket) {
    var g = this;
    socket.get('idx', function(err, idx) {
        var pf = g.playfields[idx];
        pf.move_shape_right();
        socket.emit('playfield update', serialize_field(pf));
    });
}

Game.prototype.rotate = function(socket) {
    var g = this;
    socket.get('idx', function(err, idx) {
        var pf = g.playfields[idx];
        pf.rotate_shape();
        socket.emit('playfield update', serialize_field(pf));
    });
}

exports.Game = Game;
