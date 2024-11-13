# OlympicGamesStarter 🏅

[![Angular](https://img.shields.io/badge/Angular-18.0.3-red?logo=angular)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Ngx-Charts](https://img.shields.io/badge/Ngx--Charts-Lines%20%26%20Pie-orange)](https://swimlane.github.io/ngx-charts/)

**OlympicGamesStarter** est un projet Angular développé dans un cadre pédagogique pour le cursus Java-Angular d'OpenClassrooms. Ce projet a pour but d'approfondir les connaissances en développement front-end, avec un focus sur Angular et TypeScript, ainsi que sur l'import et l'utilisation d'une bibliothèque de la visualisation de données `ngx-charts`.

Auteur : **M. Tangi LE CADRE**

---

## 📝 Description

Ce projet est une application Angular de visualisation de données olympiques, qui affiche des informations sur les performances de différents pays aux Jeux Olympiques. Il utilise des graphiques linéaires et circulaires grâce à la bibliothèque `ngx-charts` pour illustrer les données de manière interactive et attractive, avec un routage en tre les pages.

## 🛠️ Pré-requis

Avant de commencer, assurez-vous d'avoir installé toutes les dépendances du projet en exécutant la commande :

```bash
npm install
```

---

## 🚀 Lancement du serveur de développement

Pour lancer le serveur de développement, exécutez :

```bash
ng serve
```

Ouvrez ensuite sur `http://localhost:4200/` dans votre navigateur. L'application se recharge automatiquement dès qu'une modification est apportée aux fichiers source.
Une version en ligne est disponible sur `https://oc-p2-olympics.vercel.app/` .

---

## 🏗️ Build du projet

Pour construire le projet, utilisez la commande :

```bash
ng build
```

Les fichiers générés seront stockés dans le répertoire `dist/`.

---

## 🗂️ Architecture du projet

Une architecture de base a été mise en place pour faciliter la compréhension et l'organisation du code. Voici les principales sections :

- **`components`** : contient tous les composants réutilisables.
- **`pages`** : contient les composants utilisés pour le routage et les vues principales de l'application.
- **`core`** : contient la logique métier et les services.
  - **`services`** : services utilisés pour récupérer les données olympiques et gérer les interactions avec l'API.
  - **`models`** : interfaces TypeScript pour structurer les données et assurer la typage strict.

---

## 📊 Fonctionnalités du projet

Le projet intègre les fonctionnalités de visualisation de données suivantes grâce à `ngx-charts` :

- **Graphiques en ligne** (Line Chart) pour observer les tendances de médailles au fil du temps.
- **Graphiques en secteurs** (Pie Chart) pour comparer les totaux de médailles par pays.

Ces graphiques sont configurés pour offrir une interface utilisateur interactive et intuitive.

---

## 📚 Ressources utiles

- [Documentation Angular](https://angular.io/docs)
- [Documentation Ngx-Charts](https://swimlane.github.io/ngx-charts/)

---

Merci pour votre curiosité 🎓
