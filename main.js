




// a list of functions to call on resize
window.resizeListeners = []

let globalData = null

d3.dsv(';', './FichierCompletBaseANONYME.csv', d3.autoType).then(data => {
    //afficher console
    //console.log(data);
    
    // supprimer la colonne champ vide
    // a) dans la liste des noms
    data.columns.splice(data.columns.length-1, 1)
    // b) puis dans les rangées (objets)
    data.forEach(d => delete d[''])

    // itérer sur chaque colonne pour remplacer ses valeurs manquantes
    data.columns.forEach (field => {
        // calculer la moyenne pour remplacer les valeurs manquantes
        const mean = d3.mean(data, d => d[field]);
        //console.log(mean);
        data.forEach(d => {
            if (d[field] === null) {
                // @ts-ignore
                d[field] = mean;
            }
        });
    })
    globalData = data;
    
    console.log(data.columns);
    console.log(data);

    // on a des données sans donnees manquantes

    const columnAge = 'Âge'
    const columnNiveauActuel = 'Niveau actuel'

    //callbacks
    graphGeneric('graph1', columnAge, (currentSelection, categoryField) => {
                //grouper les scores de dimensions par age en moyenne
                let filteredData = d3.rollup(globalData,
                    v => d3.mean(v,d => d[currentSelection]),
                    d => d[categoryField])
                // enlever valeur isolée
                filteredData.delete(43)
                return filteredData
    }, {
        'Ouverture' : "Cette visualisation ne permet pas de faire des observations majeures sur cette dimension. La littérature ne signale pas une évolution attendue de l'ouverture en fonction de l'âge. Ici, on peut tout de même observer que l'ouverture ne décline apparemment pas avec l'âge.",
        'Caractère Consciencieux' : "On voit que le caractère consciencieux augmente avec l'âge. C'est la seule dimension qui ici évolue de façon remarquable. Cela pourrait aussi être dû au fait que les équipe suisse et super-élites sont presque systématiquement plus âgés que les rameurs régionaux qui sont souvent plus jeunes.",
        'Extraversion' : "La littérature montre que les sportifs sont plus extravertis que les non-sportifs. Est-ce que c'est parce qu'on est extraverti qu'on fait du sport ou est-ce qu'on fait du sport qu'on devient extraverti ? La réponse n'est pas claire. Ici, on a affaire uniquement à des sportifs. Cette visualisation ne permet pas de tirer des conclusions entre l'âge et cette dimension.",
        'Agréabilité' : "La littérature montre que l'agréabilité est une dimension qui augmente légèrement en vieillissant. Ici, on devine cette observation sans vraiment la voir. Il faudrait, pour pouvoir observer ceci, que l'âge ne s'arrête pas à 33 ans mais que l'âge s'étende jusqu'à au moins 50 ans. Ou alors peut-être que cette observation ne s'applique simplement pas aux rameurs.",
        'Stabilité Emotionnelle' : "La littérature montre que la stabilité émotionnelle est une dimension qui augmente légèrement en viellissant. Ici, ce n'est pas observable. On remarque par contre à nouveau une valeur extrême pour les 25 ans, faisant ressortir le manque d'échantillons récoltés pour cet âge précis.",
    });

    const niveauDescByNiveau = {
        '1': '1: Régional',
        '2': '2: National',
        '3': '3: Équipe suisse',
        '4': '4: Super élite'
    }
    graphGeneric('graph2', columnNiveauActuel, (currentSelection, categoryField) => {
        //grouper les scores de dimensions par age en moyenne
        const filteredData = d3.rollup(globalData,
            v => d3.mean(v,d => d[currentSelection]),
            d => niveauDescByNiveau[d[categoryField]])
        return filteredData;

        //passé 3 heures juste pour que les niveaux actuels s'affichent dans l'ordre (1,2,3,4) et non pas (2,1,3,4)
        // ça a demandé de tout questionner la structure de données (map, internmap, array, le rollup, etc...)

        }, {
            'Ouverture' : "On voit une scission entre les groupes (1-2) et les groupes (3-4). Les régionaux/nationaux ont une ouverture relativement faible comparée à celle des rameurs de l'équipe suisse et des super-élites. La littérature va aussi dans ce sens, une plus grande ouverture amène a un meilleur niveau de performance. En aucun cas l'ouverture a été observée comme une dimension délétère à la performance.",
            'Caractère Consciencieux' : "Cette dimension évolue de façon remarquable entre chaque groupe de niveau. La littérature va aussi dans ce sens,<b> le caractère consciencieux va de pair avec la performance</b>.",
            'Extraversion' : "Ce graph fait ressortir de grandes différences d'extraversion entre les groupes. En réalité, l'échelle de l'axe Y s'adapte aux valeurs qui sont ici assez denses entre les groupes. Contrairement à ce qui saute aux yeux ici, il n'y a pas de différences majeures d'extraversion à observer entre les groupes.",
            'Agréabilité' : "Ce graph fait ressortir de grandes différences d'agréabilité entre les groupes. En réalité, l'échelle de l'axe Y s'adapte aux valeurs qui sont ici assez denses entre les groupes. Contrairement à ce qui saute aux yeux ici, il n'y a pas de différences majeures d'agréabilité à observer entre les groupes",
            'Stabilité Emotionnelle' : "On voit une scission entre les groupes (1-2) et les groupes (3-4). Les régionaux/nationaux ont une stabilité émotionnelle relativement faible comparée à celle des rameurs de l'équipe suisse et des super-élites. La littérature va aussi dans ce sens, la stabilité émotionnelle est une dimension majeure dans la performance (spécialement sa composante 'confiance en soi'). On pourrait se demander pourquoi le groupe 3 a une valeur moyenne supérieure au groupe 4; la réponse se trouve peut-être dans le fait que l'échantillon des super-élites est moins grand. De par son petit nombre, le groupe 4 a une moyenne peut-être moins représentative du groupe.",
        }, 
        // on veut que les clés de l'objet filteredData soient ordonnées
        //data => ['1: Régional', '2: National', '3: Équipe suisse', '4: Super élite']
        () => Object.values(niveauDescByNiveau)
    );

    const seuilTD = 60
    const tdScorePrefix = 'TD12 Note T '

    graphCamembertGeneric('graph3', currentSelection => {
        const scoreColumns = d3.filter(globalData.columns, column => column.startsWith(tdScorePrefix));
        let filteredData = d3
        //conserver les données ayant le niveau sélectionné
        .filter(globalData, d => d[columnNiveauActuel] == currentSelection)
        //grouper les scores de dimensions par niveau en moyenne
        .map(d => 
            // calcul le nombre de TD => Tscore >= 60
            d3.reduce(scoreColumns, (count, scoreColumn) => {
                if (d[scoreColumn] >= seuilTD)
                    return count + 1;
                else
                    return count;
            }, 0)
        )
        filteredData = d3.reduce(filteredData, (res, nbTD) => {
            const key = nbTD >= 8 ? '8+' : '' + nbTD;
            res[key]++;
            return res
        }, {
            '0': 0,
            '1': 0,
            '2': 0,
            '3': 0,
            '4': 0,
            '5': 0,
            '6': 0,
            '7': 0,
            '8+': 0,
        })
        return filteredData
    }, {
        '1' : "Chez les compétiteurs régionaux, plus de la moitié des rameurs n'a pas de TD. Par contre, 30% des rameurs ont 5 TD ou plus. Soit on n'a pas de tendance dysfonctionnelle, soit on les collectionne.",
        '2' : "Chez les compétiteurs nationaux, presque la moitié (~45%) des rameurs n'a pas de TD. Environ 23% des rameurs ont 5 TD ou plus et 32% ont 5 TD ou plus. La tendance se resserre vers le milieu (2-3 TD) par rapport aux rameurs régionaux.",
        '3' : "En équipe suisse, plus de 21% des rameurs n'ont aucune TD. 20% des rameurs accumulent 5 TD ou plus. Quasiment la moitié (48%) des rameurs nationaux accumule 2-3 TD. Par rapport aux rameurs nationaux et régionaux, la tendance se resserre encore vers le milieu.",
        '4' : "Chez les super-élite, 27% n'ont aucune TD et moins de 10% accumulent 5 TD ou plus. Plus de la moitié des super-élite a 1,2 ou 3 TD. En étant super-élite, on a plus d'une chance sur deux d'avoir une ou plusieurs TD, mais on est quasiment sûr de ne pas en accumuler plus que trois. Il serait intéressant d'aller voir si ces 2-3 TD sont toujours les mêmes au seins du groupe. Le camembert suivant est là pour ça.",
    }, {
        '0': '0 TD',
        '1': '1 TD',
        '2': '2 TDs',
        '3': '3 TDs',
        '4': '4 TDs',
        '5': '5 TDs',
        '6': '6 TDs',
        '7': '7 TDs',
        '8+': '8 TDs ou plus',
    });

    graphCamembertGeneric('graph4', currentSelection => {
        const scoreColumns = d3.filter(globalData.columns, column => column.startsWith(tdScorePrefix));
        // initialisation du résultat/compteur
        const res = {}
        scoreColumns.forEach(scoreColumn => res[scoreColumn.substring(tdScorePrefix.length)] = 0);
        // compter le nombre de TD par TD
        globalData.forEach(d => {
            // on ne traite que le niveau sélectionné
            if (d[columnNiveauActuel] == currentSelection) {
                scoreColumns.forEach(scoreColumn => {
                    if (d[scoreColumn] >= seuilTD) {
                        res[scoreColumn.substring(tdScorePrefix.length)]++
                    }
                })
            }
        })
        return res
    }, {
        '1' : 'La TD "Introverti Distant" est absente et la TD "Pessimiste Dépressif" est plus fréquente que les autres. Cela s\'explique peut-être par le fait que les rameurs régionaux sont souvent adolescents, âge autour duquel la confiance en soi baisse. Sinon globalement, la répartition des TD est assez homogène.',
        '2' : "Les 12 TD sont présentes et réparties de façon assez homogène. La TD \"Anticonformiste impulsif\" est la TD la plus fréquente avec ses 15.4%. Cette TD est reliée aux dimensions de la stabilité émotionnelle, de l'agréabilité et du caractère consciencieux. Même en sachant cela, pas facile d'expliquer pouquoi cette TD est légrèment plus fréquente que les autres.",
        '3' : "En équipe suisse, les 12 TD sont présentes. Contrairement aux régionaux, la TD \"Pessimiste Dépressif\" est sous-représentée (moins de 2%). Trois TD sortent du lot, \"Confiant en soi égocentrique\" (23%), \"Anticonformiste impulsif\" (18.9%) et \"Expressif théâtral\" (17.6%). Puisque une bonne confiance en soi est requise pour le haut niveau, il n'est pas surprenant de voir que presque un quart de l'équipe suisse est narcissique, on peut quasiment considérer cette TD comme nécessaire. La TD \"Expressif théâtral\" se justifie par une extraversion hors norme accompagnée d'une forte confiance en soi. L'anticonformisme impulsif se caractérse principalement par un niveau d'agréabilité faible. L'esprit de compétition étant négativement corrélé à la dimension de l'agréabilité, cela explique probablement la fréquence de cette TD.",
        '4' : "Cinq TD n'apparaissent jamais dans le groupe super-élite. Les trois TD les plus fréquentes sont les mêmes que celles du groupe \"Equipe Suisse\". \"Confiance en soi égocentrisme\" est surreprésenté (35%), on peut dire que cette TD est quasiment une caractéristique inhérente au plus haut niveau de performance. Les TD \"Expressif théâtral\" et \"Anticonformiste impulsif\" apparaissent à des fréquences comparables à celles de groupe \"Equipe Suisse\".",
    });
    
})

window.onresize = () => {
    // on ne s'intéresse qu'aux changementx de largeur
  const w = window.innerWidth
  if (w !== window.lastWidth) {
    window.lastWidth = w
    window.resizeListeners.forEach(f => f())
  }
};







