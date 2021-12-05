const http = require("http");
const express = require("express");
const { Server } = require("socket.io");
var g = require("./game.js");
var names = require("./names.js");

const app = express();
const server = http.createServer(app);
app.use(express.static("static"));
const io = new Server(server);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});

io.on("connection", (socket) => {
  socket.name = names.shuffle_name();
  console.log("registered player " + socket.name);
  socket.emit("registered", socket.name);
  g.GameMgr.find_or_create_game(socket);

  var game = g.GameMgr.game_for(socket);
  socket.on("message", function (data) {
    switch (data) {
      case "left":
        game.move_left(socket);
        break;
      case "right":
        game.move_right(socket);
        break;
      case "rotate":
        game.rotate(socket);
        break;
      case "down":
        game.move_down(socket);
        break;
      case "start_game":
        game.start_game(socket);
        break;
      case "free_fall":
        game.free_fall(socket);
        break;
    }
  });

  socket.on("disconnect", function () {
    console.log("disconnect");
    game.remove_player(socket);
  });
});
