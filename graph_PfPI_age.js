function graphPfPI() {
    let dataPfPI_age = null; // store the data and enable to reuse it
    let currentDimension = 'Extraversion'; // set language by default, the same as used un html

    function drawGraph(){
        d3.select('#dimensionGraph').remove();
        
        
        //grouper les scores de dimensions par age en moyenne
        let filteredData = d3.rollup(globalData,
            v => d3.mean(v,d => d[currentDimension]),
            d => d.Âge)
        // enlever valeur isolée
        filteredData.delete(43)
        console.log(filteredData)

        const svg = d3.select('.fiveDimensions')
            .append('svg')
            .attr('width', graphConfig.width)
            .attr('height', graphConfig.height)
            .attr('id', 'dimensionGraph') // add id to find and remove svg
            .attr('style', 'font: 10px sans-serif');  
            
        // Horizontal scale
        const scaleX = d3.scaleBand()
            .domain(Array.from(filteredData.keys()))
            .range([graphConfig.margin.left, graphConfig.width - graphConfig.margin.right])
            .padding(0.3)
            .round(true) //arrondir les valeurs a pixel pres

        // Vertical scale
        const scaleY = d3.scaleLinear()
            .domain([d3.max(filteredData, d => d[1]), d3.min(filteredData, d => d[1])])
            .range([graphConfig.margin.top, graphConfig.height - graphConfig.margin.bottom]);
        
        svg.append('g')
            .attr('transform', `translate(60, 0)`)
            .call(d3.axisLeft(scaleY)
            //.tickFormat((d,i) => d+'%')
            );
            
            
        svg.append('g')
            .attr('transform', `translate(${graphConfig.margin.left}, ${graphConfig.height - graphConfig.margin.bottom})`)
            .call(d3.axisBottom(scaleX));



        //create color scale
        const colorScale = d3.scaleSequential(d3.interpolateInferno)
            .domain([d3.min(filteredData, d => d[1]), d3.max(filteredData, d => d[1])]);

        //create bars 
        const Bars = svg.append('g')
            .selectAll('rect')
            .data(filteredData)
            .join('rect')
            .attr('width', 10) // TODO fix width
            .attr('height', d => scaleY(0) - scaleY(d[1]))
            .attr('x', d => graphConfig.margin.left + scaleX(d[0]))
            .attr('y',  d => scaleY(d[1]))
            .style('fill', d => colorScale(d[1]));

        //Add text
        const Texte = svg.append('g')
            .style('fill', 'rgb(57,91,113)')
            .attr('text-anchor','end')
            .selectAll('text')
            .data(filteredData)
            .enter()
            .append('text')
            .attr('x', d => graphConfig.margin.left + scaleX(d.year) + 10 )
            .attr('y', d => scaleY(d.value)-5)
            .text(d => d.value);
    }

    function init() {
        drawGraph();
        
        d3.select('#personnalityDimension').on('change', function(event) {
            currentDimension = event.target.value;
            drawGraph()
        });
    }
    init();
}