from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('predict/', views.predict_sign, name='predict_sign'),
    path('get_word_labels/', views.get_word_labels, name='get_word_labels'),
    path('get_alphabet_labels/', views.get_alphabet_labels, name='get_alphabet_labels'),
    path('get_number_labels/', views.get_number_labels, name='get_number_labels'),
    path('game/', views.game, name='game'),
    path('about/', views.about, name='about'),
]
