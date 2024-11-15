# OlympicGamesStarter 🏅

[![Angular](https://img.shields.io/badge/Angular-18.2.11-red?logo=angular)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Ngx-Charts](https://img.shields.io/badge/Ngx--Charts-Lines%20%26%20Pie-orange)](https://swimlane.github.io/ngx-charts/)

**OlympicGamesStarter** est un projet Angular développé dans un cadre pédagogique pour le **cursus Full-Stack Java Angular d'OpenClassrooms**. Il a pour but d'approfondir les connaissances en développement front-end, avec un focus sur Angular et TypeScript, ainsi que sur l'import et l'utilisation d'une bibliothèque de visualisation de données, ici `ngx-charts`.

Le repo initial est disponible sur [Github](https://github.com/OpenClassrooms-Student-Center/Developpez-le-front-end-en-utilisant-Angular)

---

## 📝 Description

Ce projet est une application Front-end Angular de visualisation de données olympiques, qui affiche des informations sur les performances de différents pays aux Jeux Olympiques. Les data ne sont pas issues d'appel à un back-end mais proviennent d'un fichier mock.

La bibliothèque `ngx-charts` est utilisée pour illustrer les données graphiquement, avec un routage entre les pages.

## 🛠️ Pré-requis

Pour commencer, installation des dépendances nécessaires avec la commande :

```bash
npm install
```

---

## 🚀 Lancement du serveur de développement

Pour lancer le serveur de développement, exécuter dans le terminal :

```bash
ng serve
```

Le rendu est visible sur `http://localhost:4200/` dans votre navigateur.
Une version dev en ligne liée à ce dépôt est disponible sur [https://oc-p2-olympics.vercel.app/](https://oc-p2-olympics.vercel.app/) .

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

- **`core`** : contient la logique métier et les services.

  - **`services`** : services utilisés pour récupérer et normaliser les données olympiques et gérer les interactions avec le dashboard.
  - **`models`** : interfaces TypeScript pour structurer les données et assurer le typage strict.

- **`components`** : contient tous les composants réutilisables _medals-line-chart_ et _medals-pie-chart_.
- **`pages`** : contient les composants utilisés pour le routage et les vues principales de l'application _home_, _detail_ et _not-found_.

---

## 📊 Fonctionnalités du projet

Le projet intègre les fonctionnalités de visualisation de données suivantes grâce à `ngx-charts` :

- **Graphiques en ligne** (Line Chart) pour observer les nombre de médailles par années olympiques pour un pays sélectionné.
- **Graphiques en secteurs** (Pie Chart) pour comparer les totaux de médailles par pays.

Le projet est développé en single-page app et est responsif sur différentes tailles d'écran.

---

## 📚 Ressources utiles

- [Documentation Angular](https://angular.io/docs)
- [Documentation Ngx-Charts](https://swimlane.github.io/ngx-charts/)

---

Merci pour votre curiosité 🎓
