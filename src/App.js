import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import Web3 from 'web3'
import abi from './contractAbi.json';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            lastWinner: 0,
            numberOfBets: 0,
            minimumBet: 0,
            totalBet: 0,
            maxAmountOfBets: 0,
        };

        const web3 = new Web3(window.web3.currentProvider);

        this.state.ContractInstance = new web3.eth.Contract(abi, "0x4cA032A45c9EbAE15d9446FbA2DcD58b379E51a3");

        window.a = this.state
    }


    componentDidMount() {
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h1 className="App-title">Welcome to React</h1>
                </header>
                <p className="App-intro">
                    To get started, edit <code>src/App.js</code> and save to reload.
                </p>

                <div className="block">
                    <b>Number of bets:</b> &nbsp;
                    <span>{this.state.numberOfBets}</span>
                </div>
                <div className="block">
                    <b>Last number winner:</b> &nbsp;
                    <span>{this.state.lastWinner}</span>
                </div>
                <div className="block">
                    <b>Total ether bet:</b> &nbsp;
                    <span>{this.state.totalBet} ether</span>
                </div>
                <div className="block">
                    <b>Minimum bet:</b> &nbsp;
                    <span>{this.state.minimumBet} ether</span>
                </div>
                <div className="block">
                    <b>Max amount of bets:</b> &nbsp;
                    <span>{this.state.maxAmountOfBets} ether</span>
                </div>
                <hr/>
                <h2>Vote for the next number</h2>
                <label>
                    <b>How much Ether do you want to bet? <input className="bet-input" ref="ether-bet" type="number" placeholder={this.state.minimumBet}/></b> ether
                    <br/>
                </label>
                <ul ref="numbers">
                    <li>1</li>
                    <li>2</li>
                    <li>3</li>
                    <li>4</li>
                    <li>5</li>
                    <li>6</li>
                    <li>7</li>
                    <li>8</li>
                    <li>9</li>
                    <li>10</li>
                </ul>
            </div>
        );
    }
}

export default App;
