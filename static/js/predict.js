document.addEventListener('DOMContentLoaded', function() {
    // 팝업 관련 코드
    const infoButton = document.getElementById('info-button');
    const popup = document.getElementById('popup');
    const closeButton = popup.querySelector('.close-button');
    const videoContainer = document.getElementById('video-container');
    const popupTitle = document.getElementById('popup-title');

    let currentMode = 'default'; // 현재 모드 초기값

    infoButton.addEventListener('click', () => {
        loadVideos(currentMode);
        popup.classList.add('show');
    });

    closeButton.addEventListener('click', () => {
        popup.classList.remove('show');
    });

    window.addEventListener('click', (event) => {
        if (event.target === popup) {
            popup.classList.remove('show');
        }
    });

    function loadVideos(mode) {
        videoContainer.innerHTML = ''; // 이전 비디오 제거
        let videos = [];

        if (mode === 'alphabet') {
            popupTitle.innerText = 'Alphabet Mode Videos';
            videos = [
                {url : "https://www.youtube.com/embed/bsYLoba2CV0?si=K0tqvWbAm2FSxEfX", description: '< A >'},
                {url : "https://www.youtube.com/embed/3A4pdSEmuTE?si=q6Usk4cysEcXUDOc", description: '< B >'},
                {url : "https://www.youtube.com/embed/dJqoBH9NDOI?si=R8RLX-eN1JTxsZFg", description: '< C >'},
                {url : "https://www.youtube.com/embed/unaicv88lLI?si=GC5w27PRH_-Rezax", description: '< D >'},
                {url : "https://www.youtube.com/embed/DuqblObUlxk?si=lXzrKQvyjkdpJ11s", description: '< E >'},
                {url : "https://www.youtube.com/embed/SadgQ0mvY50?si=ChPnfHvNMpR8SDnt", description: '< F >'},
                {url : "https://www.youtube.com/embed/UM8feCdEh2k?si=K5yTGv9C1GpGqdMm", description: '< G >'},
                {url : "https://www.youtube.com/embed/gz6Ux2SWVTc?si=EhNFqm2Zp1n9ONVB", description: '< H >'},
                {url : "https://www.youtube.com/embed/Hyfqjm3fFNk?si=KyitvD1JZL1VpxPZ", description: '< I >'},
                {url : "https://www.youtube.com/embed/uvqNhKdoUw0?si=mrpEybYyeAsg2vg2", description: '< J >'},
                {url : "https://www.youtube.com/embed/9KP2yPZTZ5o?si=p5VkTF_LbKmi6xSN", description: '< K >'},
                {url : "https://www.youtube.com/embed/PUVdWVNCZTk?si=ou5iCaeztHIadJjo", description: '< L >'},
                {url : "https://www.youtube.com/embed/rrTRRfUzlB0?si=PcEuiBD3H025F1gK", description: '< M >'},
                {url : "https://www.youtube.com/embed/fF5_b0dhTS4?si=6INBhxP3KlhKEB82", description: '< N >'},
                {url : "https://www.youtube.com/embed/lvl-UxT0oOM?si=5e0iD9d15ug2OOvL", description: '< O >'},
                {url : "https://www.youtube.com/embed/9dlrwu_9qk8?si=gGN2W0AZeuc96oqp", description: '< P >'},
                {url : "https://www.youtube.com/embed/asa1mwMzuN8?si=QMQR-V1PZImP09hx", description: '< Q >'},
                {url : "https://www.youtube.com/embed/S9Wsq66A9xI?si=00cRnuTrcu-igZ25", description: '< R >'},
                {url : "https://www.youtube.com/embed/sABdqaGImmw?si=7IRXK9VZN8Cw6sOw", description: '< S >'},
                {url : "https://www.youtube.com/embed/Z4RUlAm5EWA?si=skfY-505zZw9zAIK", description: '< T >'},
                {url : "https://www.youtube.com/embed/TMk2OJAmOmE?si=E1xKQQr21Z1f9yCZ", description: '< U >'},
                {url : "https://www.youtube.com/embed/0mjIJ_Maf34?si=uvZtXFgkOlaP8N0Y", description: '< V >'},
                {url : "https://www.youtube.com/embed/qd5icmqdALI?si=7hmcPg4e_Qznl--k", description: '< W >'},
                {url : "https://www.youtube.com/embed/vdL-hKuSwTs?si=I14NOFH_gD9Gt7nJ", description: '< X >'},
                {url : "https://www.youtube.com/embed/t689H0-w-Ww?si=puy4bKHvf6uoPDLO", description: '< Y >'},
                {url : "https://www.youtube.com/embed/0BlkX6MWByw?si=-pW0I9WPe9RoV-3T", description: '< Z >'}
            ];
        } else if (mode === 'numbers') {
            popupTitle.innerText = 'Numbers Mode Videos';
            videos = [
                {url: "https://www.youtube.com/embed/m_4rbJcuXLo?si=cUax1otFpywxHwzw", description: '< 0 >'},
                {url: "https://www.youtube.com/embed/8K4yWpiVJPk?si=kPzIQ9H64XYOahZU", description: '< 1 >'},
                {url: "https://www.youtube.com/embed/fQppTpwisZQ?si=iiKBTte57AydG6lY", description: '< 2 >'},
                {url: "https://www.youtube.com/embed/J58DGrShwuY?si=WAy_PeU3pDoDGOU-", description: '< 3 >'},
                {url: "https://www.youtube.com/embed/txpKOXcmwn0?si=8AG7MACPSXB8QEJn", description: '< 4 >'},
                {url: "https://www.youtube.com/embed/U8SpX0zlFpE?si=s-wvF_0RMrnuzyzu", description: '< 5 >'},
                {url: "https://www.youtube.com/embed/RsAsBv6I5T8?si=r84MYxUbeNbovFpf", description: '< 6 >'},
                {url: "https://www.youtube.com/embed/nnnTYk1UlS4?si=5aAGuWTWiSUfUN2L", description: '< 7 >'},
                {url: "https://www.youtube.com/embed/u40PBl5xRTQ?si=nqp3nfCZrjPkzstQ", description: '< 8 >'},
                {url: "https://www.youtube.com/embed/fB1UgWDghow?si=uUJ-fU5cpmoGdwj8", description: '< 9 >'}
            ];
        } else if (mode === 'words') {
            popupTitle.innerText = 'Words Mode Videos';
            videos = [
                {url: "https://www.youtube.com/embed//rhfJGeMDMzQ", description: '< Hello >'},
                {url: "https://www.youtube.com/embed/Zp2k29lkqkg?si=ChjV4XnLyF4jX93U", description: '< I love you >'},
                {url: "https://www.youtube.com/embed/0usayvOXzHo?si=YPKbenybmSHIy1PT", description: '< Yes >'},
                {url: "https://www.youtube.com/embed/QJXKaOSyl4o?si=7w0fGulGyWINA4Ip", description: '< No >'},
                {url: "https://www.youtube.com/embed/-hUjwyVQdbo?si=RAeWU_8I03hwtQYi", description: '< Korea >'},
                {url: "https://www.youtube.com/embed/H6CQg4zRmlA?si=B1LGeD1qomTha5St", description: '< Cry >'},
                {url: "https://www.youtube.com/embed/Na4qNZR3RWA?si=osODZb_CZXMwaOhK", description: '< Perfect >'},
                {url: "https://www.youtube.com/embed/K0yp2v6Atxs?si=Qz1LUGqn32gBeCTP", description: '< Why >'},
                {url: "https://www.youtube.com/embed/B36qDOOtm20?si=6pKGblxuV-DXCjDB", description: '< walk >'}
            ];
        } else {
            popupTitle.innerText = 'How to Use';
            videoContainer.innerHTML = `
                <div class="usage-step">
                    <h3>웹캠 구도 설정</h3>
                    <p>손의 모양을 명확하게 인식할 수 있도록 웹캠이 올바르게 위치되어 있는지 확인하세요.</p>
                </div>
                <div class="usage-step">
                    <h3>웹캠 엑세스 허용</h3>
                    <p>메시지가 표시되면 웹사이트에서 웹캠에 액세스하여 손 인식 프로세스를 시작할 수 있도록 허용하세요.</p>
                </div>
                <div class="usage-step">
                    <h3>모드 설정</h3>
                    <p>알파벳, 숫자, 단어 모드 중 무엇을 표현하고 싶은지 선택하세요.</p>
                </div>
                <div class="usage-step">
                    <h3>수어 시작</h3>
                    <p>웹캠 앞에서 손으로 신호를 만들기 시작하세요. 우리 시스템은 MediaPipe 기술을 사용하여 귀하의 표지판을 감지하고 해석합니다.</p>
                </div>
                <div class="usage-step">
                    <h3>보내기 요청</h3>
                    <p>실시간으로 피드백된 내용을 확인하고 보내기를 누르시면 음성으로 반환됩니다.</p>
                </div>
            `;
            return; // 아래 코드는 실행하지 않도록
        }

        videos.forEach(video => {
            const videoWrapper = document.createElement('div');
            videoWrapper.classList.add('video-wrapper');
            
            const iframe = document.createElement('iframe');
            iframe.src = video.url;
            iframe.frameBorder = '0';
            iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
            iframe.allowFullscreen = true;
            
            const description = document.createElement('p');
            description.innerText = video.description;
            description.classList.add('video-description');

            videoWrapper.appendChild(iframe);
            videoWrapper.appendChild(description);

            videoContainer.appendChild(videoWrapper);
        });
    }

    // Mediapipe 및 예측 관련 코드
    const video = document.createElement('video');
    video.setAttribute('playsinline', '');
    video.setAttribute('autoplay', '');
    video.style.display = 'none';
    document.body.appendChild(video);

    const canvas = document.getElementById('outputCanvas');
    const ctx = canvas.getContext('2d');
    const csrfToken = document.querySelector('input[name="csrfmiddlewaretoken"]').value;

    let category = 'words'; // 기본 카테고리 설정
    let lastPrediction = '';
    let samePredictionCount = 0;
    const minPredictionCount = 30; // 같은 단어로 인식된 최소 횟수
    const alphabetThreshold = 0.2; // 알파벳 임계값
    const otherThreshold = 0.5; // 다른 카테고리 임계값
    let cursorVisible = true; // 커서 가시성 상태

    // Mediapipe 설정
    const hands = new Hands({locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
    }});
    hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.3,
        minTrackingConfidence: 0.3
    });

    // 장치 감지
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    // 카메라 설정
    const camera = new Camera(video, {
        onFrame: async () => {
            await hands.send({image: video});
            drawVideoAndResults();
        },
        width: isMobile ? 360 : 640,  // 모바일일 경우 해상도를 낮춤
        height: isMobile ? 480 : 480
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
    
        const padding = 20; // 원하는 크기만큼 박스 영역을 늘림
    
        ctx.beginPath();
        ctx.rect(minX - padding, minY - padding, (maxX - minX) + 2 * padding, (maxY - minY) + 2 * padding);
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = '#ff6347'; // 박스 색깔을 '#ff6347'로 변경
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
        let textValue = textInput.value.replace('│', ''); // 기존 커서 제거
        if (prediction === 'space') {
            textValue += ' ';
        } else if (prediction === 'del') {
            textValue = textValue.slice(0, -1);
        } else {
            textValue += prediction;
        }
        textInput.value = textValue + (cursorVisible ? '│' : ''); // 새로운 커서 추가
    }

    // 커서 깜박임 설정
    setInterval(() => {
        const textInput = document.getElementById('text-input');
        cursorVisible = !cursorVisible;
        let textValue = textInput.value.replace('│', '');
        if (cursorVisible) {
            textInput.value = textValue + '│';
        } else {
            textInput.value = textValue;
        }
    }, 650); // 650ms 간격

    window.setMode = function(mode) {
        category = mode;
        samePredictionCount = 0;
        lastPrediction = '';
        document.getElementById('word').innerText = ''; // 현재 예측된 단어 초기화
        currentMode = mode; // 현재 모드를 업데이트

        // 모든 버튼의 활성 상태 해제
        document.querySelectorAll('.category-button').forEach(button => {
            button.classList.remove('active');
        });

        // 현재 모드 버튼에 활성 상태 추가
        document.querySelector(`.category-button[onclick="setMode('${mode}')"]`).classList.add('active');

        // 모드 변경 시 팝업 콘텐츠 스크롤 초기화
        document.querySelector('.popup-content').scrollTop = 0;

        // 모드 변경 시 비디오 컨테이너 업데이트
        loadVideos(currentMode);
    }

    window.playAudio = function(text) {
        fetch('/recognition/speak/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken
            },
            body: JSON.stringify({ text: text })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.blob();
        })
        .then(blob => {
            const url = URL.createObjectURL(blob);
            const audio = new Audio(url);
            audio.play();
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    document.getElementById('speak-button').addEventListener('click', () => {
        const text = document.getElementById('text-input').value.replace('│', '');
        playAudio(text);
    });

    document.getElementById('clear-button').addEventListener('click', () => {
        document.getElementById('text-input').value = ''; // 텍스트 박스를 비움
    });
});
