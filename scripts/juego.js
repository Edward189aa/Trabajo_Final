// Minijuego: Atrapa los Coins
document.addEventListener("DOMContentLoaded", function () {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const scoreElement = document.getElementById("score");
  const startBtn = document.getElementById("startBtn");
  const resetBtn = document.getElementById("resetBtn");

  // Variables del juego
  let score = 0;
  let gameRunning = false;
  let playerX = canvas.width / 2 - 25;
  const playerWidth = 50;
  const playerHeight = 20;
  const playerSpeed = 7;

  // Array de coins
  let coins = [];
  const coinRadius = 15;
  const coinSpeed = 3;

  // Eventos de teclado
  const keys = {};

  window.addEventListener("keydown", (e) => {
    keys[e.key] = true;
  });

  window.addEventListener("keyup", (e) => {
    keys[e.key] = false;
  });

  // Función para dibujar al jugador
  function drawPlayer() {
    ctx.fillStyle =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--primary-color")
        .trim() || "#bb86fc";
    ctx.fillRect(
      playerX,
      canvas.height - playerHeight - 10,
      playerWidth,
      playerHeight
    );

    // Dibujar detalles del jugador
    ctx.fillStyle =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--surface-color")
        .trim() || "#1e1e1e";
    ctx.fillRect(
      playerX + 5,
      canvas.height - playerHeight - 5,
      playerWidth - 10,
      5
    );
  }

  // Función para crear un nuevo coin
  function createCoin() {
    const x = Math.random() * (canvas.width - coinRadius * 2) + coinRadius;
    coins.push({
      x: x,
      y: -coinRadius,
      radius: coinRadius,
    });
  }

  // Función para dibujar los coins
  function drawCoins() {
    ctx.fillStyle = "#FFD700";
    coins.forEach((coin) => {
      ctx.beginPath();
      ctx.arc(coin.x, coin.y, coin.radius, 0, Math.PI * 2);
      ctx.fill();

      // Detalles del coin
      ctx.fillStyle = "#FFA500";
      ctx.beginPath();
      ctx.arc(coin.x, coin.y, coin.radius * 0.7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#FFD700";
    });
  }

  // Función para actualizar la posición de los coins
  function updateCoins() {
    for (let i = coins.length - 1; i >= 0; i--) {
      coins[i].y += coinSpeed;

      // Detectar colisión con el jugador
      if (
        coins[i].y + coins[i].radius >= canvas.height - playerHeight - 10 &&
        coins[i].x >= playerX &&
        coins[i].x <= playerX + playerWidth
      ) {
        // Coin atrapado
        score += 10;
        scoreElement.textContent = score;
        coins.splice(i, 1);
        continue;
      }

      // Si el coin sale de la pantalla
      if (coins[i].y - coins[i].radius > canvas.height) {
        coins.splice(i, 1);
      }
    }
  }

  // Función para mover al jugador
  function movePlayer() {
    if (keys["ArrowLeft"] && playerX > 0) {
      playerX -= playerSpeed;
    }
    if (keys["ArrowRight"] && playerX < canvas.width - playerWidth) {
      playerX += playerSpeed;
    }
  }

  // Función principal del juego
  function gameLoop() {
    if (!gameRunning) return;

    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Mover y dibujar elementos
    movePlayer();
    drawPlayer();
    updateCoins();
    drawCoins();

    // Crear nuevos coins aleatoriamente
    if (Math.random() < 0.05) {
      createCoin();
    }

    // Continuar el bucle del juego
    requestAnimationFrame(gameLoop);
  }

  // Eventos de los botones
  startBtn.addEventListener("click", () => {
    if (!gameRunning) {
      gameRunning = true;
      gameLoop();
    }
  });

  resetBtn.addEventListener("click", () => {
    gameRunning = false;
    score = 0;
    scoreElement.textContent = score;
    coins = [];
    playerX = canvas.width / 2 - 25;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
  });

  // Dibujar al jugador inicialmente
  drawPlayer();
});
