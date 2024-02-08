// Dimensions for the chart
const width = 800;
const height = 400;
const margin = { top: 20, right: 20, bottom: 50, left: 60 };

// Select the container for the chart
const svg = d3
  .select("#bar-chart")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Load data
d3.json(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
)
  .then((data) => {
    // Data parsing
    const yearsDate = data.data.map((item) => new Date(item[0]));
    const GDP = data.data.map((item) => item[1]);

    // Create x scale
    const xScale = d3
      .scaleTime()
      .domain([d3.min(yearsDate), d3.max(yearsDate)])
      .range([0, width]);

    // Create y scale
    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(GDP)])
      .range([height, 0]);

    // Create x-axis
    const xAxis = d3.axisBottom(xScale);

    // Append x-axis to SVG
    svg
      .append("g")
      .attr("id", "x-axis")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis);

    // Create y-axis
    const yAxis = d3.axisLeft(yScale);

    // Append y-axis to SVG
    svg.append("g").attr("id", "y-axis").call(yAxis);

    // Create bars
    svg
      .selectAll(".bar")
      .data(GDP)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d, i) => xScale(yearsDate[i]))
      .attr("y", (d) => yScale(d))
      .attr("width", width / GDP.length)
      .attr("height", (d) => height - yScale(d))
      .style("fill", "#333")
      .attr("data-date", (d, i) => data.data[i][0])
      .attr("data-gdp", (d) => d)
      .on("mouseover", function (event, d) {
        // Overlay effect
        d3.select(this).style("fill", "#fff");
        // Show tooltip on mouseover
        const tooltip = d3.select("#tooltip");
        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip
          .html(
            `${d3.timeFormat("%Y")(
              d3.timeParse("%Y-%m-%d")(this.getAttribute("data-date"))
            )}<br>$${d
              .toFixed(1)
              .replace(/(\d)(?=(\d{3})+\.)/g, "$1,")} Billion`
          )
          .attr("data-date", this.getAttribute("data-date"))
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 30}px`);
      })
      .on("mouseout", function () {
        // Overlay effect
        d3.select(this).style("fill", "#333");
        // Hide tooltip on mouseout
        d3.select("#tooltip").transition().duration(200).style("opacity", 0);
      });
  })
  .catch((error) => console.log("Error loading data:", error));
