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
            return;
        }

        board[row][column].addToken(player);

        console.log(`Player ${player} placed a token at (${row}, ${column})`);
    }

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
        const board = Gameboard();
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
        const switchTurn = () => {
            activePlayer = activePlayer === players [0] ? players[1] : players[0];
        };
        
        const getActivePlayer = () => activePlayer;
        const printNewRound  = () => {
            board.printBoard();
            console.log(`${getActivePlayer().name}'s turn.`);
        };

        //vittorie e pareggi

        const checkWinner = () => {
            const boardArray = board.getBoard();

            /* primo modo per vincere
            itera su ogni i (riga) del tabellone 
            controlla se la prima non è vuota
            se tutti i valori sono uguali (vittoria),
            ritorna il valore del vincitore*/

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

        //mettere checkWinner e checkDraw in playRound

        const playRound = (row, coloumn) => {
            console.log(`${getActivePlayer().name} choice.`)
            board.placeToken(row, coloumn, getActivePlayer().token);
        
        //controllare se qualcuno ha vinto checkWinner
            const winner = checkWinner();
            if (winner) {
                console.log(`${winner} wins!`);
                board.printBoard();
                return;
            }

        //controllare se è un pareggio checkDraw
            if (checkDraw()) {
                console.log("It's a draw!");
                board.printBoard();
                return;
            }


        //cambia turno
            switchTurn();
            printNewRound();
        };

        printNewRound();

        return {
            playRound,
            getActivePlayer,
            board
        };
};

const game = GameController();

game.playRound(0, 0); // 1 in (0, 0)
game.playRound(0, 1); // 2 in (0, 1)
game.playRound(1, 1); // 1 in (1, 1)
game.playRound(0, 2); // 2 in (0, 2)
game.playRound(2, 2); // 1 in (2, 2) wins


