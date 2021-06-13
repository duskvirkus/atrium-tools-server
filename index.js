const express = require("express")
const app = express();

app.use(express.static('public'));

const server = require("http").createServer(app);
const io = require("socket.io")(server);

const {ControlsData} = require('./ControlsData');
const controlsData = new ControlsData(io);

const controlHandler = require("./controls");

io.on("connection", socket => {
  console.log(`socket connected: ${socket.id}`);
  socket.on('control', controlHandler(controlsData, socket));
});
server.listen(3000);
