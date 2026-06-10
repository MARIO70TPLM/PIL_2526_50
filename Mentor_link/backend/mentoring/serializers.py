from rest_framework import serializers
from .models import Matiere, Disponibilite, Annonce, Match
from accounts.serializers import UserSerializer

class MatiereSerializer(serializers.ModelSerializer):
    class Meta: model = Matiere; fields = '__all__'

class DisponibiliteSerializer(serializers.ModelSerializer):
    class Meta: model = Disponibilite; fields = '__all__'

class AnnonceSerializer(serializers.ModelSerializer):
    auteur_detail = UserSerializer(source='auteur', read_only=True)
    class Meta:
        model = Annonce
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'auteur']

class MatchSerializer(serializers.ModelSerializer):
    utilisateur1_detail = UserSerializer(source='utilisateur1', read_only=True)
    utilisateur2_detail = UserSerializer(source='utilisateur2', read_only=True)
    class Meta: model = Match; fields = '__all__'