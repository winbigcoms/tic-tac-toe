import React, { Component } from 'react';
import Board from './Board';

class Game extends Component {
  constructor(props){
    super(props);
    this.state = {
      histroy: [{
          squares : Array(9).fill(null)
      }],
      stepNumber:0,
      xlsNext : true
    }
  }
  handleClick(i) {
    const histroy = this.state.histroy.slice(0, this.state.stepNumber+1); //1-1. state의 history는 아이템이 1개인 배열을 복사한다.
    const current = histroy[histroy.length - 1]; // 1-2. history안에 있는 아이템을 가져오는데 {squares: [null*9]} 이다.
    const squares = current.squares.slice();  // 1-3. suqares의 값인 배열을 복사해온다.
    if (calculateWinner(squares) || squares[i]) {
      return;
    };
    
    squares[i] = this.state.xlsNext ? 'X':'O'; // 1-4. next의 값을 확인하고 클릭한 Square 컴포넌트의 i값을 받아온다.

    this.setState({
      histroy: histroy.concat([{ // 1-5. history 배열에 {squares: 4번에서 변경된 squares}를 이어붙인다. 이제 배열의 아이템은 2개다.
        squares: squares
      }]),
      stepNumber: histroy.length, // 1-6. 위에서 histroy의 길이가 하나 늘었으니 이제 2
      xlsNext: !this.state.xlsNext // 1-7. 기존 값 true에서 false로 바뀐다.
    });
  };

  jumpTo(step) { // 2-0 바둑에서 한 수 뒤로 돌아가기 기능처럼 이전에 놨던 타임으로 돌아갈 때 실행되는 함수
    this.setState({
      stepNumber: step,
      xlsNext: step %2 ===0
    });
  }

  render() {
    const {histroy,stepNumber} = this.state; //2-1 현재 상태 에서 필요한 부분만 가져오기, stepNum은 Square클릭시마다
    const current = histroy[stepNumber]; //  +1 이 되니까 현재의 턴 수를 확인 할 수 있음, 배열의 아이템은 클릭된 상태
    const winner = calculateWinner(current.squares); //빙고의 경우의수를 갖고 있는 함수에 현재 상태를 넣어서 확인
    const moves = histroy.map((step,move)=> (
      <li key={move}>
        <button onClick ={()=>this.jumpTo(move)}>
          {move? 'Go to move #'+move : 'Go to game start'}
        </button>
      </li>
    ));

    const status = winner ? 'winner : ' + winner : 'Next player:'+(this.state.xlsNext ? 'X':'O')


    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} onClick={i=> this.handleClick(i)}/>
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  };
};

function calculateWinner(squares) { // 2-2 빙고인지 확인
  const lines=[
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6],
  ]; // 빙고 경우의 수
  for (let i = 0; i < lines.length; i++) { // 현재 상태가 빙고인지 확인
    const [a,b,c] = lines[i]; // 비구조화 할당으로 빙고 경우의 수 3개 자연수가 abc에 들어감 
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){ //
      return squares[a];
    }
  }
  return null;
}

export default Game;