var total_triggered = msg.payload.total;
var total_acknowledged = msg.acknowledged.total;
msg.total = total_acknowledged + total_triggered
//testcomment

for (var i = 0;i<total_acknowledged;i++) {
    var new_number = total_triggered + i;
    msg.payload.incidents[new_number] = msg.acknowledged.incidents[i];
}
return msg;