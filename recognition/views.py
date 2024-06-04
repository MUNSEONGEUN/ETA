from django.shortcuts import render
from django.http import JsonResponse
import numpy as np
import json
import pickle
import os
from django.conf import settings
from sklearn.metrics import precision_score, recall_score, f1_score, accuracy_score

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

def index(request):
    return render(request, 'recognition/index.html')

def game(request):
    return render(request, 'recognition/game.html')

def calculate_scores(y_true, y_pred):
    precision = precision_score(y_true, y_pred, average='weighted', zero_division=1)
    recall = recall_score(y_true, y_pred, average='weighted', zero_division=1)
    f1 = f1_score(y_true, y_pred, average='weighted', zero_division=1)
    accuracy = accuracy_score(y_true, y_pred)
    return precision, recall, f1, accuracy

def predict_sign(request):
    if request.method == 'POST':
        try:
            body_unicode = request.body.decode('utf-8')
            body = json.loads(body_unicode)
            landmarks = np.array(body['landmarks']).flatten()
            category = body['category']

            if len(landmarks) == 126:
                landmarks = landmarks[:63]
            elif len(landmarks) != 63:
                return JsonResponse({'error': 'Invalid number of landmarks'}, status=400)

            landmarks = landmarks.reshape(1, -1)

            model = models[category]
            label_encoder = label_encoders[category]

            prediction_probs = model.predict_proba(landmarks)
            top_indices = np.argsort(prediction_probs[0])[-2:][::-1]
            top_classes = label_encoder.inverse_transform(top_indices)
            top_probs = prediction_probs[0][top_indices]

            predicted_label = label_encoder.inverse_transform([model.predict(landmarks)[0]])[0]

            weights = {'precision': 0.25, 'recall': 0.25, 'f1': 0.25, 'accuracy': 0.25}

            y_true = [predicted_label]
            y_pred = [predicted_label]

            precision, recall, f1, accuracy = calculate_scores(y_true, y_pred)
            combined_score = (weights['precision'] * precision + 
                              weights['recall'] * recall + 
                              weights['f1'] * f1 + 
                              weights['accuracy'] * accuracy)

            final_prediction = predicted_label if combined_score > 0.5 else 'Uncertain'

            return JsonResponse({
                'classes': [str(cls) for cls in top_classes],
                'probabilities': [float(prob) for prob in top_probs],
                'predicted_label': str(predicted_label),
                'combined_score': float(combined_score),
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
        number_labels = [int(label) for label in number_labels]  # Convert numpy int64 to Python int
        return JsonResponse({'numbers': number_labels})
    except Exception as e:
        import traceback
        error_message = traceback.format_exc()
        return JsonResponse({'error': 'Error fetching number labels', 'details': error_message}, status=500)
    