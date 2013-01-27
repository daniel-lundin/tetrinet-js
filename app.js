var fs = require('fs');
var pf = require('./playfield');
var g = require('./game.js');

var app = require('http').createServer(handler);
var io = require('socket.io').listen(app);
io.set('log level', 1)

app.listen(process.env.PORT || 8080);

static_url_map = {
    '/': ['index.html','text/html'],
    '/static/js/drawing.js': ['/static/js/drawing.js', 'application/javascript']
}

function serve_static(res, url) {
    if(url in static_url_map) {
        var match = static_url_map[url];
        path = match[0];
        content_type = match[1];
        fs.readFile(__dirname + "/" + path,
            function (err, data) {
                if(err) {
                    res.writeHead(500);
                    console.log(err);
                    return res.end("Error loading static file" + path);
                }
                res.writeHead(200, {'Content-Type': content_type});
                res.end(data);
            }
        );
    }
}

function handler(req, res) {
    serve_static(res, req.url);
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

    socket.on('disconnect', function (data) {
        console.log('disconnect');
        game.remove_player(socket);
    });
});

