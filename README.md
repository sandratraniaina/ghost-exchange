Ce projet est une plateforme de trading composée de trois parties principales :

## Structure du Projet

```
📦 ghost-exchange/
 ┣ 📂 client/          # Application web React + TypeScript + Vite
 ┣ 📂 mobile/          # Application mobile Expo
 ┣ 📂 server/          # Serveur backend
 ┗ 📜 docker-compose.yml
```

## Prérequis

- Node.js
- Docker et Docker Compose
- PostgreSQL
- Expo CLI (pour le développement mobile)

## Installation

### Application Web (Client)

```bash
cd ghost-exchange/client
npm install
```

### Application Mobile

```bash
cd ghost-exchange/mobile
npm install
```

## Démarrage

### Application Web

```bash
cd ghost-exchange/client
npm run dev
```

### Application Mobile

```bash
cd ghost-exchange/mobile
npx expo start
```

L'application mobile peut être lancée sur :
- Simulateur iOS
- Émulateur Android 
- Expo Go (pour les tests)

### Base de données et Services

Pour lancer tous les services via Docker :

```bash
cd ghost-exchange
docker-compose up
```

## Technologies Utilisées

- **Frontend**: React, TypeScript, Vite
- **Mobile**: Expo, React Native
- **Base de Donné**: PostgreSQL , FireStore 
- **Backend**: Java Spring-boot
- **Conteneurisation**: Docker

## Documentation

- Pour le développement mobile, consultez la [documentation Expo](https://docs.expo.dev/)
- Pour le client web, référez-vous à la documentation de [Vite](https://vitejs.dev/) et [React](https://react.dev/)

---
Pour plus d'informations sur chaque composant, consultez les README respectifs dans les dossiers `client/`, mobile et `server/`.