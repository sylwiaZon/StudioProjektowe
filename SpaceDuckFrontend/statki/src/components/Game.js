import React from "react";
import Player from "./Player";
import Registration from "./Registration";
//import GameBoard from "./GameBoard";

class Game extends React.Component {
  constructor() {
    super();
    this.player = new Player();
    this.computer = new Player();
    this.state = {
      value: 0, // 0 - введення вручну, 1 - рандом
      name: "Player", //  ім'я гравця
      playerBoards: this.player.updateBoard(), //створення поля для гравця
      compBoards: this.computer.updateBoard(), //створення поля для компа
      turn: true, //хід, якщо істинна то мій
      startGame: false, // початок гри
      visible: false, // реєстрація
      numberP: 0, //кількість ходів гравця
      numberC: 0, //кількість ходів комп'ютера
      button: true, //кнопка запуску гри
      winner: false, // наявність переможця
      shipsImg: [4, 3, 2, 1],
    };
    this.shipSizes = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1]; //розміри кораблів
    this.numberShip = 0; // порядковий номер корабля
    this.radioB = ["Arrange it yourself", "Random"];
  }

  enterName = (name) => {
    this.setState({ name: name, visible: true });
  }; // ім'я

  onCh = () => {
    if (this.state.value === 0) {
      this.setState({ value: 1, button: true });
    } else {
      this.setState({ value: 0 });
    }
  }; // зміна вибору введення

  boardPlayer = () => {
    this.player.visible(true);
    this.player.random();
    this.player.createField();
    this.setState({ playerBoards: this.player.updateBoard(), button: false });
  }; //створення рандомного поля для гравця

  boardComputet = () => {
    this.computer.visible(false);
    this.computer.random();
    this.computer.createField();
  }; //створення рандомного поля для компа

  updateBoard = () => {
    this.setState({
      playerBoards: this.player.updateBoard(),
      compBoards: this.computer.updateBoard(),
    });
  }; //оновлення полів

  shotComputer = () => {
    const pos = this.player.possibility();
    if (!this.state.turn && pos === 0) {
      this.setState({
        playerBoards: this.player.updateBoard(),
        turn: !this.state.turn,
        numberC: this.state.numberC + 1,
      });
    } else {
      if (!this.state.turn && pos === 1) {
        this.setState({
          playerBoards: this.player.updateBoard(),
          numberC: this.state.numberC + 1,
        });
      }
    }
    this.checkWinner();
  }; // вистріл компа вручну

  shotRandComputer = () => {
    let flag = false;
    while (!flag) {
      const x = Math.floor(Math.random() * 10);
      const y = Math.floor(Math.random() * 10);
      const pos = this.player.possibility(x, y);
      if (pos === 0) {
        flag = true;
        this.setState({
          playerBoards: this.player.updateBoard(),
          turn: !this.state.turn,
          numberC: this.state.numberC + 1,
        });
      } else {
        if (pos === 1) {
          this.setState({
            playerBoards: this.player.updateBoard(),
            numberC: this.state.numberC + 1,
          });
        }
      }
    }
    this.checkWinner();
  }; // вистріл компа рандомно

  shotPlayer = () => {
    const pos = this.computer.possibility();
    if (this.state.turn && pos === 0) {
      this.setState({
        compBoards: this.computer.updateBoard(),
        turn: !this.state.turn,
        numberP: this.state.numberP + 1,
      });
    } else {
      if (this.state.turn && pos === 1) {
        this.setState({
          compBoards: this.computer.updateBoard(),
          numberP: this.state.numberP + 1,
        });
      }
    }
    this.checkWinner();
  }; // вистріл гравця

  start = () => {
    const turn = Math.random() >= 0.5;
    this.setState({ startGame: true, turn: turn });
    this.boardComputet();
    //this.boardPlayer();
    this.updateBoard();
  }; //запуск гри

  reStart = () => {
    this.setState({ startGame: false });
    this.clearAll();
    this.player.restartGame([4, 3, 3, 2, 2, 2, 1, 1, 1, 1]);
    this.computer.restartGame([4, 3, 3, 2, 2, 2, 1, 1, 1, 1]);
  }; //перезапуск гри

  addShip = () => {
    if (this.state.value === 0 && this.numberShip < this.shipSizes.length) {
      if (this.player.getXY(this.shipSizes[this.numberShip])) {
        this.numberShip = this.numberShip + 1;
      }
      this.setState({ playerBoards: this.player.updateBoard() });
      if (this.numberShip === 10) {
        this.setState({ button: false });
      }
      console.log(this.numberShip);
    }
  }; //додавання кораблів

  clear = () => {
    this.player.clear();
    if (this.numberShip > 0) {
      this.numberShip = this.numberShip - 1;
    }
    this.setState({ playerBoards: this.player.updateBoard() });
  }; //очистити останній корабель

  clearAll = () => {
    this.player.clearAll();
    this.numberShip = 0;
    this.setState({ playerBoards: this.player.updateBoard(), button: true });
  }; //очистити поле

  checkWinner = () => {
    if (
      this.player.getDestruction().length === 0 ||
      this.computer.getDestruction().length === 0
    ) {
      this.setState({ winner: true });
    }
  };
  render() {
    const radio = this.radioB.map((element, index) => {
      return (
        <div key={index}>
          <input
            type="radio"
            checked={this.state.value === index}
            onChange={this.onCh}
          ></input>
          {element}
        </div>
      );
    });

    const imgShips = this.state.shipsImg.map((element) => {
      return (
        <div className="shipImg" key={element}>
          <p>
            {
              this.player.getDestruction().filter((size) => size === element)
                .length
            }{" "}
            :
          </p>
          <img
            src={"/img/" + element + "desk.png"}
            alt={"fire"}
            width={80 + 20 * element}
            height={50}
          />
          <p>
            :{" "}
            {
              this.computer.getDestruction().filter((size) => size === element)
                .length
            }
          </p>
        </div>
      );
    });

    if (!this.state.turn) {
      this.shotRandComputer();
    }

    return (
      <div>
        {" "}
        {!this.state.visible ? (
          <Registration enterName={this.enterName} />
        ) : (
          <div className="GameBoard">
            {!this.state.startGame ? (
              <div>
                <h1 className={this.state.turn ? "name green" : "name"}>
                  {this.state.name}
                </h1>
                <h3 className="name">Choose a way to arrange your ships: </h3>
                <div className="menu">
                  <div className="menuB">
                    <div className="radio">{radio}</div>
                    <div>
                      {this.state.value === 0 ? (
                        <div>
                          <button className="btn" onClick={this.clear}>
                            Clear
                          </button>
                          <button className="btn" onClick={this.clearAll}>
                            Clear All
                          </button>
                        </div>
                      ) : (
                        <button className="btn" onClick={this.boardPlayer}>
                          Rand
                        </button>
                      )}
                    </div>
                    <div>
                      <button
                        onClick={this.start}
                        disabled={this.state.button}
                        className="btnStart"
                      >
                        Star game
                      </button>
                    </div>
                  </div>
                </div>
                <div onClick={this.addShip}>{this.state.playerBoards}</div>
              </div>
            ) : (
              <div className="GameBoard">
                <div>
                  <h1 className={this.state.turn ? "name green" : "name"}>
                    {this.state.name}
                  </h1>
                  <div onClick={this.shotComputer}>
                    {this.state.playerBoards}
                  </div>
                </div>
                <div className="info">
                  {this.state.winner ? (
                    <h2>
                      {this.state.turn
                        ? "Winner: " + this.state.name
                        : "You lose!"}
                    </h2>
                  ) : null}
                  {imgShips}
                  <button onClick={this.reStart} className="btnStart">
                    {this.state.winner ? "Play again" : "Restart"}
                  </button>
                </div>
                <div>
                  <h1 className={!this.state.turn ? "name green" : "name"}>
                    Computer
                  </h1>
                  <div onClick={this.shotPlayer}>{this.state.compBoards}</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default Game;
