// data load
// reference for d3.autotype: https://github.com/d3/d3-dsv#autoType
d3.csv("../data/countries.csv", d3.autoType).then(data => {
    console.log(data);

    /** CONSTANTS */
    
    // constants help us reference the same values throughout our code
     const width = window.innerWidth / 1.5 ,
           height = window.innerHeight / 2,
           paddingInner = 0,
           margin = { top: -15, bottom: 35, left: 80, right: 100  };
    
    /** SCALES */
    // reference for d3.scales: https://github.com/d3/d3-scale

    const xScale = d3
      .scaleLinear()
      .domain([0 ,d3.max(data, d => d.turist)+10])
      .range([margin.left, width - margin.right])
      //.rangeBands([0,100]);
       console.log(xScale.domain());
       console.log(xScale.range());

    const yScale = d3
      .scaleBand()
      .domain(data.map(d => d.country))
      .range([margin.left, height]) 
      .paddingInner(paddingInner);
  
    // reference for d3.axis: https://github.com/d3/d3-axis
    const xAxis = d3.axisBottom(xScale).ticks(data.length);
    const yAxis = d3.axisLeft(yScale);
  
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
      .attr("y", d => yScale(d.country))
      .attr("x", d => xScale(0))
      .attr("width", d => xScale(d.turist)-margin.left)
      .attr("height", yScale.bandwidth()- margin.bottom - margin.top)
      .attr("fill", "rgb")
  
    // append text
    const text = svg
      .selectAll("text")
      .data(data)
      .join("text")
      .attr("class", "label")
      // this allows us to position the text in the center of the bar
      .attr("x", d => xScale(d.turist))
      .text(d => d.activity)
      .attr("y", d => yScale(d.country))
      .text(d => d.turist)
      //.attr("text-anchor", "middle")
      .attr("dy", "0.5em");
  
     svg
      .append("g")
      .attr("class", "axis")
      .attr("transform", `translate(0, ${height - margin.bottom - margin.top})`)
      .call(xAxis)
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(0)")
      .style("text-anchor", "end");

      svg
      .append("g")
      .attr("class", "axis")
      .attr("transform", `translate( ${margin.left}, ${margin.top})`)
      .call(yAxis);

  });