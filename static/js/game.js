const gameCanvas = document.getElementById('gameCanvas');
const gameCtx = gameCanvas.getContext('2d');
const words = ["hello", "world", "sign", "language", "translator"]; // 예시 단어들
let fallingWords = [];

function createFallingWord() {
    const word = words[Math.floor(Math.random() * words.length)];
    const x = Math.random() * (gameCanvas.width - 100);
    const y = 0;
    fallingWords.push({ word, x, y });
}

function updateFallingWords() {
    gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    fallingWords.forEach((wordObj, index) => {
        wordObj.y += 2; // 단어가 떨어지는 속도
        gameCtx.font = '20px Arial';
        gameCtx.fillStyle = 'black';
        gameCtx.fillText(wordObj.word, wordObj.x, wordObj.y);
        if (wordObj.y > gameCanvas.height) {
            fallingWords.splice(index, 1); // 화면을 벗어난 단어 제거
        }
    });
}

function startGame() {
    setInterval(createFallingWord, 2000); // 2초마다 새로운 단어 생성
    setInterval(updateFallingWords, 30); // 30ms마다 단어 위치 업데이트
}

startGame();

function checkCollision(predictedWord) {
    fallingWords.forEach((wordObj, index) => {
        if (wordObj.word === predictedWord && wordObj.y < gameCanvas.height - 50) {
            fallingWords.splice(index, 1); // 단어 맞추기
        }
    });
}

// translator.js 파일의 sendLandmarks 함수에서 아래 코드를 추가합니다.
function sendLandmarks(landmarks) {
    fetch('/recognition/predict/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken
        },
        body: JSON.stringify({ landmarks: landmarks, category: category })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        const finalPrediction = data.final_prediction;

        if (finalPrediction === lastPrediction) {
            samePredictionCount++;
        } else {
            samePredictionCount = 0;
            lastPrediction = finalPrediction;
        }

        if (samePredictionCount >= minPredictionCount) {
            document.getElementById('word').innerText = finalPrediction; // 예측된 단어를 업데이트
            samePredictionCount = 0; // Reset count after updating result

            // 단어 맞추기 확인
            checkCollision(finalPrediction);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('result').innerText = 'Prediction error';
    });
}
