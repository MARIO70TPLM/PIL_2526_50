def calculate_match_score(user1, user2):
    score = 0
    # Forces de l'un = faiblesses de l'autre
    common = set(user1.forces.all()) & set(user2.faiblesses.all())
    score += len(common) * 20
    common2 = set(user2.forces.all()) & set(user1.faiblesses.all())
    score += len(common2) * 20
    # Disponibilités communes
    dispo_communes = set(user1.disponibilites.all()) & set(user2.disponibilites.all())
    score += len(dispo_communes) * 10
    # Même filière / niveau ?
    if user1.filiere == user2.filiere: score += 10
    if user1.niveau == user2.niveau: score += 5
    return min(score, 100)