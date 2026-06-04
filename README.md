# 🎓 IFRI_MentorLink
Introduction

IFRI_MentorLink est une plateforme de mentorat académique et professionnel développée dans le cadre du **Projet Intégrateur 2025-2026** de l'IFRI. Elle permet aux étudiants de toutes filières (IA, GL, SI, SE&IoT, IM) de se connecter entre eux : ceux qui maîtrisent une matière peuvent proposer leur aide, et ceux qui rencontrent des difficultés peuvent trouver un mentor adapté à leur profil.L'application repose sur un **algorithme de matching** qui analyse la compatibilité des compétences, des disponibilités horaires et de la proximité des filières pour proposer automatiquement les combinaisons mentor–mentoré les plus pertinentes. Une messagerie intégrée permet ensuite d'organiser et de suivre les sessions de mentorat directement depuis la plateforme.
 🎯 Objectif du projet

L'objectif principal est de concevoir et développer une **application web client-serveur** complète qui :

- Permet à chaque étudiant de créer et gérer son **profil** (compétences, lacunes, filière, disponibilités)
- Propose un système d'**offres et demandes de mentorat** consultable et filtrable
- Applique un **algorithme de matching** pour suggérer les meilleures correspondances mentor–mentoré
- Intègre une **messagerie instantanée** pour organiser les sessions
- Respecte les bonnes pratiques de **sécurité** (authentification, hashage des mots de passe, protection des données)


 Répartition des rôles et responsabilités

| Nom & Prénom | Rôle principal | Domaine | Contact |
|---|---|---|---|
|DAHA Edouard Mariano |Chef de projet et Développeur Frontend | Internet & Multimédia (IM) | dahamariano@gmail.com |
| ADELOUI Adégoké Paul Odilon|API,Base de donnéeset Responsable technique/ |Sécurité Informatique(SI) | email@etudiant.ifri.bj |
| GAHOU Margot Coffi | Développeur Backend | Intelligence Artificielle (IA) | email@etudiant.ifri.bj |
|KOUGNANDOU Senahin Mathilde |Dévéloppeur Backend| Génie Logiciel(GL)| email@etudiant.ifri.bj |
| AGO Essename Clotilde | Développeur Frontend / Génie Logiciel(GL)| agoessename@gmail.com |
| SAIZONOU Maadjidah Gloria Modoukpe| Documentation/Tests | Sécurité Informatique(SI)|saizonougloria32@gmail.com |

## 🗂️ Structure du projet

...
#PIL1_2526_[XX]/
│
├── frontend/                  
│   ├── index.html             
│   ├── register.html         
│   ├── dashboard.html        
│   ├── matching.html        
│   ├── messagerie.html        
│   ├── offres.html            
│   ├── profil.html            
│   ├── css/
│   │   └── style.css        
│   └── js/
│       └── main.js           
│
├── backend/                 
│   ├── app.py                
│   ├── models/                
│   │   ├── user.py
│   │   ├── offre.py
│   │   └── message.py
│   ├── routes/               
│   │   ├── auth.py
│   │   ├── matching.py
│   │   ├── offres.py
│   │   └── messages.py
│   ├── utils/
│   │   └── matching_algorithm.py  
│   ├── requirements.txt      
│   └── config.py             
│
├── database/
│   └── mentorlink.sql         
│
├── rapport/
│   └── rapport.html           
│
└── README.md                 
```

---

## ⚙️ Installation et déploiement

### 1. Cloner le dépôt

```bash
git clone https://github.com/[votre-organisation]/PIL1_2526_[XX].git
cd PIL1_2526_[XX]
```

### 2. Configurer la base de données

Assurez-vous d'avoir **MySQL** ou **PostgreSQL** installé, puis importez le schéma :

```bash
# MySQL
mysql -u root -p mentorlink < database/mentorlink.sql

# PostgreSQL
psql -U postgres -d mentorlink -f database/mentorlink.sql
```

### 3. Installer les dépendances Python

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Linux / macOS
venv\Scripts\activate           # Windows

pip install -r requirements.txt
```

### 4. Configurer les variables d'environnement

Créez un fichier `.env` dans le dossier `backend/` :

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mentorlink
DB_USER=votre_utilisateur
DB_PASSWORD=votre_mot_de_passe
SECRET_KEY=une_cle_secrete_longue_et_aleatoire
DEBUG=True
```

### 5. Lancer le serveur

```bash
# Flask
python app.py

# Django
python manage.py runserver
```

### 6. Accéder à l'application

Ouvrez votre navigateur et rendez-vous sur :
```
http://localhost:5000
```

---

## 🤝 Parcours de collaboration

Le projet est géré avec **Git** et hébergé sur GitHub. Voici les conventions à respecter par tous les membres :

### Branches

```
main          → branche principale (code stable, livrable)
develop       → branche de développement intégré
feature/[nom] → branches de fonctionnalités individuelles
```

Exemple : `feature/matching-algorithm`, `feature/messagerie`, `feature/auth`

### Flux de travail

```bash
# 1. Créer une branche pour sa fonctionnalité
git checkout -b feature/ma-fonctionnalite

# 2. Travailler, puis committer régulièrement
git add .
git commit -m "feat: description courte et claire de la modification"

# 3. Pousser sur GitHub
git push origin feature/ma-fonctionnalite

# 4. Ouvrir une Pull Request vers develop
# → révision par un autre membre avant fusion
```

### Conventions de commit

| Préfixe | Usage |
|---------|-------|
| `feat:` | Ajout d'une nouvelle fonctionnalité |
| `fix:` | Correction d'un bug |
| `style:` | Modification CSS/UI sans impact logique |
| `docs:` | Mise à jour de la documentation |
| `db:` | Modification du schéma de base de données |
| `refactor:` | Amélioration du code sans nouvelle fonctionnalité |

> Chaque membre doit effectuer des commits réguliers et significatifs. L'historique Git est un critère d'évaluation.

### Accès encadrants

Les comptes GitHub suivants ont accès en lecture au dépôt :
- [@ratheilesse](https://github.com/ratheilesse)
- [@primearwyn](https://github.com/primearwyn)
- [@MaryseGAHOU](https://github.com/MaryseGAHOU)

---

## 📅 Dates importantes et durée du projet

**Durée totale du projet : 10 jours** (du 1er juin au 10 juin 2026)

| Date | Événement | Format | Responsables |
|------|-----------|--------|--------------|
| **Lun. 01 juin 2026** · 13h–17h | Lancement du projet, prise en main de Git, démarrage | Présentiel | M. ACCROMBESSI & Mme GAHOU |
| **Mer. 03 juin 2026** · 15h–17h | Bonnes pratiques de travail collaboratif | En ligne | M. HOUNDJI |
| **Jeu. 04 juin 2026** · 13h–18h | Échanges avec l'encadrement par groupe | En ligne | M. ACCROMBESSI & Mme GAHOU |
| **Lun. 08 & Mar. 09 juin 2026** · 13h–18h | Échanges avec l'encadrement par groupe | Présentiel | M. ACCROMBESSI & Mme GAHOU |
| **⚠️ Mer. 10 juin 2026** · 23h59 | **Dépôt des livrables finaux** | — | Tous les groupes |
| **Ven. 12 & Sam. 13 juin 2026** · 8h–16h | Présentation finale et évaluation | En ligne | M. ACCROMBESSI, Mme GAHOU & M. HOUNDJI |

> ❗ **Aucun projet rendu après le 10 juin 2026 à 23h59 ne sera évalué.**

---

## 📋 Livrables attendus

- [x] Dépôt GitHub nommé `PIL1_2526_[XX]` avec historique de commits de tous les membres
- [ ] `rapport/rapport.html` — rapport de projet complet en HTML
- [ ] `frontend/` — code source de l'interface web (client)
- [ ] `backend/` — code source du serveur (Python / Django ou Flask)
- [ ] `database/mentorlink.sql` — schéma complet de la base de données

---

## 🏫 Équipe pédagogique

| Rôle | Nom |
|------|-----|
| Supervision | M. Ratheil HOUNDJI |
| Encadrant | M. Armand ACCROMBESSI |
| Encadrante | Mme Maryse GAHOU |

---

*Projet Intégrateur PIL1 — IFRI / Université d'Abomey-Calavi — 2025-2026*
