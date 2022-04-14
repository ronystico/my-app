import React from 'react';
import ReactDOM, { render } from 'react-dom';
import './index.css';

// class Square extends React.Component {
//   render() {
//     return (
//       <button 
//       className="square" 
//       onClick={() => this.props.onClick({value: 'X'})}>
//         {this.props.value}
//       </button>
//     );
//   }
// }

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (<Square value={this.props.squares[i]} onClick={() => this.props.onClick(i)} />);
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)} 
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        colRowClicked: [],
      }],
      xIsNext: true,
      stepNumber: 0,
      buttonToBold : -1
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    let colRowClicked = [];

    switch (i) {
      case 0:
        colRowClicked = [i,'1,1'];
        break;
      case 1:
        colRowClicked = [i,'2,1'];
        break;
      case 2:
        colRowClicked = [i,'3,1'];
        break;
      case 3:
        colRowClicked = [i,'1,2'];
        break;
      case 4:
        colRowClicked = [i,'2,2'];
        break;
      case 5:
        colRowClicked = [i,'3,2'];
        break;
      case 6:
        colRowClicked = [i,'1,3'];
        break;
      case 7:
        colRowClicked = [i,'2,3'];
        break;
      case 8:
        colRowClicked = [i,'3,3'];
        break;
      default:
        colRowClicked = [-1,''];
        break;
    }

    this.setState({
      history: history.concat([{
        squares: squares,
        colRowClicked: colRowClicked
      }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
    });
  } 

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
      buttonToBold : step
    });
  } 

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const buttonToBold = this.state.buttonToBold;

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move + ' ' + step.colRowClicked[1] :
        'Go to game start';
        const isBold = move === buttonToBold ? 'bold' : 'regular';
      return (
        <li key={move}>
          <button className={isBold} onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  } 
}

// function Game(props) {
//   const state = {
//     history: [{ squares: Array(9).fill(null) }],
//     xIsNext: true
//   }
//   const history = state.history;
//   const current = history[history.length - 1];

//   function handleClick(i) {
//     const history = state.history;
//     const current = history[history.length - 1];
//     const squares = current.squares.slice();
//     if (calculateWinner(squares) || squares[i]) {
//       return;
//     }
//     squares[i] = props.xIsNext ? 'X' : 'O'
//     state = ({ history: history.concat([{ squares: squares, }]) });
//   }

//   const winner = calculateWinner(current.squares);
//   let status;
//   if (winner) {
//     status = `Winner: ${winner}`;
//   } else {
//     status = `Next player: ${state.xIsNext ? 'X' : 'O'}`;
//   } 
//   return (
//     <div className="game">
//       <div className="game-board">
//         <Board squares={current.squares} onClick={(i) => handleClick(i)} />
//       </div>
//       <div className="game-info">
//         <div>{status}</div>
//         <ol>{/* TODO */}</ol>
//       </div>
//     </div>
//   )
// }

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}