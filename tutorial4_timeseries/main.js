/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.7,
  height = window.innerHeight * 0.7,
  margin = { top: 20, bottom: 50, left: 60, right: 40 },
  radius = 8;
  default_selection = "Select a State";

// these variables allow us to access anything we manipulate in init() but need access to in draw().
// All these variables are empty before we assign something to them.
let svg;
let xScale;
let yScale;

/* APPLICATION STATE */
let state = {
  data: [],
  selectedState: "New York", // + YOUR FILTER SELECTION
};

/* LOAD DATA */
// + SET YOUR DATA PATH
d3.csv("../data/usClimate.csv", d3.autoType).then(raw_data => {
  console.log("raw_data", raw_data);
  state.data = raw_data;
  init();
});

/* INITIALIZING FUNCTION */
// this will be run *one time* when the data finishes loading in
function init() {
  // + SCALES
  xScale = d3
  .scaleTime()
  .domain(d3.extent(state.data, d => new Date(d.date)))
  .range([margin.left, width - margin.right]);

  yScale = d3
    .scaleLinear()
    .domain([0, d3.max(state.data, d => d.fahrenheit)])
    .range([height - margin.bottom, margin.top]);
  // + AXES

  const xAxis = d3.axisBottom(xScale);
        yAxis = d3.axisLeft(yScale);
        

  // + UI ELEMENT SETUP

  const selectElement = d3.select("#dropdown").on("change", function() {
    // `this` === the selectElement
    // 'this.value' holds the dropdown value a user just selected
    state.selectedState = this.value; // + UPDATE STATE WITH YOUR SELECTED VALUE
    console.log("new value is", this.value);
    draw(); // re-draw the graph based on this new selection
  });

  // add in dropdown options from the unique values in the data
  selectElement
    .selectAll("option")
    .data([
      ...Array.from(new Set(state.data.map(d => d.States))),
      default_selection,
    ])
    .join("option")
    .attr("value", d => d)
    .text(d => d);

  // + SET SELECT ELEMENT'S DEFAULT VALUE (optional)
  
  selectElement.property("value", default_selection);
  
  // + CREATE SVG ELEMENT

  svg = d3
    .select("#d3-container")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // + CALL AXES

  svg
    .append("g")
    .attr("class", "axis x-axis")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(xAxis)
    .append("text")
    .attr("class", "axis-label")
    .attr("x", "50%")
    .attr("dy", "3em")
    .text("Month");

    svg
    .append("g")
    .attr("class", "axis y-axis")
    .attr("transform", `translate(${margin.left},0)`)
    .call(yAxis)
    .append("text")
    .attr("class", "axis-label")
    .attr("y", "50%")
    .attr("dx", "-3em")
    .attr("writing-mode", "vertical-rl")
    .text("Temperature");

  draw(); // calls the draw function
}

/* DRAW FUNCTION */
// we call this everytime there is an update to the data/state
function draw() {
  // + FILTER DATA BASED ON STATE
  let filteredData;
  if (state.selectedState !== null) {
    filteredData = state.data.filter(d => d.States === state.selectedState);
  }
  yScale.domain([0, d3.max(filteredData, d => d.fahrenheit)]);

  const tooltip = d3.select("body").append("div").attr("class", "toolTip");
  const formatMonth = d3.timeFormat('%b');

  // we define our line function generator telling it how to access the x,y values for each point
  const areaFunc = d3
    .area()
    .x(d => xScale(new Date(d.date)))
    .y0(height - margin.bottom, margin.top)
    .y1(d => yScale(d.fahrenheit));
    
  const dot = svg
    .selectAll(".dot")
    .data(filteredData, d => d.date) // use `d.year` as the `key` to match between HTML and data elements
    .join(
      enter =>
        // enter selections -- all data elements that don't have a `.dot` element attached to them yet
        enter
          .append("circle")
          .attr("class", "dot") // Note: this is important so we can identify it in future updates
          .attr("r", radius)
          .attr("cy", height - margin.bottom) // initial value - to be transitioned
          .attr("cx", d => xScale(new Date(d.date)))
          .on("mousemove", function(d){
            tooltip
              .style("left", d3.event.pageX - 50 + "px")
              .style("top", d3.event.pageY - 70 + "px")
              .style("display", "inline-block")
              .html("The average temperature in " + formatMonth(new Date(d.date)) + "<br> was " + (d.fahrenheit) + "F");
        })
        .on("mouseout", function(d){ tooltip.style("display", "none");}),
      update => update,
      exit =>
        exit.call(exit =>
          // exit selections -- all the `.dot` element that no longer match to HTML elements
          exit
            .transition()
            .delay(d => d.date)
            .duration(500)
            .attr("cy", height - margin.bottom)
            .remove()
        )
    )
    // the '.join()' function leaves us with the 'Enter' + 'Update' selections together.
    // Now we just need move them to the right place
    .call(
      selection =>
        selection
          .transition() // initialize transition
          .duration(1000) // duration 1000ms / 1s
          .attr("cy", d => yScale(d.fahrenheit)) // started from the bottom, now we're here
    );
  const area = svg
    .selectAll("path.trend")
    .data([filteredData])
    .join(
      enter =>
        enter
          .append("path")
          .attr("class", "trend")
          .attr("opacity", 0), // start them off as opacity 0 and fade them in
      update => update, // pass through the update selection
      exit => exit.remove()
    )
    .call(selection =>
      selection
        .transition() // sets the transition on the 'Enter' + 'Update' selections together.
        .duration(1000)
        .attr("opacity", 1)
        .attr("d", d => areaFunc(d))
    );
}
