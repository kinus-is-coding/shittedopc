from rest_framework import viewsets,generics,permissions
from .models import Note
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import NoteSerializer,UserRegisterSerializer,MyTokenObtainPairSerializer
class RegisterView(generics.CreateAPIView):
    serializer_class = UserRegisterSerializer
    permission_classes = [permissions.AllowAny]

class NoteViewSet(viewsets.ModelViewSet):
    
    serializer_class = NoteSerializer
    lookup_field = "slug"  # optional
    def get_queryset(self):
        # chỉ trả về note của user đang login
        return Note.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
