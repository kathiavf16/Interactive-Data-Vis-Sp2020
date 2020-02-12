// data load
// reference for d3.autotype: https://github.com/d3/d3-dsv#autoType
d3.csv("../../data/squirrelActivities.csv", d3.autoType).then(data => {
    console.log(data);

    /** CONSTANTS */
    
    // constants help us reference the same values throughout our code
    const width = window.innerWidth * 0.9,
      height = window.innerHeight / 3,
      paddingInner = 0.2,
      margin = { top: 20, bottom: 20, left: 20, right: 20 };
  
    /** SCALES */
    // reference for d3.scales: https://github.com/d3/d3-scale

    const xScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, d => d.count)])
      .range([0, width - margin.left - margin.right]);
      console.log(xScale.domain());

    const yScale = d3
      .scaleBand()
      .domain(data.map(d => d.activity))
      .range([0, height - margin.top - margin.bottom]) 
      .paddingInner(paddingInner);
  
    // reference for d3.axis: https://github.com/d3/d3-axis
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale).ticks(data.length);
  
    /** MAIN CODE */
    const svg = d3
      .select("#d3-container")
      .append("svg")
      .attr("width", width)
      .attr("height", height);
  
    // append rects
    const rect = svg
      .selectAll("rect")
      .data(data)
      .join("rect")
      .attr("y", d => yScale(d.activity))
      //.attr("x", d => xScale(d.count))
      .attr("width",d => height - margin.bottom - yScale(d.activity))
      .attr("height", yScale.bandwidth())
      .attr("fill", "steelblue")
  
    // append text
    const text = svg
      .selectAll("text")
      .data(data)
      .join("text")
      .attr("class", "label")
      // this allows us to position the text in the center of the bar
      //.attr("x", d => xScale(d.count) + (yScale.bandwidth() / 2))
      .text(d => d.activity)
      .attr("y", d => yScale(d.activity))
      .text(d => d.count)
      .attr("dy", "2em");
  
     svg
      .append("g")
      .attr("class", "axis")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(xAxis);

      svg
      .append("g")
      .attr("class", "axis")
      .attr("transform", `translate( ${margin.left}, ${margin.top})`)
      .call(yAxis);

  });