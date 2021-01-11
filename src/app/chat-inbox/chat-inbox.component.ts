import { Component, OnInit } from '@angular/core';
import { io } from 'socket.io-client';

// const SOCKET_ENDPOINT = 'https://chatnodebackend.herokuapp.com';
const SOCKET_ENDPOINT = 'http://localhost:3000';


@Component({
  selector: 'app-chat-inbox',
  templateUrl: './chat-inbox.component.html',
  styleUrls: ['./chat-inbox.component.css']
})
export class ChatInboxComponent implements OnInit {
  socket;
  send_message: string;
  new_message: string;
  user_send: string;
  messageArray = Array<object>();

  constructor() {


  }

  ngOnInit() {
    this.setupSocketConnection();
  }

  SendMessage() {
    if (this.send_message) {
      this.new_message = this.send_message;
      let dateTime = new Date()
      let minuteAndHour = dateTime.getHours() + ':' + dateTime.getMinutes()

      let data = this.send_message + "|" + minuteAndHour

      this.socket.emit('message', data);


      let messageObj = {};
      messageObj["message"] = this.send_message;
      messageObj["minuteAndHour"] = minuteAndHour;
      messageObj["user"] = "me"

      this.messageArray.push(messageObj);

      this.send_message = '';
    }


  }

  setupSocketConnection() {
    this.socket = io(SOCKET_ENDPOINT);
    this.socket.on('message-broadcast', (data: string) => {
      if (data) {

        let dataSplit = data.split("|");
        let message = dataSplit[0];
        let minuteAndHour = dataSplit[1];

        let messageObj = {};
        messageObj["message"] = message;
        messageObj["minuteAndHour"] = minuteAndHour;
        messageObj["user"] = "you"

        this.messageArray.push(messageObj);
        this.new_message = data;
      }
    });
  }

}
