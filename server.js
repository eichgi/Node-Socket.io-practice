let PORT = process.env.PORT || 3000;
const express = require('express');
let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

io.on('connection', function () {
    console.log('User connected via socket.io!');
});

http.listen(PORT, function () {
    console.log('Server started');
});
