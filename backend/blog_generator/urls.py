from django.urls import path
from . import views

urlpatterns = [
    path('api/create', views.create, name='create'),
    path('api/login', views.user_login, name='user_login'),
    path('api/signup', views.user_signup, name='user_signup'),
]