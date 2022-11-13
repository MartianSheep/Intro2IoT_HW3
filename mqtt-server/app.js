const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, { cors:{origin:'*'}});

const mqtt = require('mqtt')
const opt = {
    port: 1883,
    clientId: 'nodejs',
}



io.on('connection', (socket) => {
  console.log('a user connected');
});

server.listen(8000, () => {
  console.log('listening on *:8000');
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

io.on("mqtt", (socket)=>{
    console.log('receive mqtt: '+socket);
    
})
var client = mqtt.connect('mqtt://127.0.0.1', opt);

    client.on( 'connect', () => {
            console.log('connected!!')
            client.subscribe('iot/hw3/mqtt')
        }
    )
    client.on( 'message', (topic, msg) => {
            console.log(topic + ': ' + msg.toString())
            io.emit("mqtt", msg.toString())
        }
    )


