/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.7,
  height = window.innerHeight * 0.7,
  margin = { top: 20, bottom: 50, left: 60, right: 40 },
  radius = 7;

// these variables allow us to access anything we manipulate in init() but need access to in draw().
// All these variables are empty before we assign something to them.
let svg;
let xScale;
let yScale;

/* APPLICATION STATE */
let state = {
  data: [],
  selectionDemographic: "All" // + YOUR FILTER SELECTION
};

/* LOAD DATA */
d3.csv("../data/GradsData.csv", d3.autoType).then(raw_data => {
  // + SET YOUR DATA PATH
  console.log("raw_data", raw_data);
  state.data = raw_data;
  init();
});

/* INITIALIZING FUNCTION */
// this will be run *one time* when the data finishes loading in 
function init() {
  // + SCALES
  xScale = d3
    .scaleLinear()
    .domain(d3.extent(state.data, d => d.Year))
    .range([margin.left, width - margin.right]);

  yScale = d3
    .scaleLinear()
    .domain(d3.extent(state.data, d => d.TotalGrads))
    .range([height - margin.bottom, margin.top]);

  // + AXES
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  // + UI ELEMENT SETUP

  const selectElement = d3.select("#dropdown").on("change", function() {
    // `this` === the selectElement
    // 'this.value' holds the dropdown value a user just selected

    state.selection = this.value
    console.log("new selected demographic is ", this.value);
    state.selectedDemographic = this.value;
    draw(); // re-draw the graph based on this new selection
  });

  // add in dropdown options from the unique values in the data
  selectElement
    .selectAll("option")
    .data(["All", "Asian", "Black", "Hispanic", "White"]) // + ADD UNIQUE VALUES
    .join("option")
    .attr("value", d => d)
    .text(d => d);

  // + CREATE SVG ELEMENT
  svg = d3
    .select("#d3-container")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // + CALL AXES

  // xAxis
  svg
    .append("g")
    .attr("class", "axis x-axis")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(xAxis)
    .append("text")
    .attr("class", "axis-label")
    .attr("x", "50%")
    .attr("dy", "3em")
    .text("Year");

  //  yAxis
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
    .text("Percentage of Grads");

  draw(); // calls the draw function
}

/* DRAW FUNCTION */
 // we call this everytime there is an update to the data/state
function draw() {
  let filteredData = state.data;
  // if there is a selectedParty, filter the data before mapping it to our elements
  if (state.selectedDemographic !== "All") {
    filteredData = state.data.filter(d => d.Demographic === state.selectedDemographic);
  }

  const dot = svg
    .selectAll(".dot")
    .data(filteredData, d => d.name) // use `d.name` as the `key` to match between HTML and data elements
    .join(
      enter =>
        // enter selections -- all data elements that don't have a `.dot` element attached to them yet
        enter
          .append("circle")
          .attr("class", "dot") // Note: this is important so we can identify it in future updates
          .attr("stroke", "lightgrey")
          .attr("opacity", 5)
          .attr("fill", d => {
            if (d.Demographic === "White") return "blue";
            else if (d.Demographic === "Black") return "black";
            else if (d.Demographic === "Hispanic") return "brown";
            else return "pink";
          })
          .attr("r", radius)
          .attr("cy", d => yScale(d.TotalGrads))
          .attr("cx", d => margin.left) // initial value - to be transitioned
          .call(enter =>
            enter
              .transition() // initialize transition
              .delay(d => 0.0 * d.Year) // delay on each element
              .duration(500) // duration 500ms
              .attr("cx", d => xScale(d.Year))
          ),
      update =>
        update.call(update =>
          // update selections -- all data elements that match with a `.dot` element
          update
            .transition()
            .duration(250)
            .attr("stroke", "black")
            .transition()
            .duration(250)
            .attr("stroke", "lightgrey")
        ),
      exit =>
        exit.call(exit =>
          // exit selections -- all the `.dot` element that no longer match to HTML elements
          exit
            .transition()
            .delay(d => 0.0 * d.Year)
            .duration(500)
            .attr("cx", width)
            .remove()
        )
    );
  
}
// + FILTER DATA BASED ON STATE

  // const dot = svg
  //   .selectAll("circle")
  //   .data(filteredData, d => d.name)
  //   .join(
  //     enter => enter, // + HANDLE ENTER SELECTION
  //     update => update, // + HANDLE UPDATE SELECTION
  //     exit => exit // + HANDLE EXIT SELECTION
  //   );