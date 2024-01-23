// Setting up the canvas
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');

// Set the background color to black
canvas.style.backgroundColor = 'black';

// Load the Google Font
const fontLink = document.createElement('link');
fontLink.href = 'https://fonts.googleapis.com/css2?family=Lobster&display=swap';
fontLink.rel = 'stylesheet';
document.head.appendChild(fontLink);

// Ball properties
const ball = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2,
  radius: 20,
  color: 'blue',
  speed: 50,
  timestamp: Date.now(), // This line stores the timestamp of the last touch of an obstacle
};

// Empty obstacle array to store the obstacles created
const obstacles = [];

// Score variable to keep track of the player's score
let score = 0;

// Scoreboard to display the score
const scoreboard = document.createElement('div');
document.body.appendChild(scoreboard);

// Event listening for when the arrow keys are pressed
document.addEventListener('keydown', (event) => {
  //*lines written with the help of AI*
  switch (event.keyCode) {
    case 37: // Move left
      ball.x -= ball.speed;
      break;
    case 38: // Move up
      ball.y -= ball.speed;
      break;
    case 39: // Move right
      ball.x += ball.speed;
      break;
    case 40: // Move down
      ball.y += ball.speed;
      break;
  }
});

// Event listening for when the mouse moves
document.addEventListener('mousemove', (event) => {
  // Updates the ball position based on the mouse coordinates
  ball.x = event.clientX;
  ball.y = event.clientY;
});

// Event listening for when the mouse is pressed
document.addEventListener('mousedown', () => {
  
// Setting the color of the ball to a random color
  const randomColor = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
  ball.color = randomColor;
});

// Function to generate random obstacles on the canvas
function generateObstacle() {
  // Generates a random color for the obstacle
  const randomColor = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;

// This adds rectangles randomly across the screen with a specified width and height  
  const obstacle = {
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    width: 50,
    height: 50,
    color: randomColor, // The rectangles spawn with a random color
    timestamp: Date.now(), // Timestamps the creation of each obstacle
  };
  obstacles.push(obstacle);
}

// Function to draw the ball and customize it (size and color)
function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = ball.color;
  ctx.fill();
  ctx.closePath();
}

// Function to draw the obstacles on the canvas
function drawObstacles() {
  obstacles.forEach((obstacle) => {
    ctx.fillStyle = obstacle.color;
    // Rectangle spawn on the random coordinates defined above
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
  });
}

// Function to detect if there is a collision between the ball and the obstacles (scoring a point)
function checkCollisions() {
  obstacles.forEach((obstacle, index) => {
    //*lines written with the help of AI*
    if (
      ball.x < obstacle.x + obstacle.width &&
      ball.x + ball.radius > obstacle.x &&
      ball.y < obstacle.y + obstacle.height &&
      ball.y + ball.radius > obstacle.y
    ) {

// If collision is detected this code removes the obstacle the ball colided with and adds a point to the scoreboard
      obstacles.splice(index, 1); // Remove the obstacle
      score++; // Add to the score
      ball.timestamp = Date.now(); // Update the timestamp of the last touch on the obstacles
      updateScoreboard();
    }
  });
}

// The main game update feature which clears the canvas and draws the ball and objects for the next animation frame
function update() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight); // Clears the rectangles
  drawBall();
  drawObstacles();
  checkCollisions();

// This resets the score if the ball hasn't touched any obstacles for 6 seconds (if the player is afk)
  const currentTime = Date.now();
  const timeDifference = currentTime - ball.timestamp;
  if (timeDifference > 6000) {
    score = 0;
    updateScoreboard();
  }

// Remove obstacles that have been on the screen for more than 2.5 seconds
  obstacles.forEach((obstacle, index) => {
    const timeDifference = currentTime - obstacle.timestamp;
    if (timeDifference > 2500) {
      obstacles.splice(index, 1);
    }
  });
  
// Generate obstacles coordinates randomly
  if (Math.random() < 0.02) {
    generateObstacle();
  }

// Updates the screen with the new animation frame
  requestAnimationFrame(update);
}

// Function which updates the displayed score on the scoreboard
function updateScoreboard() {
  // Using the Google Font for the scoreboard text
  scoreboard.style.fontFamily = 'Lobster, sans-serif';
  scoreboard.innerHTML = `Score &nbsp;${score}&nbsp;&nbsp;&nbsp;-&nbsp; By: Savya Sarda`;
}

// Resize canvas when the screen size changes
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ball.x = window.innerWidth / 2;
  ball.y = window.innerHeight / 2;
});

// An event listener is added to resize the canvas and reposition the ball when the window is resized
window.addEventListener('load', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  updateScoreboard();
  update();
});