    // load in csv
d3.csv("../data/jackpotData.csv").then(data => {
    // once the data loads, console log it
  console.log("data", data);

    // select the `table` container in the HTML
  const table = d3.select("#d3-censusTable");

   /** HEADER */
  const thead = table.append("thead");
  thead
    .append("tr")
    .append("th")
    .attr("colspan", "11")
    .text("List of U.S. lottery drawings of $300 million or more (annuity value) with at least one jackpot-winning ticket (dollar amounts in millions) ")

  thead
    .append("tr")
    .selectAll("th")
    .data(data.columns)
    .join("td")
    .text(d => d);

   /** BODY */
   // rows
  const rows = table
    .append("tbody")
    .selectAll("tr")
    .data(data)
    .join("tr")
    
    // cells
  rows
    .selectAll("td")
    .data(d => Object.values(d))
    .join("td")
    // update the below logic to apply to your dataset
    .attr("class", d => (+d > 400  ? "high" : "low"))
    .text(d => d);
  
    // TABLE FOOT

  const tfoot = table.append("tfoot");
  let total = d3.sum(data.map(function(d){return d.Jackpot} ));
   
  tfoot
    .append("tr")
    .append("th")
    .attr("colspan", "11")
    .text("Totals of Millions in Jackpot Prizes : " + Math.round(total) + ".00");

    tfoot
    .append("tr")
    .selectAll("th")
    .data(data.columns)
});
