let moment = require('moment');
let now = moment();

//console.log(now.format('MMM Do YYYY, h:mma'));
/*console.log(now.format());
 console.log(now.format('X'));
 console.log(now.format('x'));
 console.log(now.valueOf());*/

//let timestamp = 1477957449377;
let timestamp = now.valueOf();
let timestampMoment = moment.utc(timestamp);

console.log(timestampMoment.local().format('h:mm a'));
