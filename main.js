
//Importation des données
data = d3
    .csv('FichierCompletBaseANONYMEcleaned.xlsx')
    //le + sert à changer le type en int
    .then(data => {
        data.forEach(d => {
          d.c = +d.population;
        });
        return data;
      })

console.log