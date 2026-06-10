from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator

class Filiere(models.Model):
    nom = models.CharField(max_length=30, unique=True)  # GL, IA, SI, SeIOT, IM
    def __str__(self): return self.nom

class Niveau(models.Model):
    nom = models.CharField(max_length=20, unique=True)  # L1, L2, L3, M1, M2
    def __str__(self): return self.nom

class User(AbstractUser):
    # Champs existants dans ton frontend
    telephone = models.CharField(max_length=20, blank=True, validators=[RegexValidator(r'^\+?[0-9 ]+$')])
    filiere = models.ForeignKey(Filiere, on_delete=models.SET_NULL, null=True)
    niveau = models.ForeignKey(Niveau, on_delete=models.SET_NULL, null=True)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    bio = models.TextField(blank=True, max_length=500)

    # Pour le matching
    forces = models.ManyToManyField('mentoring.Matiere', related_name='mentors', blank=True)
    faiblesses = models.ManyToManyField('mentoring.Matiere', related_name='mentored', blank=True)
    disponibilites = models.ManyToManyField('mentoring.Disponibilite', blank=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}" if self.first_name else self.username