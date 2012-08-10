var app = require('http').createServer(handler);
var io = require('socket.io').listen(app);
var fs = require('fs');
var pf = require('./playfield');
var g = require('./game.js');

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
        }
    });
});
