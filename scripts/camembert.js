
function graphCamembertGeneric(containerId, extractData, descriptionByLevel, legendMap = undefined) {
    let currentLevel;

    function drawGraph(){
        //d3.select(`#${containerId} .graphWithLegend`).remove();
        
    
        const preparedData = extractData(currentLevel);
        // TODO filter 0 values ?
        // total is necessary to compute the percentages
        // @ts-ignore
        const total = d3.sum(Object.values(preparedData))
        console.log(preparedData)
        // Maintenant d3 contient une liste avec clé = âge et valeur = score moyen pour cet âge
       
       
        d3.select(`#${containerId}>.graphWithLegend`).transition()
            .duration(1000)
            .style("opacity", 0)
            // To debug events when having problems during transitions (>2.5 heures pour ajouter les transitions):
            //.on('start', () => console.log('start'))
            //.on('end', () => console.log('end'))
            //.on('interrupt', () => console.log('interrupt'))
            //.on('cancel', () => console.log('cancel'))
            .remove()
            .end().then(() => {
                const width = Math.floor(graphConfig.getWidth()*.75);
                const height = width;
            const svg = d3.select(`#${containerId}`)
                .append('div')
                .attr('class', 'graphWithLegend')
                .attr('style', 'opacity: 0')
                .append('svg')
                .attr('width', width)
                .attr('height', height)
                .attr('class', 'graph')
                .attr('style', 'font: 10px sans-serif')
                // on veut centrer le graphe
                .append('g')
                .attr("transform", `translate(${width / 2},${height / 2})`)
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
            const outerRadius = width
            const arc = d3.arc()
                .innerRadius(outerRadius/5) // size of the hole in the camembert
                .outerRadius(outerRadius/2) // size of the camembert


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
                .attr("stroke", "#b5b5b5")
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
                .style("font-size", "15px")
                .style('fill', 'floralwhite')


            // append Legend
            const table = d3.select(`#${containerId}>.graphWithLegend`)
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
            
            d3.select(`#${containerId}>.graphWithLegend`)
                .transition()
                .duration(1000)
                .style("opacity", 1)
        }, () => console.log('rejected1'))


        // Add description
        d3.select(`#${containerId}>.description`).transition()
            .duration(1000)
            .style("opacity", 0)
            .remove()
            .end().then(() => {
            const description = descriptionByLevel[currentLevel]
            if (description != null) {
                d3.select(`#${containerId}`)
                    .append('p')
                    .attr('class', 'description')
                    .attr('style', 'opacity: 0')
                    .html(description)
                    .transition()
                    .duration(1000)
                    .style("opacity", 1)
            }
        }, () => console.log('rejected2'))
    }

    function init() {
        currentLevel = d3.select(`#${containerId} .select option[selected]`).attr('value')

        drawGraph();

        d3.select(`#${containerId} .select`).on('change', function(event) {
            currentLevel = event.target.value;
            drawGraph()
        });

        window.resizeListeners.push(drawGraph)
    }
    init();
}