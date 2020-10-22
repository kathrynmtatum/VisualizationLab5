//Initialize chart
let type = document.querySelector("#group-by").value;
let sort = 1
console.log(type, sort)

//Create margins
const margin = {top:20, left:60, bottom:40, right:20};
const width = 650-margin.left-margin.right;
const height = 500-margin.top-margin.bottom;

//Create svg
const svg = d3
  .select('.chart')
  .append('svg')
  .attr('width', width+margin.left+margin.right)
  .attr('height', height+margin.top+margin.bottom)
  .append('g')
  .attr('transform', 'translate('+margin.left+','+margin.right+')')

//Create x and y scales
const xScale = d3
  .scaleBand()
  .range([0, width])
  .paddingInner(0.1);

const yScale = d3
  .scaleLinear()
  .range([height, 0]);

//Create axis
const xAxis = d3
  .axisBottom()
  .scale(xScale)
  .tickFormat(function(d) {
    return formatTick(d, 50);
  });
function formatTick(content) {
  return content; }

const yAxis = d3.axisLeft().scale(yScale);

//Append axis to SVG  
let xAxisContainer = svg.append('g')
  .attr("class", "axis x-axis")
  .call(xAxis)
  .attr("transform", `translate(0, ${height})`)
let yAxisContainer = svg.append('g')
  .attr("class", "axis y-axis")
  .call(yAxis)
  .attr("transform", `0, translate(${width})`)

//CREATE UPDATE FUNCTION
function update(data, type) {
  type = document.querySelector("#group-by").value;

  //Scale domains
  xScale.domain(data)
  yScale.domain(d3.extent(data));

  //Update domains
  console.log("updating", type)
  if(sort == 1 && type == "stores"){
      data = data.sort(function(a,b){
          return b.stores-a.stores
      })
  } else if(sort == 1 && type == "revenue"){
      data = data.sort(function(a,b){
          return b.revenue-a.revenue
      })
  } else if (sort == 0 && type == "stores"){
      data = data.sort(function(a,b){
          return a.stores-b.stores})
  } else {
      data = data.sort(function(a,b){
          return a.revenue-b.revenue}
      )
    }

    xScale.domain(data.map(function(d) {
        return d.company;
    }));
    yScale.domain([0,d3.max(data, d=>d[type])]);

  //Update bars
  svg.selectAll(".bar1")
    .transition() 
    .duration(2000)
    .attr("x", function(d) {
      return xScale(d.company);
  })
  .attr("y", function(d) {
    return yScale(d[type]);
  })
  .attr("height", function(d) {
    return height - yScale(d[type]);
  })
  .attr("width", xScale.bandwidth())

  //Update axes
   xAxisContainer = svg
    .select(".x-axis")
    .transition()
    .duration(1000)
    .delay(500)
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  yAxisContainer = svg
    .select(".y-axis")
    .transition()
    .duration(1000)
    .delay(1000)
    .call(yAxis);

  //Update axes title
  svg.select("text.axis-title").remove();
  svg.append("text")
    .attr("class", "axis-title")
    .attr("x", -20)
    .attr("y", -9)
    .attr("dy", ".1em")
    .text(function() {
        if (document.querySelector("#group-by").value == 'stores'){
            return "Stores"
        } else{
            return "Billions of USD"
        }
    });

  //Create dropdown menu
  d3.select(".sort")
  .on("click", function(d) {
      console.log("clicked")
      if (sort == 1){
          sort = 0
      } else {
          sort = 1
      }
      console.log(sort)
  });
}
  
d3.csv('coffee-house-chains.csv', d3.autoType).then(data => {
  console.log('coffee-data', data);
  let bar1 = svg
    .selectAll(".bar1")
    .remove()
    .exit()
    .data(data);

  xScale.domain(data.map(function(d) {
    return d.company;}));
  yScale.domain([0,d3.max(data, d=>d[type])]);
  
  
  bar1
    .enter()
    .append("rect")
    .attr("class", "bar1")
    .attr('fill', '#FFCB5D')
    .attr("x", function(d) {
        return xScale(d.company);
      })
      .attr("y", function(d) {
        return yScale(d.stores);
      })
      .attr("height", function(d) {
        return height - yScale(d.stores);
      })
      .attr("width", xScale.bandwidth())  
  
    update(data,type);
  })
  
  function callUpdate(){
    d3.csv('coffee-house-chains.csv', d3.autoType).then(data => {
        type = document.querySelector("#group-by").value;
        console.log(data)
        update(data, type);
  });
}