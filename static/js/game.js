document.addEventListener('DOMContentLoaded', function() {
    const gameCanvas = document.getElementById('gameCanvas');
    const gameCtx = gameCanvas.getContext('2d');
    const scoreElement = document.getElementById('score');
    // const livesElement = document.getElementById('lives');
    const levelElement = document.getElementById('level');
    const startButtonContainer = document.getElementById('start-button-container');
    const startButton = document.getElementById('start-button');
    const heart = document.getElementById("heart");

    let score = 0;
    let lives = 4;
    let level = 1;
    let fallSpeed = 2;
    let levelUpTime = 10000; // 10 seconds per level
    let gameInterval;
    let updateInterval;
    let levelUpInterval;

    const words = {
        'alphabet': [],
        'numbers': [],
        'words': []
    };
    let fallingWords = [];
    let currentMode = null;
    let samePredictionCount = 0;
    const minPredictionCount = 10;

    // 초기 설정에서 버튼을 명시적으로 숨김
    startButtonContainer.style.display = 'none';

    async function fetchLabels(mode) {
        let url = '';
        if (mode === 'alphabet') url = '/recognition/get_alphabet_labels/';
        else if (mode === 'numbers') url = '/recognition/get_number_labels/';
        else if (mode === 'words') url = '/recognition/get_word_labels/';

        try {
            const response = await fetch(url);
            const data = await response.json();
            
            if (data && data.words) {
                words[mode] = data.words.filter(word => word !== 'del' && word !== 'space'); // 'del'과 'space' 필터링
            } else if (data && data.alphabet) {
                words[mode] = data.alphabet.filter(word => word !== 'del' && word !== 'space');
            } else if (data && data.numbers) {
                words[mode] = data.numbers.filter(word => word !== 'del' && word !== 'space');
            }
            
            console.log(`Fetched ${mode} labels:`, words[mode]);
        } catch (error) {
            console.error(`Error fetching ${mode} labels:`, error);
        }
    }

    function createFallingWord() {
        if (words[currentMode].length === 0) return;
        const word = words[currentMode][Math.floor(Math.random() * words[currentMode].length)];
        const x = Math.random() * (gameCanvas.width - 100);
        const y = 0;
        fallingWords.push({ word, x, y });
    }

    function updateFallingWords() {
        gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
        fallingWords.forEach((wordObj, index) => {
            wordObj.y += fallSpeed;
            gameCtx.font = '20px Comic Sans MS';
            gameCtx.fillStyle = 'black';
            gameCtx.fillText(wordObj.word, wordObj.x, wordObj.y);
            if (wordObj.y > gameCanvas.height) {
                createExplosion(wordObj.x, gameCanvas.height - 20, wordObj.word);
                fallingWords.splice(index, 1);
                lives--;
                // livesElement.innerText = `Lives: ${lives}`;
                switch (lives) {
                    case 1:
                        heart.innerText = "♥♡♡♡"
                        break;
                    case 2:
                        heart.innerText = "♥♥♡♡"
                        break;
                    case 3:
                        heart.innerText = "♥♥♥♡"
                        break;
                    case 4:
                        heart.innerText = "♥♥♥♥"
                        break;
                
                    default:
                        heart.innerText = "♡♡♡♡"
                        break;
                }
                if (lives <= 0) {
                    gameOver();
                }
            }
        });
    }

    function createExplosion(x, y, word) {
        const wordElement = document.createElement('div');
        wordElement.textContent = word;
        wordElement.style.position = 'absolute';
        wordElement.style.left = x + 'px';
        wordElement.style.top = y + 'px';
        wordElement.classList.add('explode');
        document.getElementById('game-area').appendChild(wordElement);

        wordElement.addEventListener('animationend', () => {
            wordElement.remove();
        });
    }

    function startGame() {
        startButtonContainer.style.display = 'none'; // Start 버튼 숨기기
        gameInterval = setInterval(createFallingWord, 2000);
        updateInterval = setInterval(updateFallingWords, 30);
        levelUpInterval = setInterval(levelUp, levelUpTime);
        heart.innerText = "♥♥♥♥"
    }

    function checkCollision(predictedWord) {
        console.log(`Checking collision for: ${predictedWord}`);
        fallingWords.forEach((wordObj, index) => {
            console.log(`Comparing with: ${wordObj.word}`);
            if (String(wordObj.word) === String(predictedWord) && wordObj.y < gameCanvas.height - 50) {
                createExplosion(wordObj.x, wordObj.y, wordObj.word);
                fallingWords.splice(index, 1);
                score += 10;
                scoreElement.innerText = `Score: ${score}`;
                console.log(`Removed word: ${wordObj.word}`);
            }
        });
    }

    function resetGame() {
        score = 0;
        lives = 4;
        level = 1;
        fallSpeed = 2;
        scoreElement.innerText = `Score: ${score}`;
        // livesElement.innerText = `Lives: ${lives}`;
        levelElement.innerText = `Level: ${level}`;
        heart.innerText = "♥♥♥♥"
        fallingWords = [];
        samePredictionCount = 0;
        gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    }

    function levelUp() {
        level++;
        fallSpeed += 1; // Increase fall speed
        levelElement.innerText = `Level: ${level}`;
        console.log(`Level up! Current level: ${level}, Fall speed: ${fallSpeed}`);
    }

    function gameOver() {
        clearInterval(gameInterval);
        clearInterval(updateInterval);
        clearInterval(levelUpInterval);
        alert(`Game Over\nFinal Score: ${score}\nFinal Level: ${level}`);
        resetGame();
        startButtonContainer.style.display = 'none'; // Start 버튼 숨기기
    }

    window.setMode = function(mode) {
        currentMode = mode;
        fetchLabels(mode).then(() => {
            console.log(`Filtered words for mode ${mode}:`, words[mode]);
        });

        clearInterval(gameInterval);
        clearInterval(updateInterval);
        clearInterval(levelUpInterval);

        resetGame();
        startButtonContainer.style.display = 'flex'; // Start 버튼 다시 보이기

        const buttons = document.querySelectorAll('.category-button');
        buttons.forEach(button => {
            if (button.textContent.toLowerCase() === mode) {
                button.classList.add('selected');
            } else {
                button.classList.remove('selected');
            }
        });
    };

    document.querySelector('.button-container').onclick = (event) => {
        if (event.target.tagName === 'BUTTON') {
            setMode(event.target.textContent.toLowerCase());
        }
    };

    startButton.addEventListener('click', startGame);

    const video = document.createElement('video');
    const canvas = document.getElementById('outputCanvas');
    const ctx = canvas.getContext('2d');
    const csrfToken = document.querySelector('input[name="csrfmiddlewaretoken"]').value;

    video.style.display = 'none';
    document.body.appendChild(video);

    const hands = new Hands({locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
    }});
    hands.setOptions({
        maxNumHands: 2,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
    });

    const camera = new Camera(video, {
        onFrame: async () => {
            await hands.send({image: video});
            drawVideoAndResults();
        },
        width: 160,
        height: 120
    });
    camera.start();

    let handsResults = null;

    hands.onResults((results) => {
        handsResults = results;
    });

    function drawVideoAndResults() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.scale(-1, 1);
        ctx.translate(-canvas.width, 0);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        ctx.restore();

        if (handsResults && handsResults.multiHandLandmarks) {
            handsResults.multiHandLandmarks.forEach((landmarks) => {
                drawBoundingBox(ctx, landmarks, {color: 'brown', lineWidth: 2});
            });

            const landmarksArray = handsResults.multiHandLandmarks.flat().map(landmark => [landmark.x, landmark.y, landmark.z]);
            if (landmarksArray.length > 0) {
                sendLandmarks(landmarksArray);
            }
        }
    }

    function drawBoundingBox(ctx, landmarks, {color, lineWidth}) {
        const xValues = landmarks.map(landmark => (1 - landmark.x) * canvas.width);
        const yValues = landmarks.map(landmark => landmark.y * canvas.height);

        const minX = Math.min(...xValues);
        const maxX = Math.max(...xValues);
        const minY = Math.min(...yValues);
        const maxY = Math.max(...yValues);

        ctx.beginPath();
        ctx.rect(minX, minY, maxX - minX, maxY - minY);
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = color;
        ctx.stroke();
    }

    function sendLandmarks(landmarks) {
        fetch('/recognition/predict/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken
            },
            body: JSON.stringify({ landmarks: landmarks, category: currentMode })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            let finalPrediction = data.final_prediction;
            if (finalPrediction === 'space' || finalPrediction === 'del') {
                finalPrediction = 'Try Again';
            }

            console.log(`Predicted word: ${finalPrediction}`);
            if (finalPrediction !== 'Try Again') {
                samePredictionCount++;
                if (samePredictionCount >= minPredictionCount) {
                    checkCollision(finalPrediction);
                    samePredictionCount = 0;
                }
            }

            const predictedWordElement = document.getElementById('predicted-word');
            if (predictedWordElement) {
                predictedWordElement.innerText = finalPrediction;
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
});
