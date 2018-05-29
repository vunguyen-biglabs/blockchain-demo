pragma solidity ^0.4.23;

/// @title Contract to bet Ether for a number and win randomly when the number of bets is met.
contract Casino {
    address owner;

    // The minimum bet a user has to make to participate in the game
    // Equal to 0.1 ether
    uint public minimumBet = 100 finney;

    // The total amount of Ether bet for this current game
    uint public totalBet;

    // The total number of bets the users have made
    uint public numberOfBets;

    // The maximum amount of bets can be made for each game
    uint public maxAmountOfBets = 10;

    // The max amount of bets that cannot be exceeded to avoid excessive gas consumption
    // when distributing the prizes and restarting the game
    uint public constant LIMIT_AMOUNT_BETS = 100;

    // The number that won the last game
    uint public numberWinner;

    // Array of players
    address[] public players;

    // Each number has an array of players. Associate each number with a bunch of players
    mapping(uint => address[]) public numberBetPlayers;

    // The number that each player has bet for
    mapping(address => uint) public playerBetsNumber;

    // Modifier to only allow the execution of functions when the bets are completed
    modifier onEndGame(){
        require(numberOfBets >= maxAmountOfBets);
        _;
    }

    /// @notice Constructor that's used to configure the minimum bet per game and the max amount of bets
    /// @param _minimumBet The minimum bet that each user has to make in order to participate in the game
    /// @param _maxAmountOfBets The max amount of bets that are required for each game
    function Casino(uint _minimumBet, uint _maxAmountOfBets){

        owner = msg.sender;

        if (_minimumBet > 0)
            minimumBet = _minimumBet;
        if (0 < _maxAmountOfBets && _maxAmountOfBets <= LIMIT_AMOUNT_BETS)
            maxAmountOfBets = _maxAmountOfBets;
    }

    /// @notice To bet for a number by sending Ether
    /// @param numberToBet The number that the player wants to bet for. Must be between 1 and 10 both inclusive
    function bet(uint numberToBet) payable {

        // Check that the number to bet is within the range
        require(numberToBet >= 1 && numberToBet <= 10);

        // Check that the max amount of bets hasn't been met yet
        require(numberOfBets < maxAmountOfBets);

        // Check that the player doesn't exists
        require(playerBetsNumber[msg.sender] == 0);

        // Check that the amount paid is bigger or equal the minimum bet
        require(msg.value >= minimumBet);

        // Set the number bet for that player
        playerBetsNumber[msg.sender] = numberToBet;

        // The player msg.sender has bet for that number
        numberBetPlayers[numberToBet].push(msg.sender);

        numberOfBets += 1;
        totalBet += msg.value;

        if (numberOfBets >= maxAmountOfBets)
            generateNumberWinner();
    }

    /// @notice Generates a random number between 1 and 10 both inclusive.
    /// Can only be executed when the game ends.
    function generateNumberWinner() payable onEndGame {

        // This isn't secure
        numberWinner = 5;

        distributePrizes();
    }

    /// @notice Sends the corresponding Ether to each winner then deletes all the
    /// players for the next game and resets the `totalBet` and `numberOfBets`
    function distributePrizes() onEndGame {

        // How much each winner gets
        uint winnerEtherAmount = totalBet / numberBetPlayers[numberWinner].length;

        // Loop through all the winners to send the corresponding prize for each one
        for (uint i = 0; i < numberBetPlayers[numberWinner].length; i++) {
            numberBetPlayers[numberWinner][i].transfer(winnerEtherAmount);
        }

        // Delete all the players for each number
        for (uint j = 1; j <= 10; j++) {
            numberBetPlayers[j].length = 0;
        }

        numberWinner = 0;
        totalBet = 0;
        numberOfBets = 0;
    }
}
