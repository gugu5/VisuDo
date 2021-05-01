
import * as d3 from "d3";
//const d3 = require('d3');

//Importation des données
const data = d3
    .csv(
        'FichierCompletBaseANONYMEcleaned.xlsx', d3.autotype
    )
    //le + sert à changer le type en int. Possible de faire +data ?
    //d3.autotype devrait s'en sortir

//afficher console
console.log(data)




//Pense-bête:
// - Dossier .idea ????