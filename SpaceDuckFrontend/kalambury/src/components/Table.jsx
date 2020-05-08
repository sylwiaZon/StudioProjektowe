import React from 'react';
import watch from '../assets/Obserwuj.png';
import locked from '../assets/lock.png';
import play from '../assets/play.png';
import unlocked from '../assets/Unlocked.png';
import address from '../configuration.json';
import history from '../history.jsx';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

class Table extends React.Component {
    constructor() {
        super();
        this.state = {
            players: [],
            isDataFetched: false
        }
    }

    addPlayers(data){
        var len = this.props.playersIds.length;
        this.state.players.push(data);
        if(len == this.state.players.length){
            this.setState({isDataFetched: true});
        }
    }

    componentDidMount(){
        this.props.playersIds.map(id => {
            fetch('https://'+address.backendURL+address.userInfo+'/'+id)
            .then((response) => {
                if(response.status == 500){
                    this.addPlayers({userName: 'Guest'});
                }
                if(response.status == 200){
                    response.json()
                    .then((responseJson) => {
                        this.addPlayers(responseJson);
                    })
                }
            })
        })
    }

    joinGame(){
        cookies.set('currentTable', this.props.table, { path: '/' });
        history.push('/game');
    }

    goToGame(){
        if(this.props.isFull){
            return (
                <button className="table-button" type="button">
                    <img src={watch} className="watch-table-image" alt="Watch table"/>
                </button>
            );
        } else {
            return(
                <button className="table-button" type="button" onClick={() => this.joinGame()}>
                    <img src={play} className="play-image" alt="play"/>
                </button>
            );
        }
    }

    getRoundDuration(){
        var minutes = Math.floor(this.props.roomConfiguration.roundDuration / 60);
        var seconds = this.props.roomConfiguration.roundDuration % 60;
        if (seconds < 10) {
            return minutes + ':0' + seconds;
        }
        return minutes + ':' + seconds;
    }

    getTableVisibility(){
        if(this.props.roomConfiguration.isPrivate){
            return <img src={locked} className="table-image" alt="locked table"/>
        }
        else {
            return <img src={unlocked} className="table-image" alt="unlocked table"/>
        }
    }

    isDataFetched(){
        if(this.state.isDataFetched){
            return (
                <ul className="card">
                    <li>#{this.props.id}</li>
                    <li className="players-names">{this.state.players.map(plr => plr.userName + '  ')}</li>
                    <li>{this.props.roomConfiguration.roundCount}</li>
                    <li>{this.getRoundDuration()}</li>
                    <li>{this.getTableVisibility()}</li>
                    <li>
                        {this.goToGame()}
                    </li>
               </ul>
            )
        }
    }

    render() {
      
        return (
            <div>
               {this.isDataFetched()}
            </div>
        )
    }
}


export default Table;