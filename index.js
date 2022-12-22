const express = require("express");
const cors = require("cors");
const http = require("http");
const socketio = require("socket.io");

const router = require("./router");

const app = express();

const server = http.createServer(app);

// Socket Instance
const io = socketio(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(cors);

// Route
app.use(router);

///DATA
function generateData(size) {
  var digits = 3;
  return Array.apply(null, { length: size || 100 }).map(function () {
    return Math.floor(Math.random() * Math.pow(10, digits) + Math.pow(10, digits)).toString().slice(-digits);
  });
}

io.on("connection", (socket) => {
  console.log("New Connection");

  // Listen from client
  // Callback: handle error

  // listen to message from frontend
  socket.on("fetchRequestForLineChart", (message, callback) => {
    console.log(message, 'mesage')
    setInterval(function(){
      var data = generateData(100);
      console.log(data, 'sending dataa')
      io.sockets.emit('lineChartFetchResponse', data);
    },2000);
  });

  socket.on("disconnect", () => {
    // Refresh page from frontend -> get welcome again

  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server running on ${PORT}`));
