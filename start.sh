#!/bin/bash

# Script de démarrage pour GALAND Plomberie
# Ce script lance le backend et le frontend en parallèle

echo "========================================="
echo "  GALAND Plomberie - Démarrage"
echo "========================================="
echo ""

# Vérifier que les node_modules existent
if [ ! -d "backend/node_modules" ]; then
    echo "⚠️  Installation des dépendances backend..."
    cd backend && npm install && cd ..
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "⚠️  Installation des dépendances frontend..."
    cd frontend && npm install && cd ..
fi

# Vérifier que les fichiers .env existent
if [ ! -f "backend/.env" ]; then
    echo "⚠️  Création du fichier backend/.env..."
    cp backend/.env.example backend/.env
    echo "⚠️  N'oubliez pas de configurer votre mot de passe PostgreSQL dans backend/.env"
fi

if [ ! -f "frontend/.env" ]; then
    echo "⚠️  Création du fichier frontend/.env..."
    cp frontend/.env.example frontend/.env
fi

echo ""
echo "✅ Lancement du backend sur http://localhost:5000"
echo "✅ Lancement du frontend sur http://localhost:3000"
echo ""
echo "Pour arrêter l'application, appuyez sur Ctrl+C"
echo "========================================="
echo ""

# Lancer le backend et le frontend en parallèle
trap 'kill $(jobs -p)' EXIT

cd backend && npm run dev &
cd frontend && npm run dev &

wait
