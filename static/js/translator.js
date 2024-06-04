document.addEventListener('DOMContentLoaded', function() {
    const video = document.createElement('video');
    video.setAttribute('playsinline', '');
    video.setAttribute('autoplay', '');
    video.style.display = 'none';
    document.body.appendChild(video);

    const canvas = document.getElementById('outputCanvas');
    const ctx = canvas.getContext('2d');
    const csrfToken = document.querySelector('input[name="csrfmiddlewaretoken"]').value;

    let category = 'alphabet'; // 기본 카테고리 설정
    let lastPrediction = '';
    let samePredictionCount = 0;
    const minPredictionCount = 30; // 같은 단어로 인식된 최소 횟수
    const alphabetThreshold = 0.25; // 알파벳 임계값 25%
    const otherThreshold = 0.5; // 다른 카테고리 임계값 50%

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

    function drawVideoAndResults() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.scale(-1, 1); // 미러링 효과
        ctx.translate(-canvas.width, 0); // 좌표 변환
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        ctx.restore();

        if (handsResults && handsResults.multiHandLandmarks) {
            handsResults.multiHandLandmarks.forEach((landmarks) => {
                drawBoundingBox(ctx, landmarks, {color: 'red', lineWidth: 2});
            });

            const landmarksArray = handsResults.multiHandLandmarks.flat().map(landmark => [landmark.x, landmark.y, landmark.z]);
            if (landmarksArray.length > 0) {
                sendLandmarks(landmarksArray);
            }
        }
    }

    function drawBoundingBox(ctx, landmarks, {color, lineWidth}) {
        const xValues = landmarks.map(landmark => canvas.width - landmark.x * canvas.width); // 미러링된 x 좌표
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
            const predictionProb = data.probability;
            const threshold = (category === 'alphabet') ? alphabetThreshold : otherThreshold;

            if (finalPrediction !== 'Try Again' && predictionProb > threshold) { // "Try Again"일 때는 텍스트를 추가하지 않음
                document.getElementById('word').innerText = finalPrediction; // 예측된 단어만 표시

                if (finalPrediction === lastPrediction) {
                    samePredictionCount++;
                } else {
                    samePredictionCount = 0;
                    lastPrediction = finalPrediction;
                }

                if (samePredictionCount >= minPredictionCount) {
                    handlePrediction(finalPrediction); // 예측된 알파벳을 텍스트 입력란에 추가 또는 기능 실행
                    samePredictionCount = 0; // Reset count after updating result
                }
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    function handlePrediction(prediction) {
        const textInput = document.getElementById('text-input');
        if (prediction === 'space') {
            textInput.value += ' ';
        } else if (prediction === 'del') {
            textInput.value = textInput.value.slice(0, -1);
        } else {
            textInput.value += prediction;
        }
    }

    window.setMode = function(mode) {
        category = mode;
        samePredictionCount = 0;
        lastPrediction = '';
        document.getElementById('word').innerText = ''; // 현재 예측된 단어 초기화
        document.getElementById('text-input').value = ''; // 텍스트 입력란 초기화
    }
});
