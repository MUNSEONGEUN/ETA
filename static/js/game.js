document.addEventListener('DOMContentLoaded', function() {
    const gameCanvas = document.getElementById('gameCanvas');
    const gameCtx = gameCanvas.getContext('2d');
    const scoreElement = document.getElementById('score');
    const livesElement = document.getElementById('lives');
    const levelElement = document.getElementById('level');
    const startButtonContainer = document.getElementById('start-button-container');
    const startButton = document.getElementById('start-button');

    const GAME_SETTINGS = {
        initialLives: 3,
        initialFallSpeed: 2,
        levelUpTime: 10000, // 10 seconds per level
        minPredictionCount: 10
    };

    let score = 0;
    let lives = GAME_SETTINGS.initialLives;
    let level = 1;
    let fallSpeed = GAME_SETTINGS.initialFallSpeed;
    let gameInterval, updateInterval, levelUpInterval;
    let samePredictionCount = 0;

    const words = {
        'alphabet': [],
        'numbers': [],
        'words': []
    };
    let fallingWords = [];
    let currentMode = 'words';

    // 초기 설정에서 버튼을 명시적으로 보이게 설정
    startButtonContainer.style.display = 'flex';

    async function fetchLabels(mode) {
        const urls = {
            'alphabet': '/recognition/get_alphabet_labels/',
            'numbers': '/recognition/get_number_labels/',
            'words': '/recognition/get_word_labels/'
        };

        try {
            const response = await fetch(urls[mode]);
            const data = await response.json();
            words[mode] = data[mode].filter(word => word !== 'del' && word !== 'space'); // 'del'과 'space' 필터링
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
            gameCtx.font = '20px Arial';
            gameCtx.fillStyle = 'black';
            gameCtx.fillText(wordObj.word, wordObj.x, wordObj.y);
            if (wordObj.y > gameCanvas.height) {
                createExplosion(wordObj.x, gameCanvas.height - 20, wordObj.word);
                fallingWords.splice(index, 1);
                updateLives(-1);
            }
        });
    }

    function createExplosion(x, y, word) {
        const wordElement = document.createElement('div');
        wordElement.textContent = word;
        wordElement.style.position = 'absolute';
        wordElement.style.left = `${x}px`;
        wordElement.style.top = `${y}px`;
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
        levelUpInterval = setInterval(levelUp, GAME_SETTINGS.levelUpTime);
    }

    function checkCollision(predictedWord) {
        console.log(`Checking collision for: ${predictedWord}`);
        fallingWords.forEach((wordObj, index) => {
            console.log(`Comparing with: ${wordObj.word}`);
            if (String(wordObj.word) === String(predictedWord) && wordObj.y < gameCanvas.height - 50) {
                createExplosion(wordObj.x, wordObj.y, wordObj.word);
                fallingWords.splice(index, 1);
                updateScore(10);
                console.log(`Removed word: ${wordObj.word}`);
            }
        });
    }

    function resetGame() {
        score = 0;
        lives = GAME_SETTINGS.initialLives;
        level = 1;
        fallSpeed = GAME_SETTINGS.initialFallSpeed;
        updateUI();
        fallingWords = [];
        samePredictionCount = 0;
        gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    }

    function updateUI() {
        scoreElement.innerText = `Score: ${score}`;
        livesElement.innerText = `Lives: ${lives}`;
        levelElement.innerText = `Level: ${level}`;
    }

    function updateScore(amount) {
        score += amount;
        scoreElement.innerText = `Score: ${score}`;
    }

    function updateLives(amount) {
        lives += amount;
        livesElement.innerText = `Lives: ${lives}`;
        if (lives <= 0) {
            gameOver();
        }
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
        startButtonContainer.style.display = 'flex'; // Start 버튼 다시 보이기
    }

    window.setMode = function(mode) {
        currentMode = mode;
        fetchLabels(mode).then(() => {
            // Fetch labels 완료 후 단어 목록 확인
            console.log(`Filtered words for mode ${mode}:`, words[mode]);
        });

        // 게임 인터벌 정리
        clearInterval(gameInterval);
        clearInterval(updateInterval);
        clearInterval(levelUpInterval);

        resetGame();

        // Start Game 버튼 표시
        startButtonContainer.style.display = 'flex'; // Start 버튼 다시 보이기

        // 활성화된 버튼 스타일 업데이트
        const buttons = document.querySelectorAll('.category-button');
        buttons.forEach(button => {
            if (button.textContent.toLowerCase() === mode) {
                button.style.backgroundColor = '#ff7f50';
                button.style.color = '#ffffff';
            } else {
                button.style.backgroundColor = '';
                button.style.color = '';
            }
        });
    };

    document.querySelector('.button-container').onclick = (event) => {
        if (event.target.tagName === 'BUTTON') {
            setMode(event.target.textContent.toLowerCase());
        }
    };

    startButton.addEventListener('click', startGame); // Start 버튼 클릭 이벤트 추가

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
            const finalPrediction = data.final_prediction;
            console.log(`Predicted word: ${finalPrediction}`);
            if (finalPrediction !== 'Try Again') {
                samePredictionCount++;
                if (samePredictionCount >= GAME_SETTINGS.minPredictionCount) {
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
