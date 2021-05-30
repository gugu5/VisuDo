




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
        'Ouverture' : "Ouverture description",
        'Caractère Consciencieux' : "On voit que le caractère consciencieux augmente avec l'âge.<br/>C'est <span style=\"color: red\">la seule dimension</span> qui ici évolue de façon reamarquable.",
        'Extraversion' : "TODO",
        'Agréabilité' : "TODO",
        'Stabilité Emotionnelle' : "TODO",
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
            'Caractère Consciencieux' : "On voit que le caractère consciencieux augmente avec l'âge. C'est la seule dimension qui ici évolue de façon reamarquable.",
            'Extraversion' : "TODO",
            'Agréabilité' : "TODO",
            'Stabilité Emotionnelle' : "TODO",
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
