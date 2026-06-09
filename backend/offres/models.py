from django.db import models
from django.contrib.auth.models import User

class Matiere(models.Model):
    nom = models.CharField(max_length=100)

    class Meta:
        db_table = 'Matiere'

    def __str__(self):
        return self.nom

class Disponibilite(models.Model):
    jour = models.CharField(max_length=20)
    plage = models.CharField(max_length=50)

    class Meta:
        db_table = 'Disponibilite'

    def __str__(self):
        return f"{self.jour} - {self.plage}"

class Format(models.Model):
    nom = models.CharField(max_length=50)

    class Meta:
        db_table = 'Format'

    def __str__(self):
        return self.nom

class Offre(models.Model):
    TYPE_CHOICES = [
        ('mentor', 'Mentor'),
        ('mentore', 'Mentoré'),
    ]
    id_utilisateur = models.ForeignKey(User, on_delete=models.CASCADE, db_column='id_utilisateur')
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    matieres = models.ManyToManyField(Matiere, through='Offre_Matiere')
    disponibilites = models.ManyToManyField(Disponibilite, through='Offre_Disponibilite')
    formats = models.ManyToManyField(Format, through='Offre_Format')

    class Meta:
        db_table = 'Offre'

    def __str__(self):
        return f"{self.id_utilisateur} - {self.type}"

class Offre_Matiere(models.Model):
    id_offre = models.ForeignKey(Offre, on_delete=models.CASCADE, db_column='id_offre')
    id_matiere = models.ForeignKey(Matiere, on_delete=models.CASCADE, db_column='id_matiere')

    class Meta:
        db_table = 'Offre_Matiere'

class Offre_Disponibilite(models.Model):
    id_offre = models.ForeignKey(Offre, on_delete=models.CASCADE, db_column='id_offre')
    id_disponibilite = models.ForeignKey(Disponibilite, on_delete=models.CASCADE, db_column='id_disponibilite')

    class Meta:
        db_table = 'Offre_Disponibilite'

class Offre_Format(models.Model):
    id_offre = models.ForeignKey(Offre, on_delete=models.CASCADE, db_column='id_offre')
    id_format = models.ForeignKey(Format, on_delete=models.CASCADE, db_column='id_format')

    class Meta:
        db_table = 'Offre_Format'