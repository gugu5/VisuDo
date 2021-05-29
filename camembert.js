
function graphCamembertGeneric(containerId, categoryField, extractData, getDomain = undefined) {
    let currentDimension; // set language by default, the same as used un html

    function drawGraph(){
        d3.select(`#${containerId} .graph`).remove();
        
    
        const filteredData = extractData(currentDimension, categoryField);
        console.log(filteredData)
        // Maintenant d3 contient une liste avec clé = âge et valeur = score moyen pour cet âge

        const svg = d3.select(`#${containerId}`)
            .append('svg')
            .attr('width', graphConfig.width)
            .attr('height', graphConfig.height)
            .attr('class', 'graph')
            .attr('style', 'font: 10px sans-serif'); 
return;            
        // Horizontal scale
        const scaleX = d3.scaleBand()
            .domain((getDomain === void 0) ? Array.from(filteredData.keys()) : getDomain(filteredData))
            .range([0, graphConfig.width - graphConfig.margin.right - graphConfig.margin.left])
            .padding(0.2)
            .round(true) //arrondir les valeurs au pixel pres


        // Vertical scale
        const maxY = d3.max(filteredData, d => d[1])
        const minY = d3.min(filteredData, d => d[1])
        const extraOffset = graphConfig.axis.y.extraOffsetPercent * (maxY - minY) / 100
        const scaleY = d3.scaleLinear()
            .domain([maxY + extraOffset, minY - extraOffset])
            .range([graphConfig.margin.top, graphConfig.height - graphConfig.margin.bottom -graphConfig.margin.top]);
        
        svg.append('g')
            .attr('transform', `translate(${graphConfig.margin.left}, ${graphConfig.margin.top})`)
            .call(d3.axisLeft(scaleY)
            //.tickFormat((d,i) => d+'%')
            );

        svg.append('g')
        .attr('transform', `translate(${graphConfig.margin.left}, ${graphConfig.margin.top})`)
        .call(d3.axisLeft(scaleY)
        //.tickFormat((d,i) => d+'%')
        );
        
        // legend Y
        svg
            .append('g')
            .attr("transform",`translate(${graphConfig.labelY.offsetX},${(graphConfig.margin.top + graphConfig.height - graphConfig.margin.bottom) / 2}) rotate(-90)`)
            .append('text')
            .attr('class', 'label')
            .text(`Score "${currentDimension}"`);
            
        svg.append('g')
            .attr('transform', `translate(${graphConfig.margin.left}, ${graphConfig.height - graphConfig.margin.bottom})`)
            .call(d3.axisBottom(scaleX));

        
        // legend X
        svg
            .append('g')
            .attr("transform",`translate(${(graphConfig.margin.left + graphConfig.width - graphConfig.margin.right)/2},
                ${graphConfig.margin.top + graphConfig.height - graphConfig.margin.bottom + graphConfig.labelX.offsetY})`)
            .append('text')
            .attr('class', 'label')
            .text(categoryField);



        //create color scale
        const colorScale = d3.scaleSequential(d3.interpolateInferno)
            .domain([minY, maxY]);

        //create bars 
        const Bars = svg.append('g')
            .selectAll('rect')
            .data(filteredData)
            .join('rect')
            .attr('width', scaleX.bandwidth())
            .attr('height', d => scaleY(scaleY.domain()[1]) - scaleY(d[1]))
            .attr('x', d => graphConfig.margin.left + scaleX(d[0]))
            .attr('y',  d => graphConfig.margin.top + scaleY(d[1]))
            .style('fill', d => colorScale(d[1]));

        //Add text TODO GUT ?

    }

    function init() {
        currentDimension = d3.select(`#${containerId} .select option[selected]`).attr('value')

        drawGraph();

        d3.select(`#${containerId} .select`).on('change', function(event) {
            currentDimension = event.target.value;
            drawGraph()
        });
    }
    init();
}