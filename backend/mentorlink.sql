-- MODULE 1 : PROFIL UTILISATEUR

CREATE TABLE Utilisateur (
    id_utilisateur        INT AUTO_INCREMENT PRIMARY KEY,
    nom_utilisateur       VARCHAR(100) NOT NULL,
    prenom_utilisateur    VARCHAR(100) NOT NULL,
    email_utilisateur     VARCHAR(100) NOT NULL,
    mot_de_passe_utilisateur VARCHAR(255) NOT NULL,
    filliere_utilisateur  ENUM('SI', 'GL', 'SeIOT', 'IM', 'IA'),
    niveau_utilisateur    ENUM('L1', 'L2', 'L3', 'Master1', 'Master2'),
    bio_utilisateur       VARCHAR(500),
    photo_utilisateur     VARCHAR(255),
    telephone_utilisateur VARCHAR(20) NOT NULL
);

-- MODULE 2 : OFFRES ET CARACTERISTIQUES

CREATE TABLE Offre (
    id_offre      INT AUTO_INCREMENT PRIMARY KEY,
    type_offre    ENUM('DEMANDE_MENTORAT', 'OFFRE_MENTORAT'),
    id_utilisateur INT,
    FOREIGN KEY (id_utilisateur) REFERENCES Utilisateur(id_utilisateur)
);

CREATE TABLE Matiere (
    id_matiere  INT AUTO_INCREMENT PRIMARY KEY,
    nom_matiere VARCHAR(100) NOT NULL
);

CREATE TABLE Disponibilite (
    id_disponibilite INT AUTO_INCREMENT PRIMARY KEY,
    jour  ENUM('lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'),
    plage ENUM('matin', 'midi', 'apres-midi')
);

CREATE TABLE Format (
    id_format  INT AUTO_INCREMENT PRIMARY KEY,
    nom_format ENUM('en_ligne', 'presentiel')
);

-- TABLES DE LIAISON 

CREATE TABLE Offre_Matiere (
    id_offre   INT,
    id_matiere INT,
    FOREIGN KEY (id_offre)   REFERENCES Offre(id_offre),
    FOREIGN KEY (id_matiere) REFERENCES Matiere(id_matiere)
);

CREATE TABLE Offre_Disponibilite (
    id_offre         INT,
    id_disponibilite INT,
    FOREIGN KEY (id_offre)         REFERENCES Offre(id_offre),
    FOREIGN KEY (id_disponibilite) REFERENCES Disponibilite(id_disponibilite)
);

CREATE TABLE Offre_Format (
    id_offre  INT,
    id_format INT,
    FOREIGN KEY (id_offre)  REFERENCES Offre(id_offre),
    FOREIGN KEY (id_format) REFERENCES Format(id_format)
);

-- MODULE 3 : MATCHING

CREATE TABLE Score_matching (
    id_score_matching INT AUTO_INCREMENT PRIMARY KEY,
    score             INT,
    id_offre_mentor   INT,
    id_offre_mentore  INT,
    FOREIGN KEY (id_offre_mentor)  REFERENCES Offre(id_offre),
    FOREIGN KEY (id_offre_mentore) REFERENCES Offre(id_offre)
);

-- MODULE 4 : MESSAGERIE


CREATE TABLE Conversation (
    id_conversation            INT AUTO_INCREMENT PRIMARY KEY,
    date_creation_conversation DATETIME NOT NULL,
    id_utilisateur_1           INT,
    id_utilisateur_2           INT,
    FOREIGN KEY (id_utilisateur_1) REFERENCES Utilisateur(id_utilisateur),
    FOREIGN KEY (id_utilisateur_2) REFERENCES Utilisateur(id_utilisateur)
);

CREATE TABLE Message (
    id_message      INT AUTO_INCREMENT PRIMARY KEY,
    contenu_message TEXT,
    date_message    DATETIME NOT NULL,
    id_conversation INT,
    id_utilisateur  INT,
    FOREIGN KEY (id_conversation) REFERENCES Conversation(id_conversation),
    FOREIGN KEY (id_utilisateur)  REFERENCES Utilisateur(id_utilisateur)
);