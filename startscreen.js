// Define a flag to prevent multiple CPU moves
let cpuMoveInProgress = false;

// Define cpuTurn function in the global scope
window.cpuTurn = function() {
    console.log("Global CPU turn function called");
    
    // Prevent multiple CPU moves at the same time
    if (cpuMoveInProgress) {
        console.log("CPU move already in progress, ignoring this call");
        return;
    }
    
    // Set the flag to prevent double moves
    cpuMoveInProgress = true;
    
    if (!window.game) {
        console.error("Game object not found!");
        cpuMoveInProgress = false;
        return;
    }
    
    console.log("CPU turn started");
    console.log("Game mode:", window.game.mode);
    console.log("Active player:", window.game.getActivePlayer ? window.game.getActivePlayer().name : "Unknown");
    
    // Check if it's actually the CPU's turn
    if (window.game.getActivePlayer && window.game.getActivePlayer().name !== "CPU") {
        console.log("Not CPU's turn, ignoring");
        cpuMoveInProgress = false;
        return;
    }
    
    // Get CPU token using getPlayers instead of directly accessing players
    let cpuToken = null;
    if (window.game.getPlayers) {
        const players = window.game.getPlayers();
        cpuToken = players[1].token;
        console.log("CPU token from getPlayers:", cpuToken);
    } else {
        console.error("getPlayers method not found!");
        cpuMoveInProgress = false;
        return;
    }

    // Get the current board state
    const board = window.game.board.getBoard();
    console.log("Current Board State:", board);

    // Find all empty cells
    const emptyCells = [];
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length; col++) {
            if (board[row][col].getValue() === 0) {
                emptyCells.push({ row, col });
            }
        }
    }

    if (emptyCells.length > 0) {
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        const { row, col } = emptyCells[randomIndex];
        console.log(`CPU placing token at row: ${row}, column: ${col}`);

        // Add a delay to simulate CPU thinking
        setTimeout(() => {
            const cells = document.querySelectorAll(".cell");
            const cellIndex = row * 3 + col;
            const selectedCell = cells[cellIndex];

            // Update the UI
            const img = document.createElement("img");
            img.src = cpuToken;
            img.alt = "CPU Move";
            selectedCell.appendChild(img);

            // Update the game state
            window.game.playRound(row, col);
            
            // Reset the flag after the move is complete
            cpuMoveInProgress = false;
        }, 1000);
    } else {
        console.log("No empty cells available for CPU.");
        cpuMoveInProgress = false;
    }
};

document.addEventListener("DOMContentLoaded", () => {

    // Initialize the game object
    window.game = {
        mode: null,
        player1: { name: null, token: null },
        player2: { name: null, token: null },
        board: Gameboard(), 
        isGameOver: () => false,
        playRound: (row, col) => {
            console.log(`Mossa giocata: riga ${row}, colonna ${col}`);
        },
        updateActivePlayerMessage: () => {
            console.log("Aggiorno messaggio giocatore attivo.");
        },
        getActivePlayer: () => {
            return window.game.player1; // Default to player1 until properly initialized
        }
    };

    //get di tutti gli elements
    const startScreen = document.getElementById("startScreen");
    const iconScreen = document.getElementById("iconScreen");
    const boardContainer = document.getElementById("boardContainer");
    const gameMessage = document.getElementById("gameMessage");

    const vsPlayerButton = document.getElementById("vsPlayer");
    const vsCPUButton = document.getElementById("vsCPU");
    const iconsBtn = document.querySelectorAll(".iconBtn");

    let selectedGameMode = null;
    let selectedIcon = null;
    let cpuTurn = null; // Variabile per la modalità di gioco

    function showScreen(screen) {
        const screens = [startScreen, iconScreen, boardContainer];
        screens.forEach(s => s.style.display = "none");
        
        if (screen === boardContainer) {
            screen.style.display = "grid"; 
            gameMessage.style.display = "flex";
        } else {
            screen.style.display = "flex"; 
            gameMessage.style.display = "none";
        }
    }

    showScreen(startScreen);

    //eventListener per il vs

    vsPlayerButton.addEventListener("click", () => {
        selectedGameMode = "Player vs Player";
        console.log(`Selected Game Mode: ${selectedGameMode}`);
        setupPlayerVsPlayer();
        showScreen(iconScreen);
    });

    vsCPUButton.addEventListener("click", () => {
        selectedGameMode = "Player vs CPU";
        console.log(`Selected Game Mode: ${selectedGameMode}`);
        setupPlayervsCPU();
        showScreen(iconScreen);
    });

    let currentPlayerSelecting = 1;

    iconsBtn.forEach((button) => {
        button.addEventListener("click", (e) => {
            e.stopPropagation();
            e.preventDefault();
            
            const selectedIcon = e.currentTarget.querySelector("img").getAttribute("data-icon");
            const tokenPath = `img/${selectedIcon}`;

            if (currentPlayerSelecting === 1) {
                button.disabled = true;
                game.player1.token = tokenPath; // Assegna l'icona a Player 1
                console.log(`Player 1 token set to: ${game.player1.token}`);
                console.log(`Player 1 selected icon: ${selectedIcon}`);
                
                // If in CPU mode, skip player 2 selection and go straight to game
                if (selectedGameMode === "Player vs CPU") {
                    showScreen(boardContainer);
                    initializeGame();
                } else {
                    // In Player vs Player mode, continue to player 2 selection
                    currentPlayerSelecting = 2;
                }
            } else if (currentPlayerSelecting === 2) {
                button.disabled = true;
                game.player2.token = tokenPath; // Assegna l'icona a Player 2
                console.log(`Player 2 token set to: ${game.player2.token}`);
                console.log(`Player 2 selected icon: ${selectedIcon}`);
                showScreen(boardContainer);
                initializeGame();
            } else {
                console.log("No icon selected for Player 2!");
            }
        });
    });

    function setupPlayerVsPlayer() {
        game.mode = "Player vs Player";
        game.player1 = {name: "Player 1", token: "" };
        game.player2 = {name: "Player 2", token: "" };
    }

    function setupPlayervsCPU() {
        game.mode = "Player vs CPU";
        game.player1 = {name: "Player", token: null };
        game.player2 = {name: "CPU", token: null };

        // Available tokens for CPU to choose from
        const availableTokens = [
            'img/x-icon.png',
            'img/o-icon.png',
            'img/pizza.png',
            'img/ice-cream.png',
            'img/poop.png',
            'img/happy.png',
            'img/banana.png',
            'img/cat.png',
            'img/dinosaur.png'
        ];

        // Immediately assign a random token to CPU
        const randomTokenIndex = Math.floor(Math.random() * availableTokens.length);
        game.player2.token = availableTokens[randomTokenIndex];
        console.log(`CPU automatically assigned token: ${game.player2.token}`);
    }

    function initializeGame() {
        console.log("Inizializzazione del gioco in startscreen.js");
        console.log("Player 1 Token before GameController:", game.player1.token);
        console.log("Player 2 Token before GameController:", game.player2.token);
        console.log("Game mode before GameController:", game.mode);
        
        // Create a new game controller with the selected tokens
        const newGame = GameController(
            game.player1.name,
            game.player2.name,
            game.player1.token,
            game.player2.token
        );
        
        // Copy the game mode from the old game object
        newGame.mode = game.mode;
        console.log("Game mode after setting in new game:", newGame.mode);
        
        // Replace the global game object with the new one
        window.game = newGame;
        
        console.log("New game created:", window.game);
        
        // Check if we're in CPU mode and if the CPU should go first
        if (game.mode === "Player vs CPU") {
            console.log("CPU mode detected, checking if CPU should go first");
            
            // Randomly decide who goes first (50% chance)
            const cpuGoesFirst = Math.random() < 0.5;
            
            if (cpuGoesFirst) {
                console.log("CPU will go first");
                // Set a timeout to allow the board to be fully rendered
                setTimeout(() => {
                    if (typeof window.cpuTurn === 'function') {
                        console.log("Calling cpuTurn from initializeGame - CPU goes first");
                        window.cpuTurn();
                    } else {
                        console.error("cpuTurn function not found!");
                    }
                }, 1000);
            } else {
                console.log("Player will go first");
            }
        }
    }

});