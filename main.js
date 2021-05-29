




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
        //debugger;
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


    //callbacks
    graphGeneric('graph1', 'Âge', (currentSelection, categoryField) => {
                //grouper les scores de dimensions par age en moyenne
                let filteredData = d3.rollup(globalData,
                    v => d3.mean(v,d => d[currentSelection]),
                    d => d[categoryField])
                // enlever valeur isolée
                filteredData.delete(43)
                return filteredData
    });

    graphGeneric('graph2', 'Niveau actuel', (currentSelection, categoryField) => {
        //grouper les scores de dimensions par age en moyenne
        const filteredData = d3.rollup(globalData,
            v => d3.mean(v,d => d[currentSelection]),
            d => d[categoryField])
        return filteredData;

        //passé 3 heures juste pour que les niveaux actuels s'affichent dans l'ordre (1,2,3,4) et non pas (2,1,3,4)
        // ça a demandé de tout questionner la structure de données (map, internmap, array, le rollup, etc...)
}, 
// on veut que les clés de l'objet filteredData soient ordonnées
data => Array.from(data.keys()).sort().map(x => ""+x));


    
})







//Pense-bête:
