# VisuDo
Projet du Cours de Visualisation de Donnees
## Setup
### Configuration VSCode - IntelliSense
Pour qu'IntelliSense fonctionne avec d3, il faut configurer le projet comme un projet Node.
Installer [Node.js](https://nodejs.org/), puis exécuter dans le dossier racine du projet
`npm init -y`
Ceci va créer un fichier `package.json`. (Changer `name` si nécessaire dans le package.json généré)
Exécuter ensuite `npm i --save-dev @types/d3` pour installer la définition des types de `d3`.

Créer un fichier `jsconfig.json` et ajouter
```json
{
    "compilerOptions": {
        "checkJs": true,
        "target": "es2015",
        "noEmit": true,
    },
    "typeAcquisition": {
        "enable": true,
        "include": ["d3"]
    }
}
```
Probablement que seule la section `typeAcquisition` est nécessaire.