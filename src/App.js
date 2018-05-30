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
            betCount: 0,
            minimumBetAmount: 0,
            totalBetAmount: 0,
            maxBetCount: 0,
        };

        const web3 = new Web3(window.web3.currentProvider);
        this.state.web3 = web3;
        this.state.ContractInstance = new web3.eth.Contract(abi, "0xfE5997bf9288f2d733BCC4BFcf1D5e3D6E618E13");

        window.a = this.state
    }


    componentDidMount(){
        this.updateState();
        this.setupListeners();

        setInterval(this.updateState.bind(this), 7e3)
    }

    updateState(){
        const self = this;
        this.state.ContractInstance.methods.minimumBetAmount().call().then(function(data) {
            self.setState({minimumBetAmount: self.state.web3.utils.fromWei(data, 'ether')});
        }).catch(function (error){
            console.log(error);
        });
        this.state.ContractInstance.methods.totalBetAmount().call().then(function(data) {
            self.setState({totalBetAmount: self.state.web3.utils.fromWei(data, 'ether')});
        }).catch(function (error){
            console.log(error);
        });
        this.state.ContractInstance.methods.betCount().call().then(function(data) {
            self.setState({betCount: data});
        }).catch(function (error){
            console.log(error);
        });
        this.state.ContractInstance.methods.maxBetCount().call().then(function(data) {
            self.setState({maxBetCount: data});
        }).catch(function (error){
            console.log(error);
        });
    }


    // Listen for events and executes the voteNumber method
    setupListeners(){
        let liNodes = this.refs.numbers.querySelectorAll('li');
        liNodes.forEach(number => {
            number.addEventListener('click', event => {
                event.target.className = 'number-selected';
                this.voteNumber(parseInt(event.target.innerHTML), done => {

                    // Remove the other number selected
                    for(let i = 0; i < liNodes.length; i++){
                        liNodes[i].className = ''
                    }
                })
            })
        })
    }

    voteNumber(number, cb){
        let bet = this.refs['ether-bet'].value;

        if(!bet) bet = 0.1;

        if(parseFloat(bet) < this.state.minimumBetAmount){
            alert('You must bet more than the minimum');
            cb()
        } else {
            this.state.web3.eth.getAccounts().then(e => 
                this.state.ContractInstance.methods.bet(number).send({
                    gas: 300000,
                    from: e[0],
                    value: this.state.web3.utils.toWei(bet.toString(), 'ether')
                }).then(function(receipt){
                    cb()
                })
            ).catch(function (error){
                cb()
                console.log(error);
            });
        }
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
                    <span>{this.state.betCount}</span>
                </div>
                <div className="block">
                    <b>Last number winner:</b> &nbsp;
                    <span>{this.state.lastWinner}</span>
                </div>
                <div className="block">
                    <b>Total ether bet:</b> &nbsp;
                    <span>{this.state.totalBetAmount} ether</span>
                </div>
                <div className="block">
                    <b>Minimum bet:</b> &nbsp;
                    <span>{this.state.minimumBetAmount} ether</span>
                </div>
                <div className="block">
                    <b>Max amount of bets:</b> &nbsp;
                    <span>{this.state.maxBetCount}</span>
                </div>
                <hr/>
                <h2>Vote for the next number</h2>
                <label>
                    <b>How much Ether do you want to bet? <input className="bet-input" ref="ether-bet" type="number" placeholder={this.state.minimumBetAmount}/></b> ether
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
