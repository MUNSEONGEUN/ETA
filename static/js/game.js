document.addEventListener('DOMContentLoaded', function() {
    const gameCanvas = document.getElementById('gameCanvas');
    const gameCtx = gameCanvas.getContext('2d');
    const words = {
        'alphabet': [],
        'numbers': [],
        'words': ["Hello", "No", "Perfect", "Yes", "cry", "iloveyou", "korea", "walk", "why"]
    };
    let fallingWords = [];
    let currentMode = 'words';
    let samePredictionCount = 0;
    const minPredictionCount = 10;

    async function fetchLabels(mode) {
        let url = '';
        if (mode === 'alphabet') url = '/recognition/get_alphabet_labels/';
        else if (mode === 'numbers') url = '/recognition/get_number_labels/';
        
        try {
            const response = await fetch(url);
            const data = await response.json();
            words[mode] = data[mode];
            console.log(`Fetched ${mode} labels:`, words[mode]); // 디버깅 메시지
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

    function checkCollision(predictedWord) {
        console.log(`Checking collision for: ${predictedWord}`); // 디버깅 메시지
        fallingWords.forEach((wordObj, index) => {
            console.log(`Comparing with: ${wordObj.word}`); // 디버깅 메시지
            // predictedWord와 wordObj.word를 문자열로 변환하여 비교
            if (String(wordObj.word) === String(predictedWord) && wordObj.y < gameCanvas.height - 50) {
                fallingWords.splice(index, 1); // 단어 맞추기
                console.log(`Removed word: ${wordObj.word}`); // 디버깅 메시지
            }
        });
    }
    

    window.setMode = function(mode) {
        currentMode = mode;
        fetchLabels(mode);
        fallingWords = [];
        samePredictionCount = 0;
        const predictedWordElement = document.getElementById('predicted-word');
        if (predictedWordElement) {
            predictedWordElement.innerText = ''; // 예측된 단어 초기화
        }
    };

    document.querySelector('.button-container').onclick = (event) => {
        if (event.target.tagName === 'BUTTON') {
            setMode(event.target.textContent.toLowerCase());
        }
    };

    startGame();

    // Mediapipe 설정
    const video = document.createElement('video'); // 비디오 요소 생성
    const canvas = document.getElementById('outputCanvas');
    const ctx = canvas.getContext('2d');
    const csrfToken = document.querySelector('input[name="csrfmiddlewaretoken"]').value;

    video.style.display = 'none'; // 비디오 요소 숨기기
    document.body.appendChild(video); // 비디오 요소 추가

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
            console.log(`Predicted word: ${finalPrediction}`); // 디버깅 메시지
            if (data.probabilities[0] > 0.5) {
                samePredictionCount++;
            } 
            if (samePredictionCount >= minPredictionCount) {
                checkCollision(finalPrediction);
                samePredictionCount = 0;
            }
            const predictedWordElement = document.getElementById('predicted-word');
            if (predictedWordElement) {
                predictedWordElement.innerText = finalPrediction; // 예측된 단어 업데이트
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
});
