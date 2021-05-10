





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
                d[field] = mean;
            }
        });
    })
    
    console.log(data.columns)
    console.log(data);

    // on a des données sans trouss




    const div = d3.select('body').append('div');
    div.html('<div style="background-color: red;">test</div>');
    div.style("border", "3px solid blue")
    
})







//Pense-bête:
