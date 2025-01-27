// Session-based balances (reset on reload)
const sessionBalances = {};
let currentPlayer = "defaultPlayer";
let playerBalance = 0;

// Preset mines (5x5 grid with mine positions)
const minePositions = [3, 7, 12, 18, 22]; // Example mine locations
const gridSize = 25; // Total number of cells
let revealedCells = 0;

// Show admin panel on key press
document.addEventListener("keydown", (event) => {
  if (event.ctrlKey && event.key === "a") {
    document.getElementById("overlay").style.display = "block";
    document.getElementById("admin-panel").style.display = "block";
  }
});

// Fetch the admin password from a key server
async function fetchAdminPassword() {
  return "demoPassword"; // Simulated password for demo
}

// Unlock the admin panel
async function unlockAdminPanel() {
  const enteredPassword = document.getElementById("password").value;
  const correctPassword = await fetchAdminPassword();

  if (enteredPassword === correctPassword) {
    alert("Access Granted");
    document.getElementById("admin-content").classList.remove("hidden");
    document.getElementById("password").style.display = "none";
    document.querySelector('button[onclick="unlockAdminPanel()"]').style.display = "none";
  } else {
    alert("Incorrect Password");
  }
}

// Update session balance for a player
function updatePlayerBalance() {
  const playerId = document.getElementById("player-id").value;
  const newBalance = parseFloat(document.getElementById("balance").value);

  if (!playerId || isNaN(newBalance)) {
    alert("Please enter a valid player ID and balance.");
    return;
  }

  sessionBalances[playerId] = newBalance;
  if (playerId === currentPlayer) {
    playerBalance = newBalance;
    document.getElementById("player-balance").textContent = playerBalance.toFixed(2);
  }

  displaySessionBalances();
}

// Display session balances
function displaySessionBalances() {
  const balancesDiv = document.getElementById("session-balances");
  balancesDiv.innerHTML = "";

  for (const [playerId, balance] of Object.entries(sessionBalances)) {
    balancesDiv.innerHTML += `<p><strong>${playerId}</strong>: $${balance.toFixed(2)}</p>`;
  }
}

// Initialize Mines game grid
function initializeGame() {
  const gameGrid = document.getElementById("game-grid");
  gameGrid.innerHTML = ""; // Clear the grid
  revealedCells = 0;
  document.getElementById("game-status").textContent = "Click cells to reveal safe spots!";

  for (let i = 0; i < gridSize; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.dataset.index = i;

    cell.addEventListener("click", () => {
      if (minePositions.includes(i)) {
        cell.classList.add("mine");
        document.getElementById("game-status").textContent = "💥 You hit a mine! Game over.";
        document.getElementById("game-grid").style.pointerEvents = "none";
      } else {
        cell.classList.add("safe");
        revealedCells++;
        if (revealedCells + minePositions.length === gridSize) {
          document.getElementById("game-status").textContent = "🎉 You won!";
        }
      }
      cell.style.pointerEvents = "none"; // Prevent multiple clicks
    });

    gameGrid.appendChild(cell);
  }
}

// Reset the game
document.getElementById("reset-game").addEventListener("click", initializeGame);

// Initialize everything on page load
initializeGame();
