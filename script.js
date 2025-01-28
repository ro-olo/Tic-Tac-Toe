document.addEventListener("DOMContentLoaded", () => {
    initializeGame();
});


function Gameboard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }

    const getBoard = () => board;

    const placeToken = (row, column, player) => {
        if (board[row][column].getValue() !== 0 ) {
            console.log("Occupied! Choose another one");
            return false;
        }

        board[row][column].addToken(player);
        console.log(`Player ${player} placed a token at (${row}, ${column})`);
        return true;
    };

    const printBoard = () => {
        board.forEach((row) => {
            const rowString = row
                .map(cell => {
                    const value = cell.getValue();
                    if (value === 0) return "-";
                    if (value === 1) return "X";
                    if (value === 2) return "O";
                })
                .join(" | ");
            console.log(rowString);
        });
        console.log("\n");
    }

    return {getBoard, placeToken, printBoard};
}

function Cell() {
    let value = 0;

    const addToken = (player) => {
        value = player;
    };

    const getValue = () => value;

    return {addToken, getValue};
}

function GameController(
    playerOneName = "Player One", 
    playerTwoName = "Player Two") {
        let board = Gameboard();
        const players = [
            {
                name: playerOneName,
                token: 1
            },
            {
                name: playerTwoName,
                token: 2
            }
        ];

        let activePlayer = players[0];
        let gameOver = false;

        const updateActivePlayerMessage = () => {
            const messageElement = document.getElementById("activePlayerMessage");
            if (!messageElement) return;
            messageElement.textContent = `It's now ${activePlayer.name}'s turn.`;
        }
        const switchTurn = () => {
            activePlayer = activePlayer === players [0] ? players[1] : players[0];
            console.log(`It's now ${activePlayer.name}'s turn.`)
            updateActivePlayerMessage();
        };
        
        const getActivePlayer = () => activePlayer;

        //vittorie e pareggi

        const checkWinner = () => {
            const boardArray = board.getBoard();

            for (let i = 0; i < 3; i++) {
                if (
                    boardArray[i][0].getValue() !== 0 &&
                    boardArray[i][0].getValue() === boardArray[i][1].getValue() &&
                    boardArray[i][1].getValue() === boardArray[i][2].getValue()
                ) {
                    return boardArray[i][0].getValue();
                 }
            }

            /* secondo modo per vincere
            lo stesso sulle colonne*/

            for (let j = 0; j < 3; j++) {
                if (
                    boardArray[0][j].getValue() !== 0 &&
                    boardArray[0][j].getValue() === boardArray[1][j].getValue() &&
                    boardArray[1][j].getValue() === boardArray[2][j].getValue()
                ) {
                    return boardArray[0][j].getValue();
                }
            }

            /* terzo modo per vincere
            diagonale centrale da sinistra*/

            if (
                boardArray[0][0].getValue() !== 0 &&
                boardArray[0][0].getValue() === boardArray[1][1].getValue() &&
                boardArray[1][1].getValue() === boardArray[2][2].getValue()
            ) {
                return boardArray[0][0].getValue();
            }

            /*quarto modo per vincere
            diagonale centrale da destra*/

            if (
                boardArray[0][2].getValue() !== 0 &&
                boardArray[0][2].getValue() === boardArray[1][1].getValue() &&
                boardArray[1][1].getValue() === boardArray[2][0].getValue()
            ) {
                return boardArray[0][2].getValue();
            }

            /*se non c'è vincitore il gioco deve continuare*/

            return null;
        }

        //se non ci sono vincitori e le caselle sono piene è pareggio

        const checkDraw = () => {
            const boardArray = board.getBoard();
            //iterare prima su tutti i row dell'array
            //iterare di nuovo su ogni cell dei row
            for (let row of boardArray) {
                for (let cell of row) {
                    if (cell.getValue() === 0) {
                        return false; //c'è spazio
                    }
                }
            }

            //otherwise...
            return true;
        }

        const playRound = (row, column) => {
            const activePlayer = getActivePlayer();
            console.log(`${getActivePlayer().name} choice.`);

            const tokenPlaced = board.placeToken(row, column, activePlayer.token);
            if (!tokenPlaced) {
                console.log("Invalid move");
                return;
            }
        
        //controllare se qualcuno ha vinto checkWinner
            const winner = checkWinner();
            if (winner) {
                gameOver = true;
                endGame(`${activePlayer.name} wins!`);
                startConfetti();
                return;
            }

        //controllare se è un pareggio checkDraw
            else if (checkDraw()) {
                gameOver = true;
                endGame("It's a draw!");

                const gifContainer = document.getElementById("gifContainer");

                const gif = document.createElement("img");
                gif.src = "img/cat.gif";
                gif.alt = "annoyed cat meme";
                gif.classList.add("cat_gif");

                const gifTwo = document.createElement("img");
                gifTwo.src = "img/cat2.gif";
                gifTwo.alt = "annoyed cat meme";
                gifTwo.classList.add("cat_gif");
                
                const gifThree = document.createElement("img");
                gifThree.src = "img/cat3.gif";
                gifThree.alt = "annoyed cat meme";
                gifThree.classList.add("cat_gif");

                const gifFour = document.createElement("img");
                gifFour.src = "img/cat4.gif";
                gifFour.alt = "annoyed cat meme";
                gifFour.classList.add("cat_gif");

                const customPositions = [
                    { top: "75%", left: "8%" },
                    { top: "20%", left: "80%" },
                    { top: "65%", left: "70%" },
                    { top: "7%", left: "8%" },
                ];

                [gif, gifTwo, gifThree, gifFour].forEach((gifElement, index) => {
                    const position = customPositions[index];
        
                    // Applica la posizione specifica
                    gifElement.style.position = "absolute";
                    Object.assign(gifElement.style, position);
        
                    gifContainer.appendChild(gifElement);
                });

                return;
            }

            //cambia turno
            switchTurn();
            board.printBoard();
            };

            const reset = () => {
                gameOver = false;
                console.log("go false");
                activePlayer = players[0];
                board = Gameboard();
                updateActivePlayerMessage();
                stopConfetti();
                gifContainer.innerHTML = "";
                console.log("new board created");

                const rows = 3;
                const columns = 3;
                console.log(board.getBoard())
            
                for (let i = 0; i < rows; i++) {
                    for (let j = 0; j < columns; j++) {
                        board.getBoard()[i][j].addToken(0);

                        console.log(board.getBoard()[i][j].getValue())
                    }
                }

                return board;
            }

            return {
                playRound,
                getActivePlayer,
                board,
                reset,
                isGameOver: () => gameOver,
                updateActivePlayerMessage,
            };
};

const game = GameController();

