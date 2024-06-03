from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('',include('index.urls')),
    path('recognition/', include('recognition.urls')),  # recognition 앱의 urls.py 포함
]
