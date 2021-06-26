# Projet du Cours de Visualisation de Données
Ce travail manipule des données sur la personnalité des rameurs suisses et propose une visualisation qui a pour but de mettre en évidence des différences de personnalité entre les rameurs de différents niveaux de compétition.

## Auteur et Contexte
Ce projet a été fait par A.Maillefer (joignable [ici](mailto:augustin.maillefer@gmail.com)) dans le cadre du cours de l'Université de Lausanne "Visualisation de Données", encadré par le Professeur I.Pante. Les données proviennent de son travail de Master.

## Accéder au site Personnalité et Compétition en Aviron
La visualisation de données est disponible à ce lien: https://gugu5.github.io/VisuDo/

## Exemple de visualisation
Il y a deux barplots utilisant les cinq dimensions de la personnalité et deux camemberts basés sur les tendances dysfonctionnelles (TD). L'utilisateur sélectionne la dimension ou le groupe de niveau qui l'intéresse. Un bref commentaire adapté à la sélection est proposé sous chaque visualisation.

![Exemple de visualisation](/images/imgCamembert.png)



## Descriptif des données

Le tableau excel rassemble des données renseignant sur la personnalité récupérées via des questionnaires/grilles d'évaluation en ligne. Des rameurs suisses de tout niveau (79 rameurs au total, 26 féminins, 51 masculins) ont répondu à des questionnaires (PFPI, TD12) renseignant sur leur personnalité.

Ces données ont été récoltées dans le cadre de mon travail de master. Pour ce travail de visualisation de données, toutes les données n'ont pas été utilisées. Seulement ce qui est pertinent pour ce travail sera décrit ci-dessous.

### Colonne K (Niveau actuel)

Les rameurs sont répartis en quatre groupes selon leur niveau de compétition actuel. Super-élite signifie un top 6 mondial (ou mieux) durant 4 années consécutives.    

Niveau régional: n = 15 (21.4% de l'échantillon total)    
Niveau national: n = 19 (27.1%)    
Equipe suisse: n = 25 (35.7%)    
Super-élite: n = 11 (15.7%)

### Les colonnes N à AM (Tension-inquiétude --> Proactivité-FR)

Ce sont les scores bruts du questionnaire PFPI. Les en-têtes sont explicites. Il s'agit des Cinq Dimensions (Big Five) de la personnalité (Stabilité Emotionnelle, Ouverture, Agréabilité, Extraversion, Caractère Consciencieux) ainsi que les 20 traits qui les composent. Dans ce travail on ne s'occupera pas des traits, seulement des cinq dimensions qui regroupent ces traits.

La **Stabilité émotionnelle** reflète à quel point un individu est calme, stable et sûr de soi. Cette dimension est composée des quatre traits suivants :
- Tension-Inquiétude
- Confiance en soi
- Vulnérabilité au stress
- Tolérance à la frustration

L’**Extraversion** renvoie à la tendance à rechercher des stimulations et à se confronter à l’environnement. Cette dimension est composée des quatre traits suivants :
- Enthousiasme
- Sociabilité
- Énergie
- Assertivité

L’**Ouverture** rend compte de l’ouverture à l’expérience (cognitive ou non) qui se manifeste par des intérêts larges et variés et une capacité à vivre des expériences nouvelles sans anxiété. Cette dimension est composée des quatre traits suivants :
- Innovation-Créativité
- Goût pour la réflexion vs l’action
- Analyse de soi
- Ouverture au changement

L’**Agréabilité** concerne la nature des relations avec autrui. Cette dimension se différencie de l’extraversion en ce sens que l’extraverti recherche la compagnie d’autrui tandis que l’altruiste s’intéresse au bien-être d’autrui. Elle est composée des quatre traits suivants :
- Esprit de compétition
- Attention à l’autre
- Confiance en l’autre
- Réaction aux conflits

Le **Caractère consciencieux** concerne le contrôle des impulsions. Les personnes ayant un caractère consciencieux marqué sont moins soumises à l’emprise des sensations et émotions immédiates, ces personnes sont plus orientées vers le long-terme et respectent les normes légales, morales et éthiques de leur culture. Cette dimension est composée des quatre traits suivants :
- Planification-Organisation
- Autodiscipline
- Contrôle de soi
- Recherche de réussite


### Les colonnes AN à AY (VIGILANT MEFIANT --> PESSIMISTE DEPRESSIF)
Ce sont les scores bruts du TD12. Le TD12 informe quant à la personnalité dysfonctionnelle ou "personnalité difficile". Les tendances dysfonctionnelles reflètent des traits de personnalité rigides et systématiques qui se traduisent par des comportements qui ne prennent pas suffisamment en compte l’environnement et ses contraintes spécifiques.

### Les colonnes AZ à BK(TD12 Note T1 --> TD12 Note T12)
Il s'agit des notes T du TD12. Une note T est une note standardisée de moyenne 50 et d’écart type 10. Une personne ayant une note T de 50 se situe donc dans la moyenne ; une note T de 60 la situe à deux écarts type au-dessus de la moyenne ; une note T de 65 à trois écarts types au-dessus de la moyenne, etc. Dès deux écarts-tpyes, on considère que c'est une forte différence à la norme.

## Setup

Cette visualisation de données a essenitellement été faite à partir de D3.

https://d3js.org

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

## Influences
En plus des différentes aides et outils disponibles sur le web, ce projet s'est inspiré de ce site web: https://wiola99.github.io/VD-project/