from django.db import models
from accounts.models import User

class Matiere(models.Model):
    nom = models.CharField(max_length=100, unique=True)
    def __str__(self): return self.nom

class Disponibilite(models.Model):
    JOURS = [('lundi','Lundi'),('mardi','Mardi'),('mercredi','Mercredi'),('jeudi','Jeudi'),('vendredi','Vendredi'),('samedi','Samedi'),('dimanche','Dimanche')]
    PLAGES = [('matin','Matin (8h-12h)'),('soir','Soir (17h-21h)')]
    jour = models.CharField(max_length=10, choices=JOURS)
    plage = models.CharField(max_length=10, choices=PLAGES)
    class Meta: unique_together = ('jour','plage')
    def __str__(self): return f"{self.get_jour_display()} - {self.get_plage_display()}"

class Annonce(models.Model):
    TYPE_CHOICES = [('offer','Offre de mentorat'),('demand','Demande d’aide')]
    MODE_CHOICES = [('online','En ligne'),('in_person','Présentiel')]
    auteur = models.ForeignKey(User, on_delete=models.CASCADE, related_name='annonces')
    type_annonce = models.CharField(max_length=10, choices=TYPE_CHOICES)
    matiere = models.ForeignKey(Matiere, on_delete=models.CASCADE)
    mode = models.CharField(max_length=10, choices=MODE_CHOICES, default='online')
    disponibilite = models.ForeignKey(Disponibilite, on_delete=models.SET_NULL, null=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    actif = models.BooleanField(default=True)

class Match(models.Model):
    utilisateur1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='matches1')
    utilisateur2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='matches2')
    score = models.FloatField(default=0)
    date_match = models.DateTimeField(auto_now_add=True)
    vu = models.BooleanField(default=False)