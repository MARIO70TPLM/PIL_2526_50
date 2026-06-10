from django.contrib import admin
from .models import User, Filiere, Niveau

admin.site.register(User)
admin.site.register(Filiere)
admin.site.register(Niveau)