from django.urls import path
from .views import *


app_name = 'accounts'

urlpatterns = [
    path('login', auth, name='sign_in'),
    path('join', auth, name='sign_up'),
    path('reset', reset_pass, name='reset_pass'),
    path('reset-password', change_pass, name='change_pass'),
]