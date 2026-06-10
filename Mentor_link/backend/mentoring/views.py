from rest_framework import generics, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Matiere, Disponibilite, Annonce, Match
from .serializers import MatiereSerializer, DisponibiliteSerializer, AnnonceSerializer, MatchSerializer
from .matching_engine import calculate_match_score

class MatiereList(generics.ListAPIView):
    queryset = Matiere.objects.all()
    serializer_class = MatiereSerializer
    permission_classes = [permissions.AllowAny]

class DisponibiliteList(generics.ListAPIView):
    queryset = Disponibilite.objects.all()
    serializer_class = DisponibiliteSerializer
    permission_classes = [permissions.AllowAny]

class AnnonceListCreate(generics.ListCreateAPIView):
    serializer_class = AnnonceSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['type_annonce', 'matiere', 'mode']
    search_fields = ['description']

    def get_queryset(self):
        return Annonce.objects.filter(actif=True)

    def perform_create(self, serializer):
        serializer.save(auteur=self.request.user)

class AnnonceDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Annonce.objects.all()
    serializer_class = AnnonceSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_destroy(self, instance):
        instance.actif = False
        instance.save()

class MatchList(generics.ListAPIView):
    serializer_class = MatchSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Match.objects.filter(utilisateur1=self.request.user) | Match.objects.filter(utilisateur2=self.request.user)

class ComputeMatchesView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request):
        # Calcul des matchs pour l'utilisateur courant
        from accounts.models import User
        users = User.objects.exclude(id=request.user.id)
        for other in users:
            score = calculate_match_score(request.user, other)
            if score > 30:  # seuil
                Match.objects.get_or_create(utilisateur1=request.user, utilisateur2=other, defaults={'score': score})
        return Response({'status': 'matchs calculés'})