document.addEventListener("DOMContentLoaded", () => {
    // Riferimenti agli elementi
    const startScreen = document.getElementById("startScreen");
    const iconScreen = document.getElementById("iconScreen");
    const boardContainer = document.getElementById("boardContainer");
    const gameMessage = document.getElementById("gameMessage");
    const gifContainer = document.getElementById("gifContainer");

    const vsPlayerButton = document.getElementById("vsPlayer");
    const vsCPUButton = document.getElementById("vsCPU");
    const iconButtons = document.querySelectorAll(".iconBtn");

    let selectedGameMode = ""; // Memorizza la modalità di gioco scelta
    let selectedIcon = ""; // Memorizza l'icona scelta dal giocatore

    // Nascondi tutte le sezioni eccetto quella iniziale
    iconScreen.style.display = "none";
    boardContainer.style.display = "none";
    gameMessage.style.display = "none";
    gifContainer.style.display = "none";

    // Event listener per la selezione della modalità di gioco
    vsPlayerButton.addEventListener("click", () => {
        selectedGameMode = "Player vs Player";
        console.log(`Selected Game Mode: ${selectedGameMode}`);
        startScreen.style.display = "none";
        iconScreen.style.display = "block"; // Mostra schermata di selezione icone
    });

    vsCPUButton.addEventListener("click", () => {
        selectedGameMode = "Player vs CPU";
        console.log(`Selected Game Mode: ${selectedGameMode}`);
        startScreen.style.display = "none";
        iconScreen.style.display = "block"; // Mostra schermata di selezione icone
    });

    // Event listener per la selezione delle icone
    iconButtons.forEach((button) => {
        button.addEventListener("click", (e) => {
            const clickedButton = e.target.closest("button");
            selectedIcon = clickedButton.id; // Usa l'ID del pulsante come identificatore
            console.log(`Selected Icon: ${selectedIcon}`);
            iconScreen.style.display = "none"; // Nascondi la schermata delle icone
            boardContainer.style.display = "block"; // Mostra la board
            gameMessage.style.display = "block"; // Mostra il messaggio del turno
        });
    });
});
