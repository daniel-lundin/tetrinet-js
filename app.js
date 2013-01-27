var fs = require('fs');
var pf = require('./playfield');
var g = require('./game.js');

var app = require('http').createServer(handler);
var io = require('socket.io').listen(app);
io.set('log level', 1)

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


var game = new g.Game();
var games = [];
io.sockets.on('connection', function (socket) {
    game.add_player(socket);
    socket.on('message', function (data) {
        switch(data) {
            case 'left':
                game.move_left(socket);
                break;
            case 'right':
                game.move_right(socket);
                break;
            case 'rotate':
                game.rotate(socket);
                break;
            case 'down':
                game.move_down(socket);
                break;
        }
    });

    socket.on('disconnect', function (socket) {
        console.log('disconnect');
        game.remove_player(socket);
    });
});

