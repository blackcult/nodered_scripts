var total = msg.total;
var ledservicename = msg.payload.attributes.friendly_name;
var ledstacknamear = ledservicename.split(" ");
var servicenamear = "";
var ledcolorname = msg.payload.attributes.friendly_name;
var ledcolorar = ledcolorname.split(" ");
msg.payload.data = {};
var prio = 1;
msg.payload.service = "turn_off";
var current_state = "turn_" + msg.payload.state;
var current_time = msg.time;
var created_time = "";
var existence = "";

for (var i=0;i<total;i++) {
    servicename = msg.json.incidents[i].service.summary;
    stacknamear = servicename.split(" ");
    created_time = new Date(msg.json.incidents[i].created_at)
    existence = (current_time - created_time)/60000
    if (ledstacknamear[0] == stacknamear[1]) {
        msg.payload.data.entity_id = msg.payload.entity_id;
        if (ledcolorar[1] == "red" && msg.json.incidents[i].urgency == "high") {
            if (msg.json.incidents[i].status == "acknowledged" && prio <= 2) {
                msg.payload.service = "turn_on";
                msg.payload.data.effect = "None";
                prio = 2
            } else if (msg.json.incidents[i].status == "triggered" && prio <= 4 && existence > 7 && typeof msg.json.incidents[i].assignments[1].at !== 'undefined') {
                msg.payload.service = "turn_on";
                msg.payload.data.effect = "Strobe_fast";
                prio = 4
            } else if (msg.json.incidents[i].status == "triggered" && prio <= 3) {
                msg.payload.service = "turn_on";
                msg.payload.data.effect = "Strobe_slow";
                prio = 3
            } else {
                prio = 1
            }  
        } else if (ledcolorar[1] == "yellow" && msg.json.incidents[i].urgency == "low"){
            if (msg.json.incidents[i].status == "acknowledged" && prio <= 2) {
                msg.payload.service = "turn_on";
                msg.payload.data.effect = "None";
                prio = 2
            } else if (msg.json.incidents[i].status == "triggered" && prio <= 3) {
                msg.payload.service = "turn_on";
                msg.payload.data.effect = "Strobe_slow";
                prio = 3
            } else {
                prio = 1
            }  
        }
    }
}

if (msg.payload.data.entity_id == null) {
    msg.payload.data.entity_id = msg.payload.entity_id;
}

if (current_state == msg.payload.service && msg.payload.data.effect == msg.payload.attributes.effect) {
    return [msg, null];
} else {
    return [null, msg]
}