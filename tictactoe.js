document.addEventListener("DOMContentLoaded", () => {
    // Check if the game object exists before initializing
    if (window.game) {
        initializeGame();
    } else {
        console.error("Game object not found. Please ensure the game is properly initialized.");
    }
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

    console.log("GAME INITIALIZATION IN TICTACTOE.JS");
    console.log("Game object:", game);
    
    // Check if the game has a getPlayers function
    if (game.getPlayers) {
        const players = game.getPlayers();
        console.log("Players from game.getPlayers():", players);
        console.log("Player 1:", players[0]);
        console.log("Player 2:", players[1]);
    } else {
        console.log("Player 1:", game.players ? game.players[0] : "Players not defined");
        console.log("Player 2:", game.players ? game.players[1] : "Players not defined");
    }

    const activePlayer = game.getActivePlayer ? game.getActivePlayer() : null;
    const messageElement = document.getElementById("activePlayerMessage");
    if (messageElement && activePlayer) {
        messageElement.textContent = `It's now ${activePlayer.name}'s turn.`;
    } else { 
        console.log("Active player or message element not found");
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

            const activePlayer = game.getActivePlayer ? game.getActivePlayer() : null;
            console.log("Active Player in cell click:", activePlayer);
            console.log("Active Player Token in cell click:", activePlayer ? activePlayer.token : null);

            if (game.board.getBoard()[row][column].getValue() !== 0) {
                console.log("Cell occupied");
                console.log(game.board.getBoard()[row][column].getValue());
                return;
            }

            // Only allow player moves (not CPU moves) when clicking
            if (activePlayer && activePlayer.name === "CPU") {
                console.log("It's CPU's turn, please wait for CPU to make a move");
                return;
            }

            console.log("Active Player Token: ", activePlayer ? activePlayer.token : null);
            const img = document.createElement("img");
            
            // Use the token directly if it's a string (path to image)
            if (activePlayer && typeof activePlayer.token === "string") {
                img.src = activePlayer.token;
                console.log("Using string token image: ", img.src);
            } else {
                console.error("activePlayer.token is not valid: ", activePlayer ? activePlayer.token : null);
                return; // Exit if token is invalid
            }
            
            console.log("Image created with source: ", img.src);
            
            // Set alt text based on image source
            const imgSrc = img.src;
            if (typeof imgSrc === "string") {
                const fileName = imgSrc.split('/').pop().split('.')[0];
                img.alt = fileName;
                console.log("Image alt set to: ", fileName);
            }
            
            //immagine alla cella
            cell.appendChild(img);

            game.playRound(row, column);

            console.log("After player move - Game mode:", game.mode);
            console.log("After player move - Game over?", game.isGameOver());
            console.log("After player move - Active player:", game.getActivePlayer ? game.getActivePlayer().name : "Unknown");

            if ( 
                !game.isGameOver() &&
                game.mode === "Player vs CPU"
            ) {
                console.log("CPU turn should be triggered now");
                setTimeout(() => {
                    console.log("Inside setTimeout callback");
                    // Call the cpuTurn function defined in startscreen.js
                    if (typeof window.cpuTurn === 'function') {
                        console.log("Calling window.cpuTurn");
                        window.cpuTurn();
                    } else {
                        console.error("cpuTurn function not found!");
                        console.log("Available global functions:", Object.keys(window).filter(key => typeof window[key] === 'function'));
                    }
                }, 500);
            }
        });
    });
}

// const availableTokens = [
//     'img/x-icon.png',
//     'img/o-icon.png',
//     'img/pizza.png',
//     'img/ice-cream.png',
//     'img/poop.png',
//     'img/happy.png',
//     'img/banana.png',
//     'img/cat.png',
//     'img/dinosaur.png'
// ];

// function cpuTurn() {
//     // Get all cells
//     const cells = document.querySelectorAll(".cell");
//     const emptyCells = [];

//     // Find empty cells
//     cells.forEach((cell, index) => {
//         if (cell.textContent === "") {
//             emptyCells.push(index);
//         }
//     });

//     // Randomly select an empty cell
//     if (emptyCells.length > 0) {
//         const randomIndex = Math.floor(Math.random() * emptyCells.length);
//         const selectedCellIndex = emptyCells[randomIndex];

//         // Randomly select a token from available tokens
//         const randomTokenIndex = Math.floor(Math.random() * availableTokens.length);
//         const selectedToken = availableTokens[randomTokenIndex];

//         // Simulate CPU thinking with a delay
//         setTimeout(() => {
//             // Simulate placing the CPU's token in the selected cell
//             cells[selectedCellIndex].textContent = selectedToken;
//             // Call playRound or any other function to handle the game logic
//             game.playRound(Math.floor(selectedCellIndex / 3), selectedCellIndex % 3);
//         }, 1000); // 1 second delay
//     }
// }

const endGame = (message) => {
    updateMessage(message);

    const cells = document.querySelectorAll(".cell");
    cells.forEach(cell => {
        cell.style.pointerEvents = "none";
    });
};

const updateMessage = (message) => {
    const messageContainer = document.getElementById("gameMessage");
    
    // Check if messageContainer exists
    if (!messageContainer) {
        console.error("Message container not found!");
        return;
    }
    
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
    const activePlayer = game.getActivePlayer ? game.getActivePlayer() : null;

    console.log(messageElement);
    console.log("Contenuto DOM dopo il reset:", messageElement ? messageElement.textContent : "Elemento non trovato");
    if (messageElement && activePlayer) {
        messageElement.textContent = `It's now ${activePlayer.name}'s turn.`;
    }
    
    setTimeout(() => {
        game.updateActivePlayerMessage();
        initializeGame();

        const updatedMessageElement = document.getElementById("activePlayerMessage");
        if (updatedMessageElement && activePlayer) {
            updatedMessageElement.textContent = `It's now ${activePlayer.name}'s turn.`;
        }
    }, 0);

    console.log("Game has been reset. Active player:", activePlayer ? activePlayer.name : null);

    console.log("game reset");
};

// initializeGame();