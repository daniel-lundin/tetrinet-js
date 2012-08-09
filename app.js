var app = require('http').createServer(handler);
var io = require('socket.io').listen(app);
var fs = require('fs');
var pf = require('./playfield');

app.listen(process.env.PORT || 8080);

function handler(req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

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

function shape_coords(playfield) {
    var coords = [];
    for(var i=0;i<playfield.shape.length;++i) {
        for(var j=0;j<playfield.shape[i].length;++j) {
            if(playfield.shape[i][j]) {
                coords.push([i+playfield.shape_pos_x, j+playfield.shape_pos_y]);
            }
        }
    }
    return coords;
}

io.sockets.on('connection', function (socket) {
    // Create a playfield
    var playfield = new pf.PlayField(10, 20);
    socket.set('playfield', playfield);
    socket.on('message', function (data) {
        switch(data) {
            case 'left':
                socket.get('playfield', function(err, pf) {
                    pf.move_shape_left();
                    socket.emit('playfield update', serialize_field(pf));
                });
                break;
            case 'right':
                socket.get('playfield', function(err, pf) {
                    pf.move_shape_right();
                    socket.emit('playfield update', serialize_field(pf));
                });
                break;
            case 'step':
                socket.get('playfield', function(err, pf) {
                    pf.step();
                    socket.emit('playfield update', serialize_field(pf));
                });
                break;
            case 'rotate':
                socket.get('playfield', function(err, pf) {
                    pf.rotate_shape();
                    socket.emit('playfield update', serialize_field(pf));
                });
                break;
        }
    });
});
