
//Importation des données
data = d3
    .csv(
        'FichierCompletBaseANONYMEcleaned.xlsx', d3.autotype
    )
    //le + sert à changer le type en int. Possible de faire +data ?
    //d3.autotype devrait s'en sortir


console.log(data)




//Pense-bête:
// - Dossier .idea ????