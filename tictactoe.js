document.addEventListener("DOMContentLoaded", () => {
    initializeGame();
});

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

function initializeGame() {
    createBoard(3, 3);
    game.updateActivePlayerMessage();

    document.querySelectorAll(".iconBtn").forEach(button => {
        button.addEventListener("click", (event) => {
            const selectedIcon = event.currentTarget.querySelector("img").getAttribute("data-icon");
            const tokenPath = `img/${selectedIcon}`;
            activePlayer.token = tokenPath; // Assegna il token come stringa con il percorso dell'immagine
            console.log(`Player ${activePlayer.name} selected token: ${activePlayer.token}`);
        });
    });

    const activePlayer = game.getActivePlayer();
        const messageElement = document.getElementById("activePlayerMessage");
        if (messageElement) {
            messageElement.textContent = `It's now ${activePlayer.name}'s turn.`;
        } else { 
            console.log("niente")
        }

    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell, index) => {
        const row = Math.floor(index / 3);
        const column = index % 3;

        cell.addEventListener("click", () => {
            if (game.isGameOver()) {
                console.log(game.isGameOver());
                return;
            }

            const activePlayer = game.getActivePlayer();

            if (game.board.getBoard()[row][column].getValue() !== 0) {
                console.log("Cell occupied");
                console.log(game.board.getBoard()[row][column].getValue());
                return;
            }

            const img = document.createElement("img");

            if (typeof activePlayer.token === "string") {
                img.src = activePlayer.token; //percorso immagine del token selezionato dal giocatore attivo
                
                //nome del file per determinare l'icona (in base al data-icon)
                img.alt = activePlayer.token.split('/').pop().split('.')[0]; // Estrae il nome del file senza estensione (es. "x-icon", "poop", "dinosaur", etc.)
                
                //immagine alla cella
                cell.appendChild(img);
            } else {
                console.error("activePlayer.token non è una stringa: ", activePlayer.token);
            }

            // img.src = activePlayer.token;
            // img.alt = activePlayer.token.split('/').pop().split('.')[0];
            // cell.appendChild(img);

            game.playRound(row, column);

            if ( 
                !game.isGameOver() &&
                game.mode === "Player vs CPU" &&
                activePlayer.name === "Player"
            ) {
                setTimeout(() => {
                    cpuTurn();
                }, 500);
            }
        });
    });
}


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

    messageContainer.appendChild(messageText);
    messageContainer.appendChild(restartBtn);
}

function resetGame() {
    const restartBtn = document.querySelector(".restart_btn");
    if (restartBtn) restartBtn.remove();

    const messageContainer = document.getElementById("gameMessage");
    if (messageContainer) {
        messageContainer.innerHTML = "";
    }

    // Ricrea o trova l'elemento del messaggio
    let messageElement = document.getElementById("activePlayerMessage");
    if (!messageElement) {
        messageElement = document.createElement("div");
        messageElement.id = "activePlayerMessage";
    }

    // Assicura che sia figlio di gameMessage
    if (messageContainer) {
        messageContainer.appendChild(messageElement);
    }

    game.board = game.reset.call(game);
    const activePlayer = game.getActivePlayer();

    console.log(messageElement);
    console.log("Contenuto DOM dopo il reset:", messageElement ? messageElement.textContent : "Elemento non trovato");
    if (messageElement) {
        messageElement.textContent = `It's now ${activePlayer.name}'s turn.`;
    }
    
    setTimeout(() => {
        game.updateActivePlayerMessage();
        initializeGame();

        const updatedMessageElement = document.getElementById("activePlayerMessage");
        if (updatedMessageElement) {
            updatedMessageElement.textContent = `It's now ${activePlayer.name}'s turn.`;
        }
    }, 0);

    console.log("Game has been reset. Active player:", activePlayer.name);

    console.log("game reset");
};

initializeGame();