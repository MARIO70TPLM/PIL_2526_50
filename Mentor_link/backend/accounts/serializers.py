from rest_framework import serializers
from .models import User, Filiere, Niveau
from mentoring.models import Matiere, Disponibilite

class FiliereSerializer(serializers.ModelSerializer):
    class Meta: model = Filiere; fields = '__all__'

class NiveauSerializer(serializers.ModelSerializer):
    class Meta: model = Niveau; fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'telephone',
                  'filiere', 'niveau', 'bio', 'avatar', 'forces', 'faiblesses', 'disponibilites']
        read_only_fields = ['id']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'telephone',
                  'filiere', 'niveau', 'password', 'confirm_password']

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError("Les mots de passe ne correspondent pas")
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        user = User.objects.create_user(**validated_data)
        return user