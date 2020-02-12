// data load
// reference for d3.autotype: https://github.com/d3/d3-dsv#autoType
/** 'd3.autotype' is a function that goes over
 * each row in the data and tries to guess what data type it is supposed to be
 * */
d3.csv("../../data/squirrelActivities.csv", d3.autoType).then(data => {
  console.log(data); // print data to the console

  /** CONSTANTS */
  // constants help us reference the same values throughout our code
  const width = window.innerWidth * 0.9,
    height = window.innerHeight / 3,
    paddingInner = 0.2,
    margin = { top: 20, bottom: 40, left: 40, right: 40 };

  /** SCALES */
  // reference for d3.scales: https://github.com/d3/d3-scale

  /** scales returns a function
   * that takes a value from your data domain
   * and returns a value from your range.*/
  const xScale = d3
    .scaleBand() // set up a band scale
    .domain(data.map(d => d.activity)) // set the x domain to all the `activities` in the data
    .range([margin.left, width - margin.right]) // set the range to the width of the screen (offset by margins)
    .paddingInner(paddingInner); // sets the inner padding of the scaleBand

  const yScale = d3
    .scaleLinear() // set up a linear scale
    .domain([0, d3.max(data, d => d.count)]) // set the y domain to 0 to the maximum value of `count` in the data
    .range([height - margin.bottom, margin.top]); // set the range to be the height of the screen (offset by margins)
  /** NOTE: remember that (0,0) is the TOP-left of the screen -- that's why we map 0 to the height of the screen */

  // reference for d3.axis: https://github.com/d3/d3-axis
  // set up a `bottom` oriented axis based on the xScale we defined above.
  const xAxis = d3.axisBottom(xScale).ticks(data.length);

  /** MAIN CODE */
  const svg = d3
    .select("#d3-container") // select html element with id="d3-container"
    .append("svg") // add an svg
    .attr("width", width) // set the width
    .attr("height", height); // set the height

  // append rects
  const rect = svg // select the svg we just created
    .selectAll("rect") // select all `rects` (remember -- this selects them whether they exist yet or not)
    .data(data) // map our data to these selected `rect` elements
    .join("rect") // make sure there is a `rect` for EVERY data element
    .attr("y", d => yScale(d.count)) // set the y value of the top-left corner of each `rect` to the scaled value of each data element's `count`
    .attr("x", d => xScale(d.activity)) // set the x value of the top-left corner of each `rect` to the scaled value of each data element's `activity`
    .attr("width", xScale.bandwidth()) // set the width to the x scales band width
    .attr("height", d => height - margin.bottom - yScale(d.count)) // set the height to the difference between the height and the scaled y value
    .attr("fill", "steelblue"); // set the color of each `rect`

  // append text
  const text = svg // select the same svg from before
    .selectAll("text") // select all `text` elements (whether they exist yet or not)
    .data(data) // map our data to these `text` elements
    .join("text") // make sure there is a `text` element for each row of data
    .attr("class", "label") // set the class of each `text` element to label so that we can style it
    .attr("x", d => xScale(d.activity) + xScale.bandwidth() / 2) // set the x position of the `text`, then center it to the middle of the bar
    .attr("y", d => yScale(d.count)) // set the y position of the `text` element
    .text(d => d.count) // set the content of the `text` element
    .attr("dy", "1.25em"); // move the text a little further down so that it sits within the bar

  svg // select the same svg element
    .append("g") // add a `g`, or `group` element
    .attr("class", "axis") // give the `g` element a class `axis`
    .attr("transform", `translate(0, ${height - margin.bottom})`) // move the element to the bottom of the chart (hint: try commenting this line out to see what it does)
    .call(xAxis); // call the xAxis we defined above into the `g` element we just created
});
