<?php

return [
    'validation' => [
        'required' => 'Ce champ est requis.',
        'email' => 'Cette adresse email n\'est pas valide.',
        'min' => [
            'string' => 'Ce champ doit contenir au moins :min caractères.',
        ],
        'max' => [
            'string' => 'Ce champ ne peut pas dépasser :max caractères.',
        ],
        'unique' => 'Cette valeur est déjà utilisée.',
        'confirmed' => 'La confirmation ne correspond pas.',
    ],
    'auth' => [
        'login_success' => 'Connexion réussie.',
        'login_failed' => 'Identifiants incorrects.',
        'logout_success' => 'Déconnexion réussie.',
        'register_success' => 'Compte créé avec succès.',
        'email_verified' => 'Email vérifié avec succès.',
        'invalid_token' => 'Token invalide ou expiré.',
        'unauthorized' => 'Non autorisé.',
        'forbidden' => 'Accès refusé.',
        'session_expired' => 'Session expirée. Veuillez vous reconnecter.',
    ],
    'order' => [
        'created' => 'Commande créée avec succès.',
        'updated' => 'Commande mise à jour.',
        'cancelled' => 'Commande annulée.',
        'not_found' => 'Commande introuvable.',
        'status_changed' => 'Statut de la commande mis à jour.',
    ],
    'product' => [
        'created' => 'Produit créé avec succès.',
        'updated' => 'Produit mis à jour.',
        'deleted' => 'Produit supprimé.',
        'not_found' => 'Produit introuvable.',
        'out_of_stock' => 'Ce produit n\'est plus en stock.',
    ],
    'payment' => [
        'success' => 'Paiement effectué avec succès.',
        'failed' => 'Le paiement a échoué. Veuillez réessayer.',
        'pending' => 'Paiement en attente.',
    ],
    'review' => [
        'created' => 'Avis ajouté avec succès.',
        'deleted' => 'Avis supprimé.',
        'exists' => 'Vous avez déjà évalué ce produit.',
    ],
    'email' => [
        'order_confirmation_subject' => 'Confirmation de commande - Electro-05',
        'order_status_subject' => 'Mise à jour de votre commande - Electro-05',
        'welcome_subject' => 'Bienvenue chez Electro-05',
        'contact_subject' => 'Nouveau message de contact',
        'reset_password_subject' => 'Réinitialisation de votre mot de passe',
        'magic_link_subject' => 'Votre lien de connexion magique',
    ],
    'system' => [
        'error' => 'Une erreur serveur est survenue.',
        'not_found' => 'Ressource introuvable.',
        'success' => 'Opération réussie.',
    ],
];
