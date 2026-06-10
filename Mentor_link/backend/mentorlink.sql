-- ==========================================
-- Base de données pour IFRI MentorLink
-- Version MySQL / MariaDB
-- ==========================================

-- Supprimer les tables si elles existent (ordre inverse pour éviter erreurs FK)
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS notifications_notification;
DROP TABLE IF EXISTS chat_message;
DROP TABLE IF EXISTS chat_conversation_participants;
DROP TABLE IF EXISTS chat_conversation;
DROP TABLE IF EXISTS mentoring_match;
DROP TABLE IF EXISTS mentoring_annonce;
DROP TABLE IF EXISTS mentoring_disponibilite;
DROP TABLE IF EXISTS mentoring_matiere;
DROP TABLE IF EXISTS accounts_user_groups;
DROP TABLE IF EXISTS accounts_user_user_permissions;
DROP TABLE IF EXISTS accounts_user_faiblesses;
DROP TABLE IF EXISTS accounts_user_forces;
DROP TABLE IF EXISTS accounts_user_disponibilites;
DROP TABLE IF EXISTS accounts_user;
DROP TABLE IF EXISTS accounts_niveau;
DROP TABLE IF EXISTS accounts_filiere;
DROP TABLE IF EXISTS django_migrations;
DROP TABLE IF EXISTS django_content_type;
DROP TABLE IF EXISTS auth_permission;
DROP TABLE IF EXISTS auth_group_permissions;
DROP TABLE IF EXISTS auth_group;
DROP TABLE IF EXISTS django_session;
DROP TABLE IF EXISTS django_admin_log;

SET FOREIGN_KEY_CHECKS = 1;

-- ==========================================
-- Tables de base (référentiels)
-- ==========================================

CREATE TABLE accounts_filiere (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(30) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE accounts_niveau (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(20) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE mentoring_matiere (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE mentoring_disponibilite (
    id INT AUTO_INCREMENT PRIMARY KEY,
    jour VARCHAR(10) NOT NULL,
    plage VARCHAR(10) NOT NULL,
    CONSTRAINT unique_jour_plage UNIQUE (jour, plage)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==========================================
-- Table utilisateur personnalisée (accounts_user)
-- ==========================================

CREATE TABLE accounts_user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    password VARCHAR(128) NOT NULL,
    last_login DATETIME NULL,
    is_superuser BOOLEAN NOT NULL DEFAULT FALSE,
    username VARCHAR(150) NOT NULL UNIQUE,
    first_name VARCHAR(150) NOT NULL DEFAULT '',
    last_name VARCHAR(150) NOT NULL DEFAULT '',
    email VARCHAR(254) NOT NULL DEFAULT '',
    is_staff BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    date_joined DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    telephone VARCHAR(20) NOT NULL DEFAULT '',
    bio TEXT NOT NULL DEFAULT '',
    avatar VARCHAR(100) DEFAULT NULL,
    filiere_id INT NULL,
    niveau_id INT NULL,
    FOREIGN KEY (filiere_id) REFERENCES accounts_filiere(id) ON DELETE SET NULL,
    FOREIGN KEY (niveau_id) REFERENCES accounts_niveau(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tables many-to-many
CREATE TABLE accounts_user_forces (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    matiere_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES accounts_user(id) ON DELETE CASCADE,
    FOREIGN KEY (matiere_id) REFERENCES mentoring_matiere(id) ON DELETE CASCADE,
    CONSTRAINT unique_user_forces UNIQUE (user_id, matiere_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE accounts_user_faiblesses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    matiere_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES accounts_user(id) ON DELETE CASCADE,
    FOREIGN KEY (matiere_id) REFERENCES mentoring_matiere(id) ON DELETE CASCADE,
    CONSTRAINT unique_user_faiblesses UNIQUE (user_id, matiere_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE accounts_user_disponibilites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    disponibilite_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES accounts_user(id) ON DELETE CASCADE,
    FOREIGN KEY (disponibilite_id) REFERENCES mentoring_disponibilite(id) ON DELETE CASCADE,
    CONSTRAINT unique_user_dispo UNIQUE (user_id, disponibilite_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==========================================
-- Annonces
-- ==========================================

CREATE TABLE mentoring_annonce (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type_annonce VARCHAR(10) NOT NULL CHECK (type_annonce IN ('offer', 'demand')),
    mode VARCHAR(10) NOT NULL DEFAULT 'online' CHECK (mode IN ('online', 'in_person')),
    description TEXT NOT NULL DEFAULT '',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actif BOOLEAN NOT NULL DEFAULT TRUE,
    auteur_id INT NOT NULL,
    matiere_id INT NOT NULL,
    disponibilite_id INT NULL,
    FOREIGN KEY (auteur_id) REFERENCES accounts_user(id) ON DELETE CASCADE,
    FOREIGN KEY (matiere_id) REFERENCES mentoring_matiere(id) ON DELETE CASCADE,
    FOREIGN KEY (disponibilite_id) REFERENCES mentoring_disponibilite(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==========================================
-- Matchs
-- ==========================================

CREATE TABLE mentoring_match (
    id INT AUTO_INCREMENT PRIMARY KEY,
    score FLOAT NOT NULL DEFAULT 0,
    date_match DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    vu BOOLEAN NOT NULL DEFAULT FALSE,
    utilisateur1_id INT NOT NULL,
    utilisateur2_id INT NOT NULL,
    FOREIGN KEY (utilisateur1_id) REFERENCES accounts_user(id) ON DELETE CASCADE,
    FOREIGN KEY (utilisateur2_id) REFERENCES accounts_user(id) ON DELETE CASCADE,
    CONSTRAINT unique_match_pair UNIQUE (utilisateur1_id, utilisateur2_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==========================================
-- Chat (conversations et messages)
-- ==========================================

CREATE TABLE chat_conversation (
    id INT AUTO_INCREMENT PRIMARY KEY,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE chat_conversation_participants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    conversation_id INT NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (conversation_id) REFERENCES chat_conversation(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES accounts_user(id) ON DELETE CASCADE,
    CONSTRAINT unique_conv_participant UNIQUE (conversation_id, user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE chat_message (
    id INT AUTO_INCREMENT PRIMARY KEY,
    content TEXT NOT NULL,
    timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    conversation_id INT NOT NULL,
    sender_id INT NOT NULL,
    FOREIGN KEY (conversation_id) REFERENCES chat_conversation(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES accounts_user(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==========================================
-- Notifications
-- ==========================================

CREATE TABLE notifications_notification (
    id INT AUTO_INCREMENT PRIMARY KEY,
    verb VARCHAR(50) NOT NULL,
    target_id INT,
    timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    recipient_id INT NOT NULL,
    actor_id INT NOT NULL,
    FOREIGN KEY (recipient_id) REFERENCES accounts_user(id) ON DELETE CASCADE,
    FOREIGN KEY (actor_id) REFERENCES accounts_user(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==========================================
-- Tables Django internes (pour compatibilité admin)
-- ==========================================

CREATE TABLE django_migrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    app VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,uld
    applied DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE django_content_type (
    id INT AUTO_INCREMENT PRIMARY KEY,
    app_label VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    CONSTRAINT unique_app_label_model UNIQUE (app_label, model)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE auth_permission (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    content_type_id INT NOT NULL,
    codename VARCHAR(100) NOT NULL,
    FOREIGN KEY (content_type_id) REFERENCES django_content_type(id) ON DELETE CASCADE,
    CONSTRAINT unique_permission_content_type_codename UNIQUE (content_type_id, codename)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE auth_group (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE auth_group_permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    group_id INT NOT NULL,
    permission_id INT NOT NULL,
    FOREIGN KEY (group_id) REFERENCES auth_group(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES auth_permission(id) ON DELETE CASCADE,
    CONSTRAINT unique_group_permission UNIQUE (group_id, permission_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE accounts_user_groups (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    group_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES accounts_user(id) ON DELETE CASCADE,
    FOREIGN KEY (group_id) REFERENCES auth_group(id) ON DELETE CASCADE,
    CONSTRAINT unique_user_group UNIQUE (user_id, group_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE accounts_user_user_permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    permission_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES accounts_user(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES auth_permission(id) ON DELETE CASCADE,
    CONSTRAINT unique_user_permission UNIQUE (user_id, permission_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE django_session (
    session_key VARCHAR(40) PRIMARY KEY,
    session_data TEXT NOT NULL,
    expire_date DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE django_admin_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    action_time DATETIME NOT NULL,
    object_id TEXT NULL,
    object_repr VARCHAR(200) NOT NULL,
    action_flag SMALLINT NOT NULL,
    change_message TEXT NOT NULL,
    content_type_id INT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (content_type_id) REFERENCES django_content_type(id) ON DELETE SET NULL,
    FOREIGN KEY (user_id) REFERENCES accounts_user(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==========================================
-- Index pour les performances
-- ==========================================

CREATE INDEX idx_annonce_auteur ON mentoring_annonce (auteur_id);
CREATE INDEX idx_annonce_matiere ON mentoring_annonce (matiere_id);
CREATE INDEX idx_annonce_actif ON mentoring_annonce (actif);
CREATE INDEX idx_match_utilisateur1 ON mentoring_match (utilisateur1_id);
CREATE INDEX idx_match_utilisateur2 ON mentoring_match (utilisateur2_id);
CREATE INDEX idx_match_score ON mentoring_match (score);
CREATE INDEX idx_message_conversation ON chat_message (conversation_id);
CREATE INDEX idx_message_timestamp ON chat_message (timestamp);
CREATE INDEX idx_notification_recipient ON notifications_notification (recipient_id);
CREATE INDEX idx_notification_timestamp ON notifications_notification (timestamp);

-- ==========================================
-- Insertion des données de base (référentiels)
-- ==========================================

INSERT IGNORE INTO accounts_filiere (nom) VALUES
('GL'), ('IA'), ('SI'), ('SeIOT'), ('IM');

INSERT IGNORE INTO accounts_niveau (nom) VALUES
('L1'), ('L2'), ('L3'), ('Master1'), ('Master2');

INSERT IGNORE INTO mentoring_matiere (nom) VALUES
('Logique'), ('Algèbre relationnel'), ('Algorithmique'), ('Programmation Python'),
('Architecture et réseaux'), ('Suites et séries numériques'), ('Développement web'),
('TEEO'), ('Projet intégrateur'), ('Analyse'), ('Statistiques inférentielles'),
('Equations différentielles'), ('Langage C'), ('Anglais technique'),
('Outils de base en informatique'), ('Maths'), ('C++'), ('SQL');

INSERT IGNORE INTO mentoring_disponibilite (jour, plage) VALUES
('lundi', 'matin'), ('lundi', 'soir'),
('mardi', 'matin'), ('mardi', 'soir'),
('mercredi', 'matin'), ('mercredi', 'soir'),
('jeudi', 'matin'), ('jeudi', 'soir'),
('vendredi', 'matin'), ('vendredi', 'soir'),
('samedi', 'matin'), ('samedi', 'soir'),
('dimanche', 'matin'), ('dimanche', 'soir');