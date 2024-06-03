function sendLandmarks(landmarks) {
    fetch('/predict/', {  // URL이 올바른지 확인
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

            // 단어 맞추기 확인
            checkCollision(finalPrediction);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('result').innerText = 'Prediction error';
    });
}
