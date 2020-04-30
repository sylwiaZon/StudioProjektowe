import React, { Component } from 'react';
import * as signalR from "@microsoft/signalr";

class Chat extends Component {
  constructor(props) {
    super(props);
 
    this.state = {
        nick: '',
        id: '',
        message: '',
        messages: [],
        hubConnection: null,
        word: '',
        roomId: ''
      };
  }
  
  componentDidMount = () => {
    const nick = window.prompt('Your name:', 'John');
    const id = window.prompt('Your Id:', '1');
    const roomId = window.prompt('Your roomId:', '1');


    const hubConnection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:5003/kalamburyHub")
    .configureLogging(signalR.LogLevel.Information)  
    .build();

    this.setState({ hubConnection, nick, id, roomId }, () => {
        this.state.hubConnection
          .start()
          .then(() => console.log('Connection started!'))
          .catch(err => console.log('Error while establishing connection :('));
  
        this.state.hubConnection.on('ReceiveMessage', (nick, receivedMessage) => {
          const text = `${nick}: ${receivedMessage}`;
          const messages = this.state.messages.concat([text]);
          this.setState({ messages });
        });

        this.state.hubConnection.on('Send', (receivedMessage) => {
            const text = `server: ${receivedMessage}`;
            const messages = this.state.messages.concat([text]);
            this.setState({ messages });
          });

        this.state.hubConnection.on('GameStatus', (status) => {
              console.log(status);
          });

        this.state.hubConnection.on('Points', (points) => {
            console.log(points);
        });

      });
    }
  
//   this.setState({bookingHubConnection}, () => {
//     this.state.bookingHubConnection.start()
//     .then(() => console.log('SignalR Started'))
//     .catch(err => console.log('Error connecting SignalR - ' + err));

//     this.state.bookingHubConnection.on('SendMessage', (message) => {
//       const bookingMessage = message;
//       this.setState({bookingMessage});
//     });
//   });

sendMessage = () => {
    this.state.hubConnection
      .invoke('SendMessage', this.state.nick, this.state.message)
      .catch(err => console.error(err));
  
      this.setState({message: ''});      
  };

  sendWord = () => {
    this.state.hubConnection
      .invoke('CheckGivenWord', this.state.roomId, {Word: this.state.word, PlayerId: this.state.id})
      .catch(err => console.error(err));
  
      this.setState({word: ''});      
  };

  addToGame = () => {
    this.state.hubConnection
      .invoke('AddToGameGroup', this.state.roomId, this.state.id)
      .catch(err => console.error(err));
  
      this.setState({message: ''});
  };

  removeFromGame = () => {
    this.state.hubConnection
      .invoke('RemoveFromGameGroup',this.state.roomId, this.state.id)
      .catch(err => console.error(err));
  
      this.setState({message: ''});  
  };

  addToDrawing = () => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    };

    fetch(`https://localhost:5003/kalambury/api/game/${this.state.roomId}/drawing/${this.state.id}`, requestOptions)
        //.then(response => response.json())    
  };

  removeFromDrawing = () => {
    const requestOptions = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    };

    fetch(`https://localhost:5003/kalambury/api/game/${this.state.roomId}/drawing/${this.state.id}`, requestOptions)
        //.then(response => response.json())    
  };
  
  render() {
    return (
        <div>
      <br />
      <input
        type="text"
        value={this.state.message}
        onChange={e => this.setState({ message: e.target.value })}
      />

      <button onClick={this.sendMessage}>Send</button>
      <button onClick={this.addToGame}>Add</button>
      <button onClick={this.removeFromGame}>Remove</button>
      <button onClick={this.addToDrawing}>Rysuj</button>
      <button onClick={this.removeFromDrawing}>nieRysuj</button>


      <div>
      <input
        type="text"
        value={this.state.word}
        onChange={e => this.setState({ word: e.target.value })}
      />
        <button onClick={this.sendWord}>Sprawdz słowo</button>
      </div>

      <div>
        {this.state.messages.map((message, index) => (
          <span style={{display: 'block'}} key={index}> {message} </span>
        ))}
      </div>
    </div>
    ); 
  } 
}

export default Chat;