pragma solidity ^0.4.23;

/// @title Contract to bet Ether for a number and win randomly when the number of bets is met.
contract Casino {
    address owner;

    // The minimum bet a user has to make to participate in the game
    //Equals to 0.1 ether
    uint public minimumBetAmount = 100000000000000000;

    // The total amount of Ether bet for this current game
    uint public totalBetAmount;

    // The total number of bets the users have made
    uint public betCount;

    // The maximum amount of bets can be made for each game
    uint public maxBetCount = 10;

    // The max amount of bets that cannot be exceeded to avoid excessive gas consumption
    // when distributing the prizes and restarting the game
    uint public constant TOTAL_BET_LIMIT = 100;

    // The number that won the last game
    uint public winningNumber;

    // Array of players
    address[] public players;

    // Each number has an array of players. Associate each number with a bunch of players
    mapping(uint => address[]) betPlayers;

    // The number that each player has bet for
    mapping(address => uint) betNumbers;

    modifier onlyEndGame(){
        require(betCount >= maxBetCount);
        _;
    }

   constructor(uint _minimumBet, uint _maxBetCount) public {

        require(_minimumBet >= minimumBetAmount);

        owner = msg.sender;
        minimumBetAmount = _minimumBet;

        if (0 < _maxBetCount && _maxBetCount <= TOTAL_BET_LIMIT)
            maxBetCount = _maxBetCount;
    }

    /// @notice To bet for a number by sending Ether
    /// @param luckyNumber The number that the player wants to bet for. Must be between 1 and 10 both inclusive
    function bet(uint luckyNumber) public payable {

        // Check that the number to bet is within the range
        require(1 <= luckyNumber && luckyNumber <= 10);

        // Check that the max amount of bets hasn't been met yet
        require(betCount < maxBetCount);

        // Check that the player doesn't exists
        require(betNumbers[msg.sender] == 0);

        // Check that the amount paid is bigger or equal the minimum bet
        require(msg.value >= minimumBetAmount);

        // Set the number bet for that player
        betNumbers[msg.sender] = luckyNumber;

        // The player msg.sender has bet for that number
        betPlayers[luckyNumber].push(msg.sender);

        betCount += 1;
        totalBetAmount += msg.value;

        if (betCount >= maxBetCount)
            award();
    }

    function award() payable onlyEndGame {

        // This isn't secure
        winningNumber = 5;

        uint winnerEtherAmount = totalBetAmount / betPlayers[winningNumber].length;

        for (uint i = 0; i < betPlayers[winningNumber].length; i++) {
            betPlayers[winningNumber][i].transfer(winnerEtherAmount);
        }

        for (uint j = 1; j <= 10; j++) {
            betPlayers[j].length = 0;
        }

        totalBetAmount = 0;
        betCount = 0;
    }

}
