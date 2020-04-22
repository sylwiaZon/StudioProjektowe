import React, { Component } from 'react';
import * as signalR from "@microsoft/signalr";

class Chat extends Component {
  constructor(props) {
    super(props);
 
    this.state = {
        nick: '',
        message: '',
        messages: [],
        hubConnection: null,
      };
  }
  
  componentDidMount = () => {
    const nick = window.prompt('Your name:', 'John');

    const hubConnection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:44305/kalamburyHub")
    .configureLogging(signalR.LogLevel.Information)  
    .build();

    this.setState({ hubConnection, nick }, () => {
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

  addToGame = () => {
    this.state.hubConnection
      .invoke('AddToGameGroup', '1', this.state.nick)
      .catch(err => console.error(err));
  
      this.setState({message: ''});      
  };

  removeFromGame = () => {
    this.state.hubConnection
      .invoke('RemoveFromGameGroup','1', this.state.nick)
      .catch(err => console.error(err));
  
      this.setState({message: ''});      
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
//   constructor(props) {
//     super(props);
    
//     this.state = {
//       nick: '',
//       message: '',
//       messages: [],
//       hubConnection: null,
//     };
//   }

//   componentDidMount = () => {
//     const nick = window.prompt('Your name:', 'John');

//     const hubConnection = new HubConnectionBuilder().withUrl('http://localhost:44305/kalambury').build();

//     this.setState({ hubConnection, nick }, () => {
//       this.state.hubConnection
//         .start()
//         .then(() => console.log('Connection started!'))
//         .catch(err => console.log('Error while establishing connection :('));

//       this.state.hubConnection.on('Send', receivedMessage => {
//         const text = `${receivedMessage}`;
//         const messages = this.state.messages.concat([text]);
//         this.setState({ messages });
//       });
//     });
//   }

//   sendMessage = () => {
//     this.state.hubConnection
//       .invoke('ReceiveMessage', this.state.nick, this.state.message)
//       .catch(err => console.error(err));
  
//       this.setState({message: ''});      
//   };
  
//   render() {
//     return (
//       <div>
//         <br />
//         <input
//           type="text"
//           value={this.state.message}
//           onChange={e => this.setState({ message: e.target.value })}
//         />
  
//         <button onClick={this.sendMessage}>Send</button>
  
//         <div>
//           {this.state.messages.map((message, index) => (
//             <span style={{display: 'block'}} key={index}> {message} </span>
//           ))}
//         </div>
//       </div>
//     );
//   }
// }

