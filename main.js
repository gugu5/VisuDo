




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
        'Ouverture' : "Cette visualisation ne permet pas de faire des observations majeures sur cette dimension.</br> On peut tout de même observer que l'ouverture ne décline apparemment pas avec l'âge.",
        'Caractère Consciencieux' : "On voit que le caractère consciencieux augmente avec l'âge. C'est la seule dimension qui ici évolue de façon reamarquable. </br> Cela pourrait aussi être dû au fait que les équipe suisse et super-élites sont presque systématiquement plus âgés que les rameurs régionaux qui sont souvent plus jeunes.",
        'Extraversion' : "La littérature montre que les sportifs sont plus extravertis que les non-sportifs. Est-ce que c'est parce qu'on est extraverti qu'on fait du sport ou est-ce qu'on fait du sport qu'on devient extraverti ? </br> La réponse n'est pas claire. Ici, on a affaire uniquement à des sportifs. Cette visualisation ne permet pas de tirer des conclusions entre l'âge et cette dimension.",
        'Agréabilité' : "La littérature montre que l'agréabilité est une dimension qui augmente légèrement en vieillissant. Ici, on devine cette observation sans vraiment la voir. </br> Il faudrait pour ceci que l'âge ne s'arrête pas à 33 ans mais qu'elle s'étende jusqu'à au moins 70 ans. Ou alors peut-être que cette observation ne s'applique pas à cet échantillon de rameurs.",
        'Stabilité Emotionnelle' : "La littérature montre que la stabilité émotionnelle est une dimension qui augmente légèrement en viellissant. Ici, ce n'est pas observable. </br>On remarque par contre à nouveau une valeur extrême pour les 25 ans, faisant ressortir le manque d'échantillons récoltés pour cet âge précis.",
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
            'Ouverture' : "Ouverture description",
            'Caractère Consciencieux' : "Cette dimension évolue de façon remarquable entre chaque groupe de niveau. La littérature va aussi dans ce sens,<span style=\"color: red\"> le caractère consciencieux va de pair avec la performance</span>.",
            'Extraversion' : "Ce graph fait ressortir de grandes différences d'extraversion entre les groupes. En réalité, l'échelle de l'axe Y s'adapte aux valeurs qui sont ici assez denses entre les groupes.</br> Contrairement à ce qui saute aux yeux ici, il n'y a pas de différences majeures d'extraversion à observer.",
            'Agréabilité' : "Ce graph fait ressortir de grandes différences d'agréabilité entre les groupes. En réalité, l'échelle de l'axe Y s'adapte aux valeurs qui sont ici assez denses entre les groupes.</br> Contrairement à ce qui saute aux yeux ici, il n'y a pas de différences majeures d'agréabilité à observer",
            'Stabilité Emotionnelle' : "On voit une scission entre les groupes (1-2) et les groupes (3-4). Les régionaux/nationaux ont une stabilité émotionnelle relativement faible comparée à celle des rameurs de l'équipe suisse et des super-élites. </br>La littérature va aussi dans ce sens, la stabilité émotionnelle est une dimension majeure dans la performance (spécialement sa composante 'confiance en soi').</br> On pourrait se demander pourquoi le groupe 3 a une valeur moyenne supérieure au groupe 4; il faut garder à l'esprit que l'échantillon des super-élites est moins nombreux.</br> De par son petit nombre, le groupe 4 est donc plus sujet à des variations intra-groupe.",
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
        '1' : "TODO",
        '2' : "TODO",
        '3' : "TODO",
        '4' : "TODO",
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
        '1' : "TODO",
        '2' : "TODO",
        '3' : "TODO",
        '4' : "TODO",
    });
    
})







//Pense-bête:
