// NOTE: The contents of this file will only be executed if
// you uncomment its entry in "web/static/js/app.js".

// To use Phoenix channels, the first step is to import Socket
// and connect at the socket path in "lib/my_app/endpoint.ex":
import {Socket, Presence} from "phoenix"

let socket = new Socket("/socket", {params: {token: window.userToken}})

socket.connect()

let channel = socket.channel("lobby", {})
let message = $('#message-input')
let chatMessages = document.getElementById("chat-messages")
let presences = {}
let onlineUsers = document.getElementById("online-users")

const listUsers = (user) => {
  return {
    user: user
  }
}

const renderUsers = (presences) => {
  onlineUsers.innerHTML = Presence.list(presences, listUsers)
  .map(presence => `
    <li>${presence.user}</li>`).join("")
}

const get_data_from_diff = (diff, key) => {
  const messageType = key == 'join' ? 'joined' : 'leaved';
  let message = document.createElement("div");
  message.className = key;
  message.innerHTML = Object.keys(diff[`${key}s`]).reduce((acc, name) => {
    return `${acc}\n<i>${name} ${messageType} the channel</i><br>`;
  }, '');

  return message;
}

message.focus();

message.on('keypress', event => {
  if(event.keyCode == 13) {
    channel.push('message:new', {message: message.val()})
    message.val("")
  }
});
channel.on('message:new', payload => {
  let template = document.createElement("div");
  template.innerHTML = `<b>${payload.user}</b>: ${payload.message}<br>`
  chatMessages.appendChild(template);
  chatMessages.scrollTop = chatMessages.scrollHeight;
})

channel.on('presence_state', state => {
  presences = Presence.syncState(presences, state)
  renderUsers(presences)
});

channel.on('presence_diff', diff => {
  const leaves = get_data_from_diff(diff, 'leave');
  const joins = get_data_from_diff(diff, 'join');
  chatMessages.appendChild(leaves);
  chatMessages.appendChild(joins);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  presences = Presence.syncDiff(presences, diff)
  renderUsers(presences)
});

channel.join()
  .receive("ok", resp => { console.log("Joined successfully", resp) })
  .receive("error", resp => { console.log("Unable to join", resp) })

export default socket
