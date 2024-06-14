const express = require('express');
const path = require("path");

const app = express();
const server = require('http').createServer(app);

const io = require("socket.io")(server);

app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  // res.send('Hello, World!');
});

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("newuser",(username)=>{
    socket.broadcast.emit("update", {username:username,role:"join"});
  })

  socket.on("exituser",(username)=>{
    socket.broadcast.emit("update", {username:username,role:"left"});
  });

  socket.on("chat",(message)=>{
    socket.broadcast.emit("chat", message);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
})

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
})