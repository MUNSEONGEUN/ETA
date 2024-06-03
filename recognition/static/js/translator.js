const video = document.getElementById('video');
const canvas = document.getElementById('outputCanvas');
const ctx = canvas.getContext('2d');
const csrfToken = document.querySelector('input[name="csrfmiddlewaretoken"]').value;
const body = document.getElementById('body');

let category = 'alphabet'; // 기본 카테고리 설정
let lastPrediction = '';
let samePredictionCount = 0;
const minPredictionCount = 100; // 같은 단어로 인식된 최소 횟수

// Mediapipe 설정
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
    width: 640,
    height: 480
});
camera.start();

let handsResults = null;

hands.onResults((results) => {
    handsResults = results;
});

function setCategory(selectedCategory) {
    category = selectedCategory;
    document.getElementById('result').innerText = `Selected category: ${category}`;
    updateBackground(selectedCategory);
}

function updateBackground(category) {
    body.classList.remove('alphabet-mode', 'numbers-mode', 'words-mode');
    if (category === 'alphabet') {
        body.classList.add('alphabet-mode');
    } else if (category === 'numbers') {
        body.classList.add('numbers-mode');
    } else if (category === 'words') {
        body.classList.add('words-mode');
    }
}

function drawVideoAndResults() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    if (handsResults && handsResults.multiHandLandmarks) {
        handsResults.multiHandLandmarks.forEach((landmarks) => {
            drawLandmarks(ctx, landmarks, {color: 'white', lineWidth: 2, radius: 2});
            drawBoundingBox(ctx, landmarks, {color: 'brown', lineWidth: 2});
        });

        const landmarksArray = handsResults.multiHandLandmarks.flat().map(landmark => [landmark.x, landmark.y, landmark.z]);
        if (landmarksArray.length > 0) {
            sendLandmarks(landmarksArray);
        }
    } else {
        document.getElementById('result').innerText = 'No hands detected';
    }
}

function drawLandmarks(ctx, landmarks, {color, lineWidth, radius}) {
    for (let i = 0; i < landmarks.length; i++) {
        const x = landmarks[i].x * canvas.width;
        const y = landmarks[i].y * canvas.height;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
    }
}

function drawBoundingBox(ctx, landmarks, {color, lineWidth}) {
    const xValues = landmarks.map(landmark => landmark.x * canvas.width);
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
            document.getElementById('text-input').value += finalPrediction + ' '; // 예측된 단어를 텍스트 입력란에 추가
            samePredictionCount = 0; // Reset count after updating result
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('result').innerText = 'Prediction error';
    });
}
