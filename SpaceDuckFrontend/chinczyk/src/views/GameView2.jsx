import React from "react";
import './game-styles.css'

let currPos = 0;
const step = 41.5;
let currcolor = '';
let NumOfPaw = '';
let num = 0;
let clicked = false;
let currpawn = '';
const allcolor = ['red', 'blue', 'green', 'yellow'];
const pawnOut = { red: 0, blue: 0, green: 0, yellow: 0 };

export default function() {

  function haveHover() {
    let count = 0;
    let toKill = '';
    for (let i = 0; i < allcolor.length; i++) {
      for (let n = 1; n <= 4; n++) {
        const firstPawn = document.getElementById(`${allcolor[i]}pawn${n}`);
        const secondPawn = document.getElementById(currpawn);
        if (firstPawn.style.top == secondPawn.style.top && firstPawn.style.left == secondPawn.style.left && currcolor != allcolor[i] && currPos + num < 44) {
          count++;
          toKill = `${allcolor[i]}pawn${n}`;
          return toKill;
        }
      }
    }
    return false;
  }

  function stuck() {
    if (onboard[currpawn] == 0 || currPos + num > 44) {
      if (dontHaveOtherFree() || currPos + num > 44) {
        const badtext = document.getElementById('badtext');
        badtext.innerText = 'Unfortunatlly you stuck';
        clicked = false;
        const dice = document.getElementById('dice');
        dice.style.backgroundImage = 'url(images/dice/dice.png)';
        setTimeout(changePlayer, 1000);
      }
    }
  }

  function changePlayer() {
    if (num != 6) {
      const text = document.getElementById('player');
      switch (text.innerText) {
        case 'red':
          text.innerText = text.style.color = 'blue';
          break;
        case 'blue':
          text.innerText = text.style.color = 'yellow';
          break;
        case 'yellow':
          text.innerText = text.style.color = 'green';
          break;
        case 'green':
          text.innerText = text.style.color = 'red';
          break;
      }
    }
    const badtext = document.getElementById('badtext');
    badtext.innerText = '';
    const dice = document.getElementById('dice');
    dice.style.backgroundImage = 'url(/images/dice/dice.png)';
  }

  const positions = {
    redpawn1: 0, redpawn2: 0, redpawn3: 0, redpawn4: 0,
    bluepawn1: 0, bluepawn2: 0, bluepawn3: 0, bluepawn4: 0,
    greenpawn1: 0, greenpawn2: 0, greenpawn3: 0, greenpawn4: 0,
    yellowpawn1: 0, yellowpawn2: 0, yellowpawn3: 0, yellowpawn4: 0
  };
  var onboard = {
    redpawn1: 0, redpawn2: 0, redpawn3: 0, redpawn4: 0,
    bluepawn1: 0, bluepawn2: 0, bluepawn3: 0, bluepawn4: 0,
    greenpawn1: 0, greenpawn2: 0, greenpawn3: 0, greenpawn4: 0,
    yellowpawn1: 0, yellowpawn2: 0, yellowpawn3: 0, yellowpawn4: 0
  };

  function dontHaveOtherFree() {
    const text = document.getElementById('player');
    for (let i = 1; i <= 4; i++) {
      if (onboard[`${text.innerText}pawn${i}`] == 1 || positions[`${text.innerText}pawn${i}`] + num >= 44) {
        return false;
      }
    }
    return true;
  }

  function checkForWinner() {
    if (pawnOut[currcolor] == 4) {
      const dice = document.getElementById('dice');
      const player = document.getElementById('player');
      const textContainer1 = document.getElementById('textContainer1');
      const textContainer2 = document.getElementById('textContainer2');
      dice.innerText = '';
      dice.style.visibility = 'hidden';
      textContainer1.innerText = '';
      textContainer2.innerText = '';
      player.innerText = `The Winner is the ${currcolor} player`;
    }
  }

  function stepDown() {
    const doc = document.getElementById(`${currcolor}pawn${NumOfPaw}`);
    const curr = Number(doc.style.top.replace(/[a-z]/g, ''));
    doc.style.top = `${curr + step}px`;
    currPos++;
  }

  function stepUp() {
    const doc = document.getElementById(currpawn);
    const curr = Number(doc.style.top.replace(/[a-z]/g, ''));
    doc.style.top = `${curr - step}px`;
    currPos++;
  }

  function stepLeft() {
    const doc = document.getElementById(currpawn);
    const curr = Number(doc.style.left.replace(/[a-z]/g, ''));
    doc.style.left = `${curr - step}px`;
    currPos++;
  }

  function stepRight() {
    const doc = document.getElementById(currpawn);
    const curr = Number(doc.style.left.replace(/[a-z]/g, ''));
    doc.style.left = `${curr + step}px`;
    currPos++;
  }

  const stepsRed = [];
  const stepsYellow = [];
  const stepsBlue = [];
  const stepsGreen = [];

  function pushSteps(value, steps, count) {
    for (let i = 0; i < count; i++) {
      steps.push(value);
    }
  }

// Red pawns path
  pushSteps(stepDown, stepsRed, 4);
  pushSteps(stepRight, stepsRed, 4);
  pushSteps(stepDown, stepsRed, 2);
  pushSteps(stepLeft, stepsRed, 4);
  pushSteps(stepDown, stepsRed, 4);
  pushSteps(stepLeft, stepsRed, 2);
  pushSteps(stepUp, stepsRed, 4);
  pushSteps(stepLeft, stepsRed, 4);
  pushSteps(stepUp, stepsRed, 2);
  pushSteps(stepRight, stepsRed, 4);
  pushSteps(stepUp, stepsRed, 4);
  pushSteps(stepRight, stepsRed, 1);
  pushSteps(stepDown, stepsRed, 5);
// Yellow pawns path

  pushSteps(stepUp, stepsYellow, 4);
  pushSteps(stepLeft, stepsYellow, 4);
  pushSteps(stepUp, stepsYellow, 2);
  pushSteps(stepRight, stepsYellow, 4);
  pushSteps(stepUp, stepsYellow, 4);
  pushSteps(stepRight, stepsYellow, 2);
  pushSteps(stepDown, stepsYellow, 4);
  pushSteps(stepRight, stepsYellow, 4);
  pushSteps(stepDown, stepsYellow, 2);
  pushSteps(stepLeft, stepsYellow, 4);
  pushSteps(stepDown, stepsYellow, 4);
  pushSteps(stepLeft, stepsYellow, 1);
  pushSteps(stepUp, stepsYellow, 5);

// Blue pawns path
  pushSteps(stepLeft, stepsBlue, 4);
  pushSteps(stepDown, stepsBlue, 4);
  pushSteps(stepLeft, stepsBlue, 2);
  pushSteps(stepUp, stepsBlue, 4, 2);
  pushSteps(stepLeft, stepsBlue, 4);
  pushSteps(stepUp, stepsBlue, 2);
  pushSteps(stepRight, stepsBlue, 4);
  pushSteps(stepUp, stepsBlue, 4);
  pushSteps(stepRight, stepsBlue, 2);
  pushSteps(stepDown, stepsBlue, 4);
  pushSteps(stepRight, stepsBlue, 4);
  pushSteps(stepDown, stepsBlue, 1);
  pushSteps(stepLeft, stepsBlue, 5);

// Green pawns path
  pushSteps(stepRight, stepsGreen, 4);
  pushSteps(stepUp, stepsGreen, 4);
  pushSteps(stepRight, stepsGreen, 2);
  pushSteps(stepDown, stepsGreen, 4);
  pushSteps(stepRight, stepsGreen, 4);
  pushSteps(stepDown, stepsGreen, 2);
  pushSteps(stepLeft, stepsGreen, 4);
  pushSteps(stepDown, stepsGreen, 4);
  pushSteps(stepLeft, stepsGreen, 2);
  pushSteps(stepUp, stepsGreen, 4);
  pushSteps(stepLeft, stepsGreen, 4);
  pushSteps(stepUp, stepsGreen, 1);
  pushSteps(stepRight, stepsGreen, 5);

  function resetPawn(victim) {
    onboard[victim] = 0;
    positions[victim] = 0;
    const pawnToMove = document.getElementById(victim);
    switch (victim) {
      case 'redpawn1':
        pawnToMove.style.top = `${174}px`;
        pawnToMove.style.left = `${472}px`;
        break;
      case 'redpawn2':
        pawnToMove.style.top = `${133}px`;
        pawnToMove.style.left = `${472}px`;
        break;
      case 'redpawn3':
        pawnToMove.style.top = `${133}px`;
        pawnToMove.style.left = `${515}px`;
        break;
      case 'redpawn4':
        pawnToMove.style.top = `${174}px`;
        pawnToMove.style.left = `${515}px`;
        break;
      case 'bluepawn1':
        pawnToMove.style.top = `${519}px`;
        pawnToMove.style.left = `${516}px`;
        break;
      case 'bluepawn2':
        pawnToMove.style.top = `${519}px`;
        pawnToMove.style.left = `${473}px`;
        break;
      case 'bluepawn3':
        pawnToMove.style.top = `${560}px`;
        pawnToMove.style.left = `${516}px`;
        break;
      case 'bluepawn4':
        pawnToMove.style.top = `${560}px`;
        pawnToMove.style.left = `${473}px`;
        break;
      case 'greenpawn1':
        pawnToMove.style.top = `${175}px`;
        pawnToMove.style.left = `${95}px`;
        break;
      case 'greenpawn2':
        pawnToMove.style.top = `${134}px`;
        pawnToMove.style.left = `${138}px`;
        break;
      case 'greenpawn3':
        pawnToMove.style.top = `${134}px`;
        pawnToMove.style.left = `${95}px`;
        break;
      case 'greenpawn4':
        pawnToMove.style.top = `${175}px`;
        pawnToMove.style.left = `${138}px`;
        break;
      case 'yellowpawn1':
        pawnToMove.style.top = `${560}px`;
        pawnToMove.style.left = `${96}px`;
        break;
      case 'yellowpawn2':
        pawnToMove.style.top = `${519}px`;
        pawnToMove.style.left = `${138}px`;
        break;
      case 'yellowpawn3':
        pawnToMove.style.top = `${560}px`;
        pawnToMove.style.left = `${138}px`;
        break;
      case 'yellowpawn4':
        pawnToMove.style.top = `${519}px`;
        pawnToMove.style.left = `${96}px`;
        break;

    }
  }

  function randomNum() {
    if (!clicked) {
      num = Math.floor((Math.random() * 6) + 1);
      const dice = document.getElementById('dice');
      dice.style.backgroundImage = `url(/images/dice/${num}.png)`;
      clicked = true;
    }
    if (num != 6 && dontHaveOtherFree()) {
      const bad = document.getElementById('badtext');
      bad.innerText = 'Unfortunatlly you stuck';
      window.setTimeout(changePlayer, 1000);
      clicked = false;
    }
  }

  function randomMove(Color, paw) {
    const text = document.getElementById('player');
    NumOfPaw = paw;
    currcolor = Color;
    currpawn = `${currcolor}pawn${NumOfPaw}`;
    currPos = positions[currpawn];
    console.log(currPos, positions);
    if (num + currPos > 44) {
      stuck();
    } else if (clicked) {
      const position = currPos;
      if (text.innerText == currcolor) {
        if (onboard[currpawn] === 1 || num === 6) {
          if (onboard[currpawn] === 0) {
            const doc = document.getElementById(currpawn);
            switch (Color) {
              case 'red':
                doc.style.left = `${351}px`;
                doc.style.top = `${134}px`;
                break;

              case 'yellow':
                doc.style.left = `${264}px`;
                doc.style.top = `${561}px`;
                break;

              case 'blue':
                doc.style.left = `${519}px`;
                doc.style.top = `${393}px`;
                break;

              case 'green':
                doc.style.left = `${96}px`;
                doc.style.top = `${305}px`;
                break;
            }
            onboard[currpawn] = 1;
          } else {
            switch (Color) {
              case 'red':
                for (let i = currPos; i < position + num; i++) {
                  stepsRed[i]();
                }
                break;

              case 'yellow':
                for (let i = currPos; i < position + num; i++) {
                  stepsYellow[i]();
                }
                break;

              case 'blue':
                for (let i = currPos; i < position + num; i++) {
                  stepsBlue[i]();
                }
                break;

              case 'green':
                for (let i = currPos; i < position + num; i++) {
                  stepsGreen[i]();
                }
                break;
            }
            positions[currpawn] = currPos;
            const victim = haveHover();
            if (victim != false) {
              resetPawn(victim);
            }
            if (currPos == 44) {
              pawnOut[currcolor]++;
              onboard[currpawn] = 0;
              positions[currpawn] = 0;
              document.getElementById(currpawn).style.visibility = 'hidden';
            }

            checkForWinner();
            changePlayer();
          }
          num = 0;
          clicked = false;
          const dice = document.getElementById('dice');
          dice.style.backgroundImage = 'url(/images/dice/dice.png)';
        } else {
          stuck();
        }
      }
    }
  }


  return (
    <div className="gameScreen">

      <div className="game-container">
        <div className="game-chat">
          <div className="messages">messages messages</div>
        </div>
        <div className="main-game">

          <div id="dice" onClick={() => randomNum()}
               style={{
                 backgroundImage: "url(/images/dice/dice.png)",
                 backgroundSize: 'contain',
                 width: '150px',
                 height: '150px',
                 float: 'left'
               }}>
          </div>

          <div className="pawns" id="redpawn1" onClick={() => randomMove('red', 1)}
               style={{ backgroundColor: '#e400f6', top: '174px', left: '472px' }}/>
          <div className="pawns" id="redpawn2" onClick={() => randomMove('red', 2)}
               style={{ backgroundColor: '#e400f6', top: '133px', left: '472px' }}/>
          <div className="pawns" id="redpawn3" onClick={() => randomMove('red', 3)}
               style={{ backgroundColor: '#e400f6', top: '133px', left: '515px' }}/>
          <div className="pawns" id="redpawn4" onClick={() => randomMove('red', 4)}
               style={{ backgroundColor: '#e400f6', top: '174px', left: '515px' }}/>

          <div className="pawns" id="yellowpawn1" onClick={() => randomMove('yellow', 1)}
               style={{ backgroundColor: '#ffc865', top: '560px', left: '96px' }}/>
          <div className="pawns" id="yellowpawn2" onClick={() => randomMove('yellow', 2)}
               style={{ backgroundColor: '#ffc865', top: '519px', left: '138px' }}/>
          <div className="pawns" id="yellowpawn3" onClick={() => randomMove('yellow', 3)}
               style={{ backgroundColor: '#ffc865', top: '560px', left: '138px' }}/>
          <div className="pawns" id="yellowpawn4" onClick={() => randomMove('yellow', 4)}
               style={{ backgroundColor: '#ffc865', top: '519px', left: '96px' }}/>

          <div className="pawns" id="greenpawn1" onClick={() => randomMove('green', 1)}
               style={{ backgroundColor: '#00ee32', top: '175px', left: '95px' }}/>
          <div className="pawns" id="greenpawn2" onClick={() => randomMove('green', 2)}
               style={{ backgroundColor: '#00ee32', top: '134px', left: '138px' }}/>
          <div className="pawns" id="greenpawn3" onClick={() => randomMove('green', 3)}
               style={{ backgroundColor: '#00ee32', top: '134px', left: '95px' }}/>
          <div className="pawns" id="greenpawn4" onClick={() => randomMove('green', 4)}
               style={{ backgroundColor: '#00ee32', top: '175px', left: '138px' }}/>

          <div className="pawns" id="bluepawn1" onClick={() => randomMove('blue', 1)}
               style={{ backgroundColor: '#00e1ea', top: '519px', left: '516px' }}/>
          <div className="pawns" id="bluepawn2" onClick={() => randomMove('blue', 2)}
               style={{ backgroundColor: '#00e1ea', top: '519px', left: '473px' }}/>
          <div className="pawns" id="bluepawn3" onClick={() => randomMove('blue', 3)}
               style={{ backgroundColor: '#00e1ea', top: '560px', left: '516px' }}/>
          <div className="pawns" id="bluepawn4" onClick={() => randomMove('blue', 4)}
               style={{ backgroundColor: '#00e1ea', top: '560px', left: '473px' }}/>

          <h3 id="player" style={{ float: 'left', color: 'red' }}>red</h3>
          <p id="badtext" style={{ float: 'left' }}></p>

        </div>
      </div>
    </div>
  )
};
