const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");

const user = {
  x: 0,
  y: canvas.height / 2 - 100 / 2,
  width: 10,
  height: 100,
  color: "#00ffff",
  score: 0,
};

const com = {
  x: canvas.width - 10,
  y: canvas.height / 2 - 100 / 2,
  width: 10,
  height: 100,
  color: "#ff00ff",
  score: 0,
};

const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 10,
  speed: 5,
  velocityX: 5,
  velocityY: 5,
  color: "#fff",
};

function drawRect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.shadowBlur = 10;
  ctx.shadowColor = color;
  ctx.fillRect(x, y, w, h);
  ctx.shadowBlur = 0;
}

function drawCircle(x, y, r, color) {
  ctx.fillStyle = color;
  ctx.shadowBlur = 10;
  ctx.shadowColor = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2, false);
  ctx.closePath();
  ctx.fill();
  ctx.shadowBlur = 0;
}

function drawText(text, x, y, color) {
  ctx.fillStyle = color;
  ctx.font = "45px 'Press Start 2P'";
  ctx.fillText(text, x, y);
}

function drawNet() {
  for (let i = 0; i <= canvas.height; i += 15) {
    drawRect(canvas.width / 2 - 1, i, 2, 10, "#555");
  }
}

function render() {
  drawRect(0, 0, canvas.width, canvas.height, "#000");

  drawNet();

  drawText(user.score, canvas.width / 4, canvas.height / 5, "#fff");
  drawText(com.score, (3 * canvas.width) / 4, canvas.height / 5, "#fff");

  drawRect(user.x, user.y, user.width, user.height, user.color);
  drawRect(com.x, com.y, com.width, com.height, com.color);

  drawCircle(ball.x, ball.y, ball.radius, ball.color);
}

canvas.addEventListener("mousemove", movePaddle);

function movePaddle(evt) {
  let rect = canvas.getBoundingClientRect();
  user.y = evt.clientY - rect.top - user.height / 2;
}

document.addEventListener("keydown", function (evt) {
  switch (evt.keyCode) {
    case 38:
    case 87:
      user.y -= 20;
      break;
    case 40:
    case 83:
      user.y += 20;
      break;
  }
});

function collision(b, p) {
  p.top = p.y;
  p.bottom = p.y + p.height;
  p.left = p.x;
  p.right = p.x + p.width;

  b.top = b.y - b.radius;
  b.bottom = b.y + b.radius;
  b.left = b.x - b.radius;
  b.right = b.x + b.radius;

  return (
    b.right > p.left && b.bottom > p.top && b.left < p.right && b.top < p.bottom
  );
}

function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.speed = 5;
  ball.velocityX = -ball.velocityX;
}

function update() {
  if (ball.x - ball.radius < 0) {
    com.score++;
    resetBall();
  } else if (ball.x + ball.radius > canvas.width) {
    user.score++;
    resetBall();
  }

  ball.x += ball.velocityX;
  ball.y += ball.velocityY;

  let computerLevel = 0.04;
  com.y += (ball.y - (com.y + com.height / 2)) * computerLevel;

  if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
    ball.velocityY = -ball.velocityY;
  }

  let player = ball.x + ball.radius < canvas.width / 2 ? user : com;

  if (collision(ball, player)) {
    let collidePoint = ball.y - (player.y + player.height / 2);

    collidePoint = collidePoint / (player.height / 2);

    let angleRad = (Math.PI / 4) * collidePoint;

    let direction = ball.x + ball.radius < canvas.width / 2 ? 1 : -1;

    ball.velocityX = direction * ball.speed * Math.cos(angleRad);
    ball.velocityY = ball.speed * Math.sin(angleRad);

    ball.speed += 0.5;
  }
}

function game() {
  update();
  render();
}

const framePerSecond = 50;
setInterval(game, 1000 / framePerSecond);
