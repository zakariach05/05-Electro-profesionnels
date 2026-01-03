Instructions rapides

- Installer les dépendances front si besoin :

```bash
cd Frond-end
npm install
```

- Lancer l'exemple Node (ou intégrer le code à votre app front) :

```bash
node app.js
```

- Dans votre code front (React/Vue), utilisez `axios` avec `baseURL` pointant vers `http://127.0.0.1:8000/api`.
- Pour accéder à une image stockée : `http://127.0.0.1:8000/storage/<chemin-fichier>`

Notes backend

- J'ai ajouté `ALLOWED_ORIGINS` dans `05-Electro-Back-end/.env` pour autoriser `localhost:3000` et `5173`.
- Si votre front tourne sur un autre port, ajoutez l'origine correspondante dans `.env`.
