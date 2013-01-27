var playfield = require('./playfield.js');

PLAYER_COUNT=2;

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

function serialize_fields(game) {
    fields = [];
    for(var playfield in game.playfields) {
        fields.push(serialize_field(game.playfields[playfield]));
    }
    return fields;
}

function tick(game) {
    console.log("ticking");
    for(var i=0;i<game.sockets.length;++i) {
        var pf = game.playfields[i];
        pf.step();
        game.sockets[i].emit('playfield_update', serialize_fields(game))
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
    var g = this;
    socket.get('idx', function(err, idx) {
        g.sockets.splice(idx, idx);
        g.playfields.splice(idx, idx);
        --g.player_count;
        console.log('player removed');
    });
}

Game.prototype.full = function() {
    return this.player_count >= PLAYER_COUNT;
}

Game.prototype.move_left = function(socket) {
    var g = this;
    socket.get('idx', function(err, idx) {
        var pf = g.playfields[idx];
        pf.move_shape_left();
        socket.emit('playfield_update', serialize_fields(g));
    });
}

Game.prototype.move_right = function(socket) {
    var g = this;
    socket.get('idx', function(err, idx) {
        var pf = g.playfields[idx];
        pf.move_shape_right();
        socket.emit('playfield_update', serialize_fields(g));
    });
}

Game.prototype.move_down = function(socket) {
    var g = this;
    socket.get('idx', function(err, idx) {
        var pf = g.playfields[idx];
        pf.move_shape_down();
        socket.emit('playfield_update', serialize_fields(g));
    });
}

Game.prototype.rotate = function(socket) {
    var g = this;
    socket.get('idx', function(err, idx) {
        var pf = g.playfields[idx];
        pf.rotate_shape();
        socket.emit('playfield_update', serialize_fields(g));
    });
}

exports.Game = Game;
