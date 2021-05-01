
d3.dsv(';', './FichierCompletBaseANONYMEcleaned.csv', d3.autoType).then(data => {
    //afficher console
    console.log(data);


    const div = d3.select('body').append('div');
    div.html('<div style="background-color: red;">test</div>');
    div.style("border", "3px solid blue")
    
})




//Pense-bête:
