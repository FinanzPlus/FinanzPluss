# 🔐 Guide Administrateur - FinanzPlus Austria

## Vue d'ensemble

Ce guide est destiné aux administrateurs de la plateforme FinanzPlus Austria. Il couvre toutes les fonctionnalités d'administration, la gestion des demandes, des utilisateurs et des partenaires.

---

## 🚀 Accès Administrateur

### Se Connecter en tant qu'Admin

1. Accédez à `/login`
2. Utilisez vos identifiants administrateur
3. Vous serez redirigé vers `/admin/dashboard`

**Note** : Seuls les comptes avec le rôle `admin` peuvent accéder à l'interface d'administration.

---

## 📊 Dashboard Administrateur

### Vue d'Ensemble

Le dashboard affiche les KPIs principaux :

#### Statistiques Clés

| Métrique | Description |
|----------|-------------|
| **Demandes en attente** | Nombre de demandes à traiter |
| **Demandes ce mois** | Total des demandes du mois en cours |
| **Taux d'approbation** | Pourcentage de demandes approuvées |
| **Revenu mensuel** | Commissions du mois |

#### Graphiques

1. **Évolution des demandes** (30 derniers jours)
   - Ligne temporelle
   - Comparaison mois précédent

2. **Répartition par statut**
   - Graphique en camembert
   - En attente, Approuvées, Rejetées

3. **Top partenaires**
   - Classement par volume
   - Taux de conversion

### Actions Rapides

Boutons d'accès direct :
- ✅ **Nouvelle demande** : Créer une demande manuellement
- 📧 **Envoyer email groupé** : Communication de masse
- 📊 **Exporter rapport** : Télécharger les statistiques
- ⚙️ **Paramètres** : Configuration système

---

## 📝 Gestion des Demandes de Prêt

### Liste des Demandes

#### Filtres Disponibles

```
- Statut : Tous, En attente, En cours, Approuvée, Rejetée
- Date : Aujourd'hui, Cette semaine, Ce mois, Personnalisé
- Montant : Min - Max
- Partenaire : Tous, Erste Bank, Raiffeisen, etc.
- Recherche : Par nom, email, ID
```

#### Colonnes Affichées

| Colonne | Information |
|---------|-------------|
| ID | Identifiant unique |
| Client | Nom complet |
| Montant | Montant demandé |
| Durée | Durée en mois |
| Statut | État actuel |
| Date | Date de création |
| Actions | Boutons d'action |

### Détails d'une Demande

#### Informations Client

```
- Nom complet
- Email
- Téléphone
- Adresse complète
- Date de naissance
- Situation familiale
```

#### Informations Professionnelles

```
- Situation professionnelle
- Employeur
- Ancienneté
- Revenu mensuel net
- Autres revenus
```

#### Informations du Prêt

```
- Montant demandé
- Durée souhaitée
- Objectif du prêt
- Taux proposé
- Mensualité calculée
- Coût total
```

#### Documents Joints

Liste des documents avec :
- Type de document
- Nom du fichier
- Date d'upload
- Taille
- Actions (Voir, Télécharger, Supprimer)

### Actions sur une Demande

#### 1. Approuver une Demande

```
1. Cliquez sur "Approuver"
2. Sélectionnez le partenaire bancaire
3. Ajustez les conditions si nécessaire :
   - Taux d'intérêt
   - Montant approuvé
   - Durée
4. Ajoutez un commentaire interne
5. Confirmez l'approbation
```

**Résultat** :
- Email automatique au client
- Notification dans son dashboard
- Statut changé en "Approuvée"
- Partenaire notifié

#### 2. Rejeter une Demande

```
1. Cliquez sur "Rejeter"
2. Sélectionnez la raison :
   - Revenus insuffisants
   - Historique de crédit
   - Documents incomplets
   - Autre (préciser)
3. Ajoutez un commentaire pour le client
4. Confirmez le rejet
```

**Résultat** :
- Email automatique au client
- Notification dans son dashboard
- Statut changé en "Rejetée"
- Possibilité de nouvelle demande après 30 jours

#### 3. Demander des Documents

```
1. Cliquez sur "Demander documents"
2. Cochez les documents manquants :
   - Pièce d'identité
   - Justificatif de domicile
   - Bulletins de salaire
   - Relevés bancaires
   - Autre (préciser)
3. Ajoutez un message explicatif
4. Définissez une date limite
5. Envoyez la demande
```

**Résultat** :
- Email au client avec liste des documents
- Notification dans son dashboard
- Statut changé en "Documents requis"
- Rappel automatique si pas de réponse

#### 4. Contacter le Client

```
1. Cliquez sur "Contacter"
2. Choisissez le moyen :
   - Email
   - Téléphone (affiche le numéro)
   - WhatsApp (ouvre la conversation)
3. Rédigez votre message
4. Envoyez
```

#### 5. Assigner à un Conseiller

```
1. Cliquez sur "Assigner"
2. Sélectionnez un conseiller disponible
3. Ajoutez une note interne
4. Confirmez l'assignation
```

**Résultat** :
- Conseiller notifié
- Demande visible dans son tableau de bord
- Historique mis à jour

### Historique et Notes

#### Historique des Actions

Chaque action est enregistrée :
- Date et heure
- Utilisateur (admin/conseiller)
- Action effectuée
- Détails de l'action

#### Notes Internes

```
1. Cliquez sur "Ajouter une note"
2. Rédigez votre note (visible uniquement par l'équipe)
3. Marquez comme importante si nécessaire
4. Sauvegardez
```

**Utilité** :
- Communication interne
- Suivi du dossier
- Décisions prises
- Points à vérifier

---

## 👥 Gestion des Utilisateurs

### Liste des Utilisateurs

#### Filtres

```
- Rôle : Tous, Client, Admin, Conseiller
- Statut : Actif, Inactif, Suspendu
- Date d'inscription : Période
- Recherche : Nom, email
```

#### Informations Affichées

| Colonne | Détail |
|---------|--------|
| ID | Identifiant unique |
| Nom | Nom complet |
| Email | Adresse email |
| Rôle | Client/Admin/Conseiller |
| Statut | Actif/Inactif |
| Inscription | Date de création |
| Dernière connexion | Date et heure |
| Actions | Boutons d'action |

### Actions sur un Utilisateur

#### 1. Voir le Profil

Affiche :
- Informations personnelles
- Historique des demandes
- Documents uploadés
- Score de crédit
- Activité récente

#### 2. Modifier un Utilisateur

```
1. Cliquez sur "Modifier"
2. Modifiez les champs nécessaires :
   - Informations personnelles
   - Rôle
   - Statut
3. Sauvegardez les modifications
```

#### 3. Changer le Rôle

```
Rôles disponibles :
- Client : Accès standard
- Conseiller : Gestion des demandes
- Admin : Accès complet
```

**Attention** : Changement de rôle = changement de permissions

#### 4. Suspendre un Compte

```
1. Cliquez sur "Suspendre"
2. Indiquez la raison
3. Définissez la durée (temporaire/permanent)
4. Confirmez
```

**Résultat** :
- Utilisateur ne peut plus se connecter
- Email de notification envoyé
- Peut être réactivé à tout moment

#### 5. Supprimer un Compte

```
1. Cliquez sur "Supprimer"
2. Confirmez la suppression (action irréversible)
3. Choisissez :
   - Suppression complète (DSGVO)
   - Anonymisation des données
```

**Attention** : Action irréversible, à utiliser avec précaution

### Créer un Utilisateur Manuellement

```
1. Cliquez sur "Nouvel utilisateur"
2. Remplissez le formulaire :
   - Prénom, Nom
   - Email
   - Mot de passe temporaire
   - Rôle
3. Cochez "Envoyer email de bienvenue"
4. Créez le compte
```

---

## 🏦 Gestion des Partenaires Bancaires

### Liste des Partenaires

Informations affichées :
- Nom de la banque
- Logo
- Taux d'intérêt min/max
- Montant min/max
- Durée min/max
- Statut (Actif/Inactif)
- Nombre de demandes traitées
- Taux d'approbation

### Ajouter un Partenaire

```
1. Cliquez sur "Nouveau partenaire"
2. Remplissez les informations :
   - Nom de la banque
   - Logo (upload)
   - Description
   - Conditions :
     * Taux d'intérêt (min/max)
     * Montant (min/max)
     * Durée (min/max)
   - Contact :
     * Email
     * Téléphone
     * Adresse
3. Sauvegardez
```

### Modifier un Partenaire

```
1. Cliquez sur "Modifier"
2. Mettez à jour les informations
3. Sauvegardez les modifications
```

### Désactiver un Partenaire

```
1. Cliquez sur "Désactiver"
2. Confirmez
```

**Résultat** :
- N'apparaît plus dans les comparateurs
- Demandes en cours non affectées
- Peut être réactivé

---

## 📧 Communication

### Emails Automatiques

#### Templates Disponibles

1. **Confirmation d'inscription**
2. **Demande reçue**
3. **Documents requis**
4. **Demande approuvée**
5. **Demande rejetée**
6. **Rappel documents**
7. **Rendez-vous confirmé**
8. **Newsletter**

#### Modifier un Template

```
1. Allez dans "Paramètres" > "Templates emails"
2. Sélectionnez le template
3. Modifiez le contenu :
   - Sujet
   - Corps du message (HTML)
   - Variables disponibles : {{nom}}, {{email}}, etc.
4. Prévisualisez
5. Sauvegardez
```

### Envoyer un Email Groupé

```
1. Cliquez sur "Email groupé"
2. Sélectionnez les destinataires :
   - Tous les clients
   - Clients avec demande en cours
   - Clients approuvés
   - Personnalisé (filtres)
3. Rédigez l'email :
   - Sujet
   - Message
   - Pièces jointes (optionnel)
4. Prévisualisez
5. Programmez ou envoyez immédiatement
```

### Notifications Push

```
1. Allez dans "Notifications"
2. Créez une nouvelle notification
3. Définissez :
   - Titre
   - Message
   - Destinataires
   - Priorité (Info, Important, Urgent)
4. Envoyez
```

---

## 📊 Rapports et Statistiques

### Rapports Disponibles

#### 1. Rapport Mensuel

Contenu :
- Nombre de demandes
- Taux d'approbation
- Montant total traité
- Revenus générés
- Top partenaires
- Évolution vs mois précédent

#### 2. Rapport par Partenaire

Contenu :
- Demandes par partenaire
- Taux d'approbation
- Montant moyen
- Délai de traitement
- Satisfaction client

#### 3. Rapport Utilisateurs

Contenu :
- Nouveaux inscrits
- Utilisateurs actifs
- Taux de conversion
- Démographie

#### 4. Rapport Financier

Contenu :
- Commissions par partenaire
- Revenus mensuels
- Prévisions
- Comparaison objectifs

### Exporter un Rapport

```
1. Sélectionnez le type de rapport
2. Définissez la période
3. Choisissez le format :
   - PDF
   - Excel (XLSX)
   - CSV
4. Cliquez sur "Exporter"
```

### Tableaux de Bord Personnalisés

```
1. Allez dans "Tableaux de bord"
2. Cliquez sur "Nouveau tableau"
3. Ajoutez des widgets :
   - Graphiques
   - Tableaux
   - KPIs
   - Listes
4. Organisez la disposition
5. Sauvegardez
```

---

## ⚙️ Paramètres Système

### Configuration Générale

#### Informations de l'Entreprise

```
- Nom de l'entreprise
- Logo
- Adresse
- Téléphone
- Email de contact
- Horaires d'ouverture
```

#### Paramètres de Prêt

```
- Montant minimum : 1 000€
- Montant maximum : 500 000€
- Durée minimum : 12 mois
- Durée maximum : 360 mois
- Taux d'intérêt par défaut : 3.5%
- Frais de dossier : 0€
```

#### Paramètres d'Upload

```
- Formats acceptés : PDF
- Taille maximale : 5 MB
- Nombre max de fichiers : 10
```

### Gestion des Rôles et Permissions

#### Rôles Disponibles

| Rôle | Permissions |
|------|-------------|
| **Admin** | Accès complet |
| **Conseiller** | Gestion demandes, clients |
| **Client** | Dashboard utilisateur |

#### Modifier les Permissions

```
1. Allez dans "Rôles et permissions"
2. Sélectionnez un rôle
3. Cochez/décochez les permissions :
   - Voir demandes
   - Modifier demandes
   - Approuver/Rejeter
   - Gérer utilisateurs
   - Gérer partenaires
   - Voir rapports
   - Modifier paramètres
4. Sauvegardez
```

### Logs et Audit

#### Consulter les Logs

```
1. Allez dans "Logs système"
2. Filtrez par :
   - Type : Info, Warning, Error
   - Date
   - Utilisateur
   - Action
3. Consultez les détails
```

#### Types de Logs

- **Authentification** : Connexions, déconnexions
- **Demandes** : Créations, modifications, approbations
- **Utilisateurs** : Créations, modifications, suppressions
- **Système** : Erreurs, warnings, infos

### Sauvegardes

#### Configuration des Sauvegardes

```
1. Allez dans "Sauvegardes"
2. Configurez :
   - Fréquence : Quotidienne, Hebdomadaire
   - Heure : 02:00 AM
   - Rétention : 30 jours
   - Destination : Serveur, Cloud
3. Sauvegardez la configuration
```

#### Restaurer une Sauvegarde

```
1. Allez dans "Sauvegardes"
2. Sélectionnez la sauvegarde
3. Cliquez sur "Restaurer"
4. Confirmez (attention : écrase les données actuelles)
```

---

## 🔒 Sécurité

### Gestion des Sessions

```
- Durée de session : 24 heures
- Déconnexion automatique : Après 30 min d'inactivité
- Sessions simultanées : 3 maximum
```

### Authentification à Deux Facteurs (2FA)

```
1. Allez dans "Sécurité"
2. Activez 2FA pour :
   - Tous les admins (recommandé)
   - Tous les utilisateurs (optionnel)
3. Méthode : Email, SMS, App (Google Authenticator)
```

### Politique de Mots de Passe

```
Configuration actuelle :
- Longueur minimum : 8 caractères
- Majuscule requise : Oui
- Chiffre requis : Oui
- Caractère spécial : Recommandé
- Expiration : 90 jours (admins)
- Historique : 5 derniers mots de passe
```

### Blocage de Compte

```
Après 5 tentatives échouées :
- Compte bloqué 30 minutes
- Email de notification
- Déblocage manuel possible
```

---

## 📱 Application Mobile (Future)

### Fonctionnalités Prévues

- Dashboard mobile
- Notifications push
- Scan de documents
- Signature électronique
- Chat en temps réel

---

## 🆘 Support et Maintenance

### Contacter le Support Technique

📧 **tech@finanzplus.at**  
📞 **+43 1 234 5678 (ext. 2)**

### Signaler un Bug

```
1. Allez dans "Support" > "Signaler un bug"
2. Remplissez le formulaire :
   - Titre
   - Description détaillée
   - Étapes pour reproduire
   - Captures d'écran
   - Priorité
3. Soumettez
```

### Demander une Fonctionnalité

```
1. Allez dans "Support" > "Nouvelle fonctionnalité"
2. Décrivez la fonctionnalité souhaitée
3. Justifiez l'utilité
4. Soumettez
```

---

## 📚 Bonnes Pratiques

### Traitement des Demandes

1. ✅ Traiter les demandes dans les 24h
2. ✅ Vérifier tous les documents
3. ✅ Contacter le client si doute
4. ✅ Documenter chaque décision
5. ✅ Respecter la confidentialité

### Communication Client

1. ✅ Réponse rapide (< 24h)
2. ✅ Ton professionnel et courtois
3. ✅ Explications claires
4. ✅ Suivi régulier
5. ✅ Transparence totale

### Sécurité des Données

1. ✅ Ne jamais partager les identifiants
2. ✅ Déconnexion après chaque session
3. ✅ Vérifier les permissions
4. ✅ Signaler toute anomalie
5. ✅ Respecter le DSGVO

---

**Version** : 1.0  
**Dernière mise à jour** : 2026-06-12  
**Support Admin** : admin@finanzplus.at