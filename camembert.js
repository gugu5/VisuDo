
function graphCamembertGeneric(containerId, extractData, descriptionByLevel, legendMap = undefined) {
    let currentLevel;

    function drawGraph(){
        d3.select(`#${containerId} .graphWithLegend`).remove();
        
    
        const preparedData = extractData(currentLevel);
        // TODO filter 0 values ?
        // total is necessary to compute the percentages
        // @ts-ignore
        const total = d3.sum(Object.values(preparedData))

        console.log(preparedData)
        // Maintenant d3 contient une liste avec clé = âge et valeur = score moyen pour cet âge

        const svg = d3.select(`#${containerId}`)
            .append('div')
            .attr('class', 'graphWithLegend')
            .append('svg')
            .attr('width', graphConfig.width)
            .attr('height', graphConfig.height)
            .attr('class', 'graph')
            .attr('style', 'font: 10px sans-serif')
            // on veut centrer le graphe
            .append('g')
            .attr("transform", `translate(${graphConfig.width / 2},${graphConfig.height / 2})`)
            ; 

        const baseColors = ['#006d48',"#182f58","#543b74","#92407e", "#cc4975", "#f4635e", '#ff8d3a', '#ffc009' ,'#6fb634' ,'#5abba4', '#5ab5df', '#2875da'];
        const keys = Object.keys(preparedData);
        // Set the color scale
        const color = d3.scaleOrdinal()
            .domain(keys)
            .range(baseColors.slice(0, keys.length))

        // Calculate fields for the pie chart
        const pie = d3.pie()
            .sort(null) // Do not sort group by size
            .value(entry => entry[1])
            (Object.entries(preparedData));

        //Create the arcs with arc function
        const arc = d3.arc()
            .innerRadius(150) // size of the hole in the camembert
            .outerRadius(300) // size of the camembert


        // Create the pie chart
        svg
            .selectAll('donutPart')
            .data(pie)
            .enter()
            .append('path')
            // @ts-ignore
            .attr('d', arc)
            .attr('fill', d => color(d.data[0]))
            // transparent not working => use same color as background
            .attr("stroke", "#797979")
            .style("stroke-width", "4px")
        

        // Append text
        svg
            .selectAll('donutPart')
            .data(pie)
            .enter()
            .append('text')
            .text(function(d){
                const percent =  d.data[1] * 100 / total
                    // avoid adding text if too small
                    if (percent > 2){
                        // round to 1 decimal
                        return  Math.round(percent*10)/10 + '%'  
                    }
                })
            // @ts-ignore
            .attr("transform", d => `translate(${arc.centroid(d)})`) //put the text in the center of the donut chart parts
            .style("text-anchor", "middle")
            .style("font-size", 17)
            .style('fill', 'floralwhite')


        // append Legend
        const table = d3.select(`#${containerId} .graphWithLegend`)
            .append('div')
            .attr('class', 'graphLegend')
            .append('table');
        let tr = table.append('tr')
        tr.append('th').text('Couleur')
        tr.append('th').text('Description')
        keys.forEach((key, idx) => {
            let tr = table.append('tr')
            tr.append('td')
                .attr('style', `background-color: ${baseColors[idx]}`)
            let legend = key
            if (legendMap !== undefined && legendMap[key] !== undefined) {
                legend = legendMap[key]
            }
            tr.append('td').text(legend)
        })


        // Add description
        const description = descriptionByLevel[currentLevel]
        if (description != null) {
            d3.select(`#${containerId} .description`).remove()
            d3.select(`#${containerId}`)
            .append('p')
            .attr('class', 'description')
            .html(description)
        }
    }

    function init() {
        currentLevel = d3.select(`#${containerId} .select option[selected]`).attr('value')

        drawGraph();

        d3.select(`#${containerId} .select`).on('change', function(event) {
            currentLevel = event.target.value;
            drawGraph()
        });
    }
    init();
}