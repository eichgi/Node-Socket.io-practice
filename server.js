let PORT = process.env.PORT || 3000;
const express = require('express');
let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);
let moment = require('moment');
let now = moment();

app.use(express.static(__dirname + '/public'));

io.on('connection', function (socket) {
    console.log('User connected via socket.io!');

    socket.on('message', function (message) {
        console.log('Message received: ' + message.text);
        //socket.broadcast.emit('message', message); //emitted to everyone 'cept the sender

        message.timestamp = moment().valueOf();
        io.emit('message', message); //emitted to everyone
    });

    let timestamp = now.valueOf();
    let timestampMoment = moment.utc(timestamp);

    socket.emit('message', {
        text: 'Welcome to the chat appplication',
        timestamp: moment().valueOf()
    });
});

http.listen(PORT, function () {
    console.log('Server started');
});
