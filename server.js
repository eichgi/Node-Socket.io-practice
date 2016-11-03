let PORT = process.env.PORT || 3000;
const express = require('express');
let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);
let moment = require('moment');
let now = moment();

app.use(express.static(__dirname + '/public'));

let clientInfo = {};

//Sends current users to provided socket
function sendCurrentUsers(socket) {
    var info = clientInfo[socket.id];
    var users = [];

    if (typeof info === 'undefined') {
        return;
    }

    Object.keys(clientInfo).forEach(function (socketId) {
        var userInfo = clientInfo[socketId];
        if (info.room === userInfo.room) {
            users.push(userInfo.name);
        }
    });

    socket.emit('message', {
        name: 'System',
        text: 'Current users: ' + users.join(', '),
        timestamp: moment().valueOf()
    });
}

io.on('connection', function (socket) {
    console.log('User connected via socket.io!');

    socket.on('disconnect', function () {
        var userData = clientInfo[socket.id];

        if (typeof userData !== 'undefined') {
            socket.leave(userData.room);
            io.to(userData.room).emit('message', {
                name: 'System',
                text: userData.name + ' has left!',
                timestamp: moment().valueOf()
            });
            delete clientInfo[socket.id];
        }
    });

    socket.on('joinRoom', function (req) {
        clientInfo[socket.id] = req;
        socket.join(req.room);
        socket.broadcast.to(req.room).emit('message', {
            name: 'System',
            text: req.name + ' has joined!',
            timestamp: moment.valueOf()
        });
    });

    socket.on('message', function (message) {
        console.log('Message received: ' + message.text);
        //socket.broadcast.emit('message', message); //emitted to everyone 'cept the sender

        if (message.text === '@currentUsers') {
            sendCurrentUsers(socket);
        } else {
            message.timestamp = moment().valueOf();
            io.to(clientInfo[socket.id].room).emit('message', message); //emitted to everyone
        }
    });

    let timestamp = now.valueOf();
    let timestampMoment = moment.utc(timestamp);

    socket.emit('message', {
        name: 'System',
        text: 'Welcome to the chat appplication',
        timestamp: moment().valueOf()
    });
});

http.listen(PORT, function () {
    console.log('Server started');
});
