d3.csv("../../data/squirrelActivities.csv", d3.autoType).then(data => {
    console.log(data); // print data to the console

    const width = window.innerWidth * 0.9,
    height = window.innerHeight / 3,
    paddingInner = 0.2,
    margin = { top: 20, bottom: 40, left: 40, right: 40 };

    const svg = d3
    .select("#d3-container") // select html element with id="d3-container"
    .append("svg") // add an svg
    .attr("width", width) // set the width
    .attr("height", height); // set the height

    const render = data => {
      const xScale = d3.scaleLinear()
       .domain([0, d3.max(data, d => d.count)])
       .range([height - margin.bottom, margin.top]); 

      const yScale = d3.scaleBand()
       .domain(data.map(d => d.activity))
       .range([margin.left, width - margin.right]); 
     
      const g =svg.append(g)
      .attr('transform', '');

        g.selectAll('rect').data(data)
        .enter().append('rect')
        .attr('y', d=> yScale(d.activity))
        .attr('height', d => yScale.bandwidth())
        .attr('width', d => xScale(d.count));
    }

render (data);

});