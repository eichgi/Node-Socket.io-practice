var name = getQueryVariable('name') || 'Annonymous',
    room = getQueryVariable('room') || 'Main room';
var socket = io();

console.log(name + ' - ' + room);
$('.room-title').html(room + ' Channel');

socket.on('connect', function () {
    console.log('Connected to socket.io server');
    socket.emit('joinRoom', {
        name: name,
        room: room
    });
});

socket.on('message', function (message) {
    var momentTimestamp = moment.utc(message.timestamp);
    var $messages = $('.messages');
    var $message = $('<li class="list-group-item"></li>');
    console.log('New message: ' + message.text);

    $message.append('<p><strong>' + message.name + ' ' + momentTimestamp.local().format('h:mm a') + '</strong></p>');
    $message.append('<p>' + message.text + '</p>');
    $messages.append($message);

    //$('.messages').append('<p><strong>' + momentTimestamp.local().format('h:mm a') + ':</strong>' + message.text + '</p>');
});

var $form = jQuery('#message-form');

$form.on('submit', function (event) {
    event.preventDefault();
    socket.emit('message', {
        name: name,
        text: $form.find('input[name=message]').val()
    });
    $form.find('input[name=message]').val('');
});