const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"],
    allowedHeaders: ["Access-Control-Allow-Origin"],
    credentials: true
  }
});

const PORT = process.env.PORT || 8888;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const allusers = {};

io.on('connection', (socket) => {
  console.log('a user connected', socket.id);
  // io.emit("change", socket.id)

  allusers[socket.id] = {left: 0, top: 0};
  io.emit("user_connected", allusers);

  socket.on("add_item", (text)=>{
    io.emit("change", socket.id, text)
  })
  socket.on("delete_item", (items) => {
    io.emit("delete", socket.id, items)
  })
  socket.on("mouse_moved", (x,y)=> {
    socket.broadcast.emit("change_mouse", x, y, socket.id);
    //socket.broadcast.emit
  })
  socket.on("disconnect", () => {
    delete allusers[socket.id];
    io.emit("user_connected", allusers);
  })
});

server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});