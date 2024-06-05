document.addEventListener('DOMContentLoaded', function() {
    const video = document.createElement('video');
    video.setAttribute('playsinline', '');
    video.setAttribute('autoplay', '');
    video.style.display = 'none';
    document.body.appendChild(video);

    const canvas = document.getElementById('outputCanvas');
    const ctx = canvas.getContext('2d');
    const csrfToken = document.querySelector('input[name="csrfmiddlewaretoken"]').value;

    let category = 'alphabet';
    let lastPrediction = '';
    let samePredictionCount = 0;
    const minPredictionCount = 30;
    const alphabetThreshold = 0.2;
    const otherThreshold = 0.5;
    let cursorVisible = true;

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
        ctx.scale(-1, 1);
        ctx.translate(-canvas.width, 0);
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
        const xValues = landmarks.map(landmark => canvas.width - landmark.x * canvas.width);
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

            if (finalPrediction !== 'Try Again' && predictionProb > threshold) {
                document.getElementById('word').innerText = finalPrediction;

                if (finalPrediction === lastPrediction) {
                    samePredictionCount++;
                } else {
                    samePredictionCount = 0;
                    lastPrediction = finalPrediction;
                }

                if (samePredictionCount >= minPredictionCount) {
                    handlePrediction(finalPrediction);
                    samePredictionCount = 0;
                }
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    function handlePrediction(prediction) {
        const textInput = document.getElementById('text-input');
        let textValue = textInput.value.replace('│', '');
        if (prediction === 'space') {
            textValue += ' ';
        } else if (prediction === 'del') {
            textValue = textValue.slice(0, -1);
        } else {
            textValue += prediction;
        }
        textInput.value = textValue + (cursorVisible ? '│' : '');
    }

    setInterval(() => {
        const textInput = document.getElementById('text-input');
        cursorVisible = !cursorVisible;
        let textValue = textInput.value.replace('│', '');
        if (cursorVisible) {
            textInput.value = textValue + '│';
        } else {
            textInput.value = textValue;
        }
    }, 650);

    window.setMode = function(mode) {
        category = mode;
        samePredictionCount = 0;
        lastPrediction = '';
        document.getElementById('word').innerText = '';
        document.getElementById('text-input').value = '│';
        cursorVisible = true;

        document.querySelectorAll('.category-button').forEach(button => {
            button.classList.remove('active');
        });

        document.querySelector(`.category-button[onclick="setMode('${mode}')"]`).classList.add('active');
    }
});
