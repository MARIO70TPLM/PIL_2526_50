from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import User
from .serializers import UserSerializer, RegisterSerializer
from .models import Filiere, Niveau
from .serializers import FiliereSerializer, NiveauSerializer 

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': UserSerializer(user).data
            })
        return Response({'error': 'Identifiants invalides'}, status=status.HTTP_401_UNAUTHORIZED)

class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_object(self):
        return self.request.user

class ForgotPasswordView(APIView):
    permission_classes = [permissions.AllowAny]
    def post(self, request):
        email = request.data.get('email')
        # Envoi d'email de réinitialisation (simulé)
        return Response({'message': 'Email envoyé'})

class ResetPasswordView(APIView):
    permission_classes = [permissions.AllowAny]
    def post(self, request):
        # Logique de réinitialisation
        return Response({'message': 'Mot de passe réinitialisé'})
        from .models import Filiere, Niveau
from .serializers import FiliereSerializer, NiveauSerializer

class FiliereList(generics.ListAPIView):
    queryset = Filiere.objects.all()
    serializer_class = FiliereSerializer
    permission_classes = [permissions.AllowAny]

class NiveauList(generics.ListAPIView):
    queryset = Niveau.objects.all()
    serializer_class = NiveauSerializer
    permission_classes = [permissions.AllowAny]
    