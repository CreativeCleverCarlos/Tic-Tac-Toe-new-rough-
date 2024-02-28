
//The purpose of this project is to teach how to organize code and to think more like a programmer

//if something is only going to be run once, then a module is what's to be used (gameboard, displayController etc), and if something is done more than once, then to use a factory (# of players)

const displayController = (() =>{
    const renderMessage = (message) => {
        document.querySelector("#message").innerHTML = message;
    }
    return {
        renderMessage
    }
})();

const Gameboard = (() => {
    let gameboard = ["", "", "", "", "", "", "", "", "",] //1.)the gameboard has 9 index's for the array
    
    const render = () => { //2.)in short, this will be showing what is happening in real time. will happen everytime somebody clicks or when the game starts
        let boardHTML = "";
        gameboard.forEach((square, index) => { //3.)this will look through each element of the array
            boardHTML += `<div class="square" id="square-${index}">${square}</div>` //for each empty array index in the gameboard, this will create a square. that's why the name after forEach is square, and why the class name is square. each square needs it's own id. 
        })
        document.querySelector("#gameboard").innerHTML = boardHTML;
        const squares = document.querySelectorAll(".square"); //.7) when the squares are clicked, the squares array is sent to the console
        squares.forEach((square) => {
            square.addEventListener("click", Game.handleClick); //.8)the Game.handleClick is for organization. when clicking to play the game, it makes sense that the code to handle the click would be in the game, which is why although the squares for the gameboard is under render, the feature of clicking for the game will be under game
        })  
    };

    const update = (index, value) => { 
        gameboard[index] = value;
        render();
    }

    const getGameboard = () => gameboard; //this allows us to check if there is something within the handleCkick. It 


    return { //4.)so the return function that was made in Gameboard get's returned, so that it can be called upon. If the "()" at the end wasn't there, this would not work. The gameboard can't be accessed directly, but it can be indirectly accessed by using the render function
        render,
        update,
        getGameboard
    }

   


})(); //the "()" this is an IIFE (immediately, invoked, function, expression).Fgame which a Module uses to keep the code more secure and have it run only once 

const createPlayer = (name, mark) =>{ //5.) factory for the players
    return {
        name, 
        mark
    }
}

const Game = (() => { //6.)
        let players = [];
        let currentPlayerIndex;
        let gameOver;

        const start = () =>{
            players = [
                createPlayer(document.querySelector("#player1").value, "X"),//targetting the player1 id in html
                createPlayer(document.querySelector("#player2").value, "O")
            ]
            currentPlayerIndex = 0;
            gameOver = false;
            Gameboard.render(); 
            const squares = document.querySelectorAll(".square")
            squares.forEach((square) => {
            square.addEventListener("click", handleClick);
            })  
        }

        const handleClick = (event) => { //.9)
            if (gameOver){
                return;
            }
            let index = parseInt(event.target.id.split("-")[1]); //.10) to show where in the box is being clicked. what index number
            if (Gameboard.getGameboard()[index] !== "")
            return;  //this means, that if there is something within the gameboard already, it won't switch

            Gameboard.update(index, players[currentPlayerIndex].mark);

            currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0; //this causes the X and O's to switch :). If it is 0, it becomes 1, and if it is 1, it becomes 0

            if (checkForWin(Gameboard.getGameboard(), players[currentPlayerIndex].mark)){
                gameOver = true;
                displayController.renderMessage(`${players[currentPlayerIndex].name} wins`)
            } else if(checkForTie(Gameboard.getGameboard())){
                gameOver = true;
                displayController.renderMessage("It's a tie");
            }
           

            
        }

        const restart = () => {
            for (let i = 0; i < 9; i++){ //this causes all of the boxes within the Gameboard to be empty. In other words, all the index become "".
                Gameboard.update(i, "");
            }
            Gameboard.render();
            document.querySelector("#message").innerHTML = ""; //clears up the tie or winner message
            gameOver = false; //allows us to click again once the restart button is pressed
        }



        return{ //all of this allows everything inside to be accessible to functions outside of it
            start,
            handleClick,
            restart
        }
})();

function checkForWin(board){
    const winningCombinations = [
    [0,1,2],
    [3,4,5], 
    [6,7,8], //rows
    [0,3,6], 
    [1,4,7], 
    [2,5,8],//columns
    [0,4,8], 
    [6,4,2]//diagonal]
]
    for (let i = 0; i < winningCombinations.length; i++){
        const [a, b, c] = winningCombinations[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]){
            return true;
        }
    }
    return false;
}

function checkForTie (board) {
    return board.every(cell => cell !== "") //basically if every cell is not empty, return true
}


const restartButton = document.querySelector("#restart-button");
restartButton.addEventListener("click", () => {
    Game.restart();
})


const startButton = document.querySelector("#start-button");
startButton.addEventListener("click", () =>{
    Game.start();
})