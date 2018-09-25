import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
      <button className={"square " + (props.isHighlighted ? "highlighted" : "")} onClick={props.onClick}>
        {props.value}
      </button>
    );
  }
  
  class Board extends React.Component {
    renderSquare(i, isHighlighted) {
      return (
        <Square
          value={this.props.squares[i]}
          onClick={() => this.props.onClick(i)}
          key={i}
          isHighlighted={isHighlighted}
        />
      );
    }
  
    render() {

        let rows = []
        let winnerPosition = 0;
        for(let i=0; i<3; i++) {
            let row = []
            for(let j=0; j<3; j++) {
                let isHighlighted = false;
                //if has winner and this square is in the winningLines
                if (this.props.haveWinner) {
                    if((i*3 + j) === this.props.winnerLines[winnerPosition]) {
                        winnerPosition++;
                        isHighlighted=true;
                    }
                }
                row.push(this.renderSquare(i*3 + j, isHighlighted));
            }
            rows.push(<div className="board-row" key={i}>{row}</div>);
        }
        
        return (<div>{rows}</div>);
    }
  }
  
  class Game extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        history: [
          {
            squares: Array(9).fill(null),
            currentMove: ''
          }
        ],
        stepNumber: 0,
        xIsNext: true,
        isAscendingSorted: true
      };
      this.handleSortButton = this.handleSortButton.bind(this);
    }
  
    handleClick(i) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      if (calculateWinner(squares).winner || squares[i]) {
        return;
      }
      squares[i] = this.state.xIsNext ? "X" : "O";
      this.setState({
        history: history.concat([
          {
            squares: squares,
            currentMove: i
          }
        ]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext
      });
    }
  
    jumpTo(step) {
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0
      });
    }

    handleSortButton() {
        this.setState({
            isAscendingSorted: !this.state.isAscendingSorted
        })
    }
  
    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const {winner, winnerLines} = calculateWinner(current.squares);
      const stepNumber = this.state.stepNumber;
      const isAscendingSorted = this.state.isAscendingSorted;

      let moves = history.map((step, move) => {
        const desc = move ?
          `Go to move (${Math.floor(step.currentMove/3)},${step.currentMove%3})` :
          'Go to game start';
        return (     
          <li key={move}>
            <button className={ move === stepNumber ? 'bold' : null} onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        );
      });

      //sort
      if (!isAscendingSorted) moves = moves.slice(0).reverse();
  
      let status;
      if (winner) {
        status = "Winner: " + winner;
      } else {
        if (stepNumber === 9) status = "Draw";
        else status = "Next player: " + (this.state.xIsNext ? "X" : "O");
      }
  
      return (
        <div className="game">
          <div className="game-board">
            <Board
              squares={current.squares}
              haveWinner= {winner ? true : false}
              winnerLines= {winnerLines}
              onClick={i => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <button onClick={this.handleSortButton}>{isAscendingSorted?"Sort Descending":"Sort Ascending"}</button>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(<Game />, document.getElementById("root"));
  
  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return {
                winner: squares[a],
                winnerLines: [a, b, c]
            }
        }
    }
    return {
        winner: null,
        winnerLines: null
    }
}
  