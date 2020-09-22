import React, { Component } from "react";
import Board from "./components/board";

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      history: [{ squareList: Array(9).fill(null) }],
      isXNext: true,
    };
  }

  squareClicked = (id) => {
    const history = this.state.history;
    const current = history[history.length - 1];
    const array = current.squareList.slice();
    if (array[id] || this.calculateWinner(array)) {
      return;
    }
    array[id] = this.state.isXNext ? "X" : "O";
    this.setState({
      history: history.concat([{ squareList: [...array] }]),
      isXNext: !this.state.isXNext,
    });
    console.log(history);
  };

  calculateWinner = (squareList) => {
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
      if (
        squareList[a] &&
        squareList[a] === squareList[b] &&
        squareList[a] === squareList[c]
      ) {
        return squareList[a];
      }
    }
    return null;
  };

  render() {
    const history = this.state.history;
    const current = history[history.length - 1];
    let status = "Next player: " + (this.state.isXNext ? "X" : "O");
    const winner = this.calculateWinner(current.squareList);
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.isXNext ? "X" : "O");
    }
    return (
      <div>
        <h1>{status}</h1>
        <Board
          squareClicked={this.squareClicked}
          squareList={current.squareList}
        />
      </div>
    );
  }
}
