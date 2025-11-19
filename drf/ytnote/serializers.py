from rest_framework import serializers
from .models import Note,User



from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod

    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        # ...

        return token

class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'password')

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)
class NoteSerializer(serializers.ModelSerializer):
   class Meta:
        model = Note
        fields = ["id", "title", "body", "slug", "category", "created", "updated"]
        read_only_fields = ["slug", "created", "updated"]