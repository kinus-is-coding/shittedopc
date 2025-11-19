from django.urls import path,include
from . import views
from rest_framework.routers import DefaultRouter
from .views import RegisterView, NoteViewSet,MyTokenObtainPairView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
router = DefaultRouter()
router.register(r"notes", views.NoteViewSet, basename='note')
urlpatterns=[




    path('register/', RegisterView.as_view(), name='register'),
    path('login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
urlpatterns+=router.urls