import React, { Component } from "react";
import Board from "./components/board";
import FacebookLogin from "react-facebook-login";

const apikey = process.env.REACT_APP_APIKEY;

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      history: [{ squareList: Array(9).fill(null) }],
      isXNext: true,
      stepNumber: 0,
      username: "unknown",
      startTime: Date.now(),
    };
  }

  squareClicked = (id) => {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const array = current.squareList.slice();
    if (array[id] || this.calculateWinner(array)) {
      return;
    }
    array[id] = this.state.isXNext ? "X" : "O";
    this.setState({
      history: history.concat([{ squareList: [...array] }]),
      isXNext: !this.state.isXNext,
      stepNumber: history.length,
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

  goToMove = (moveKey) => {
    this.setState({
      stepNumber: moveKey,
      isXNext: moveKey % 2 === 0,
    });
  };

  postData = async (score) => {
    let data = new URLSearchParams();
    console.log("data/username", this.state.username, score);

    data.append("player", this.state.username);
    data.append("score", score);
    const url = `http://ftw-highscores.herokuapp.com/tictactoe-dev`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: data.toString(),
      json: true,
    });
    console.log("final response", response);
  };

  getData = async () => {
    const url = `http://ftw-highscores.herokuapp.com/tictactoe-dev`;
    const response = await fetch(url);
    const data = await response.json();
    console.log("getData", data);
  };

  responseFacebook = (response) => {
    console.log("facebook", response);
  };

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    let status = "Next player: " + (this.state.isXNext ? "X" : "O");
    const winner = this.calculateWinner(current.squareList);
    let facebookLogin = "";

    const moveList = history.map((step, moveKey) => {
      const moveText = moveKey ? "Move #" + moveKey : "Start of game";
      return (
        <li key={moveKey}>
          <button onClick={() => this.goToMove(moveKey)}>{moveText}</button>
        </li>
      );
    });

    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.isXNext ? "X" : "O");
    }

    if (winner) {
      let score = Math.floor((Date.now() - this.state.startTime) / 1000);
      // this.postData(score);
      console.log("data pushed", score);
    }

    if (this.state.username !== "unknown") {
      facebookLogin = <h3>Username: {this.state.username}</h3>;
    } else {
      facebookLogin = (
        <FacebookLogin
          autoLoad={true}
          appId={apikey}
          fields="name,email,picture"
          callback={(resp) => {
            this.responseFacebook(resp);
            this.setState({ username: resp.name });
            let name = this.state.username;
            console.log("name", name);
          }}
        />
      );
    }

    return (
      <div style={{ display: "flex" }}>
        <Board
          squareClicked={this.squareClicked}
          squareList={current.squareList}
        />
        <div>
          <div>{facebookLogin}</div>
          <h1>{status}</h1>
          <ol>{moveList}</ol>
          <button onClick={() => this.postData()}>Post Data</button>
          <button onClick={() => this.getData()}>See Data</button>
        </div>
      </div>
    );
  }
}
