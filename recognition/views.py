from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
import numpy as np
import json
import pickle
import os
from django.conf import settings
from sklearn.metrics import precision_score, recall_score, f1_score, accuracy_score
from gtts import gTTS
import tempfile

# 피클 파일 경로 설정
model_paths = {
    'alphabet': os.path.join(settings.BASE_DIR, 'model', 'alphabet_model.pkl'),
    'numbers': os.path.join(settings.BASE_DIR, 'model', 'num_model.pkl'),
    'words': os.path.join(settings.BASE_DIR, 'model', 'word_model.pkl')
}
label_encoder_paths = {
    'alphabet': os.path.join(settings.BASE_DIR, 'pkl', 'alphabet_label_encoder.pkl'),
    'numbers': os.path.join(settings.BASE_DIR, 'pkl', 'num_label_encoder.pkl'),
    'words': os.path.join(settings.BASE_DIR, 'pkl', 'word_label_encoder.pkl')
}

# 모델과 라벨 인코더 로드
models = {}
label_encoders = {}

for category in model_paths:
    with open(model_paths[category], 'rb') as file:
        models[category] = pickle.load(file)
    with open(label_encoder_paths[category], 'rb') as file:
        label_encoders[category] = pickle.load(file)

def predict(request):
    return render(request, 'recognition/predict.html')

def game(request):
    return render(request, 'recognition/game.html')

def about(request):
    return render(request, 'recognition/about.html')

def predict_sign(request):
    if request.method == 'POST':
        try:
            body_unicode = request.body.decode('utf-8')
            body = json.loads(body_unicode)
            landmarks = np.array(body['landmarks']).flatten()
            category = body['category']

            # 랜드마크 데이터의 길이 확인
            if len(landmarks) != 63:
                return JsonResponse({'error': 'Invalid number of landmarks'}, status=400)

            # 데이터를 2차원 배열로 변환
            landmarks = landmarks.reshape(1, -1)

            # 해당 카테고리의 모델과 라벨 인코더 가져오기
            model = models[category]
            label_encoder = label_encoders[category]

            # 예측 확률 계산
            prediction_probs = model.predict_proba(landmarks)
            top_index = np.argmax(prediction_probs[0])
            top_class = label_encoder.inverse_transform([top_index])[0]
            top_prob = prediction_probs[0][top_index]

            # 예측 신뢰도 임계값 설정
            threshold = 0.4
            final_prediction = top_class if top_prob > threshold else 'Try Again'

            # 결과 반환
            return JsonResponse({
                'predicted_label': str(top_class),
                'probability': float(top_prob),
                'final_prediction': str(final_prediction)
            })
        except Exception as e:
            import traceback
            error_message = traceback.format_exc()
            print(f"Error during prediction: {error_message}")
            return JsonResponse({'error': 'Prediction error', 'details': error_message}, status=500)
    
    return JsonResponse({'error': 'Invalid request'}, status=400)

def get_word_labels(request):
    word_labels = list(label_encoders['words'].classes_)
    return JsonResponse({'words': word_labels})

def get_alphabet_labels(request):
    alphabet_labels = list(label_encoders['alphabet'].classes_)
    return JsonResponse({'alphabet': alphabet_labels})

def get_number_labels(request):
    try:
        number_labels = label_encoders['numbers'].classes_
        number_labels = [str(label) for label in number_labels]  # Convert numpy int64 to Python str
        return JsonResponse({'numbers': number_labels})
    except Exception as e:
        import traceback
        error_message = traceback.format_exc()
        return JsonResponse({'error': 'Error fetching number labels', 'details': error_message}, status=500)

def speak(request):
    if request.method == 'POST':
        try:
            body_unicode = request.body.decode('utf-8')
            body = json.loads(body_unicode)
            text = body['text']

            tts = gTTS(text=text, lang='en')
            temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.mp3')
            tts.save(temp_file.name)
            temp_file.close()

            with open(temp_file.name, "rb") as f:
                audio_content = f.read()

            response = HttpResponse(audio_content, content_type='audio/mpeg')
            response['Content-Disposition'] = 'attachment; filename="speech.mp3"'

            os.unlink(temp_file.name)  # 임시 파일 삭제

            return response

        except Exception as e:
            import traceback
            error_message = traceback.format_exc()
            print(f"Error during TTS: {error_message}")
            return JsonResponse({'error': 'TTS error', 'details': error_message}, status=500)
    
    return JsonResponse({'error': 'Invalid request'}, status=400)