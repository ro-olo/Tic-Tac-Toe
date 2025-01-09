function createBoard(rows, columns) {
    const container = document.getElementById("boardContainer");

    container.innerHTML = "";

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            const cell = document.createElement("div");
            cell.classList.add("cell"); 
            container.appendChild(cell);
        }
    }
}

const initializeGame = () => {
    createBoard(3, 3);
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell, index) => {
        const row = Math.floor(index / 3);
        const column = index % 3;

        cell.addEventListener("click", () => {
            if (game.isGameOver()) {
                console.log(game.isGameOver())
                console.log("on noh game over oh noooo")
                return;
            }

            const activePlayer = game.getActivePlayer();

            if (game.board.getBoard()[row][column].getValue() !== 0) {
                console.log("Cell occupied");
                console.log(game.board.getBoard()[row][column].getValue());
                return;
            }
            
            game.playRound(row, column);
            cell.textContent = activePlayer.token === 1 ? "X" : "O";
        
            //if (game.isGameOver()) {
            //   endGame();
            //}
        });
    });
};

const endGame = (message) => {
    updateMessage(message);

    const cells = document.querySelectorAll(".cell");
    cells.forEach(cell => {
        cell.style.pointerEvents = "none";
    });
};

const messageContainer = document.getElementById("gameMessage");

const updateMessage = (message) => {
    messageContainer.innerHTML = "";

    const messageText = document.createElement("p");
    messageText.textContent = message;

    const restartBtn = document.createElement("button");
    restartBtn.textContent = "New Game";
    restartBtn.classList.add("restart_btn");
    restartBtn.addEventListener("click", resetGame);

    messageContainer.appendChild(restartBtn);
    messageContainer.appendChild(messageText);
}

function resetGame() {
    const restartBtn = document.querySelector(".restart_btn");
    if (restartBtn) restartBtn.remove();

    messageContainer.innerHTML = "";
    game.board = game.reset.call(game);
    initializeGame();

    const cells = document.querySelectorAll(".cell");
    cells.forEach(cell => {
        cell.style.pointerEvents = "auto";
        cell.textContent = "";

        const row = Math.floor(index / 3);
        const column = index % 3;

        cell.addEventListener("click", () => {
            if (game.isGameOver()) {
                return;
            }

            const activePlayer = game.getActivePlayer();

            if (game.board.getBoard()[row][column].getValue() !== 0) {
                return;
            }

            game.playRound(row, column);
            cell.textContent = activePlayer.token === 1 ? "X" : "O";
        })
        
    });

    console.log("game reset");
};

initializeGame();