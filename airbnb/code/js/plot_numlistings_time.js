var minDeviceWidth = 375;
var maxDeviceWidth = 1024;

idname = "#numlistings_time_plot";
width_scale_factor = 0.95;
height_scale_factor = 0.60;
var bb = d3.select(idname).node().offsetWidth;
var margin = {right:80, left:60, top:40, bottom:30};
base_width = bb*width_scale_factor - margin.left - margin.right;
base_height = bb*height_scale_factor - margin.top - margin.bottom;
city = "New York City";
plot_city_numlistings_time(idname, base_width, base_height, city);

function plot_city_numlistings_time(idname, width, height, city) {

    // Scale for axis label font size
    var axisLabelFontSizeScale = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([8, 16]);

    // Scale for axis label font size
    var textLabelFontSizeScale = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([10, 20]);

    // Scale for axis label font size
    var cityLabelFontSizeScale = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([8, 20]);

    // Scale for tick label font size
    var tickLabelFontSizeScale = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([10, 20]);

    var theme_font_color = "white";
    /*
    // set the dimensions and margins of the graph
    var margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;
    */
    // parse the date / time
    var parseTime = d3.timeParse("%Y-%m-%d");

    // set the ranges
    var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    // define the line
    var valueline = d3.line()
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.num_listings); });

    // append the svg obgect to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3.select(idname).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

    // gridlines in x axis function
    function make_x_gridlines() {
        return d3.axisBottom(x)
            .ticks(5);
    }

    // gridlines in y axis function
    function make_y_gridlines() {
        return d3.axisLeft(y)
            .ticks(5);
    }

    // Get the data
    d3.csv("data/num_listings_over_time.csv", function(error, data) {
      if (error) throw error;

      // format the data
      data.forEach(function(d) {
          d.date = parseTime(d.date);
          d.num_listings = +d.num_listings;
      });


      //var city_list = ["New York City", "Paris", "London", "San Francisco", "Los Angeles", "Barcelona", "Amsterdam", "Berlin"];
      //var city_color_list = ["#e6194b", "#911eb4", "#ffe119", "#42d4f4", "#4363d8", "#3cb44b", "#f032e6", "#f58231"];

      var city_list = ["New York City", "Paris", "London", "San Francisco", "Los Angeles", "Barcelona", "Berlin"];
      var city_color_list = ["#e6194b", "#911eb4", "#ffe119", "#42d4f4", "#4363d8", "#3cb44b", "#f58231"];

      var critical_dates_list = [{"city":"Barcelona", "date": parseTime("2018-06-09"), "num_listings": 17221, "description": "Crackdown"}];

      var alldata = [];

      for(var i=0; i<city_list.length; i++) {
        alldata[i] = data.filter(function(d) { return d.city  == city_list[i]; });
      }

      // Scale the range of the data
      x.domain(d3.extent(data, function(d) { return d.date; }));
      y.domain([0, d3.max(data, function(d) { return d.num_listings; })]);


      // Tooltip
      var tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip_numlistings_time")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden");


      // add the X gridlines
      svg.append("g")
          .attr("class", "num_listings_time_grid")
          .attr("transform", "translate(0," + height + ")")
          .call(make_x_gridlines()
              .tickSize(-height)
              .tickFormat("")
          );

      // add the Y gridlines
      svg.append("g")
          .attr("class", "num_listings_time_grid")
          .call(make_y_gridlines()
              .tickSize(-width)
              .tickFormat("")
          );

      for (i=0; i<alldata.length; i++) {
        // add the valueline path.
        svg.append("path")
            .data([alldata[i]])
            .attr("class", "num_listings_time_line")
            .style("stroke", city_color_list[i])
            .style("stroke-width", 3)
            .attr("d", valueline);

        // Append city label
        svg.append("text")
            .attr("class", "label_histogram")
            .attr("x", x(alldata[i][alldata[i].length-1]["date"])+5)
            .attr("y", y(alldata[i][alldata[i].length-1]["num_listings"]))
            .text(city_list[i])
            .style("fill", theme_font_color)
            .style("font-size", cityLabelFontSizeScale(width));

      }

      svg.selectAll(".dot")
          .data(critical_dates_list)
        .enter()
          .append("circle")
          .attr("class", "dot")
          .attr("r", 4)
          .attr("cx", function(d) { return x(d.date); })
          .attr("cy", function(d) { return y(d.num_listings); })
          .style("fill", "black")
          .style("stroke", "white")
          .style("stroke-width", "1.0px")
          .style("z-index", 1)
          .on("mouseover", function(d) {
            //return tooltip.text(d.city).style("visibility", "visible");
            d3.select(this).style('stroke', theme_font_color).style("stroke-width", 2).style("stroke-opacity", 1.0);
            return tooltip.html("<div class='well'><span class='city_name'><b>"+d.description+"</b></span><br/>" +"</div>" ).style("visibility", "visible");
          })
          .on("mousemove", function(){
            return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
          })
          .on("mouseout", function(){
            d3.select(this).style('stroke', "white").style("stroke-width", 1).style("stroke-opacity", 1.0);
            return tooltip.style("visibility", "hidden");
          });

/*
      // add the X Axis
      svg.append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x))
          .style("stroke", "white");

      // add the Y Axis
      svg.append("g")
          .call(d3.axisLeft(y))
          .style("stroke", "white");
*/

      // add the x Axis
      svg.append("g")
          .attr("transform", "translate(0," + height + ")")
          .attr("class", "label_histogram axis--y")
          .call(d3.axisBottom(x)
                .tickPadding(5))
          .style("font-size", axisLabelFontSizeScale(width))
        .append("text")
          .attr("class", "label_histogram")
          .attr("x", width)
          .attr("y", -40)
          .style("text-anchor", "end")
          //.text("Price [USD]")
          .style("fill", theme_font_color)
          .style("font-size", axisLabelFontSizeScale(width));

      // add the y Axis
      svg.append("g")
          .attr("class", "label_histogram axis--y")
          .call(d3.axisLeft(y)
              .tickFormat( (d,i) => {
                if (d%5000 === 0) return d;
              })
              .tickPadding(5))
          .style("font-size", axisLabelFontSizeScale(width))
        .append("text")
          .attr("class", "label_histogram")
          .attr("transform", "rotate(-90)")
          .attr("x", 0)
          .attr("y", -50)
          .style("text-anchor", "end")
          .text("Number of listings")
          .style("fill", theme_font_color)
          .style("font-size", textLabelFontSizeScale(width));
      

      svg.selectAll("text")
        .attr("class", "label")
        .style("fill", theme_font_color)
        .style("shape-rendering", "crispEdges");

      svg.selectAll(".axis--y path")
        .style("stroke", theme_font_color)
        .style("font-size", axisLabelFontSizeScale(width));

      svg.selectAll(".axis--x path")
        .style("stroke", theme_font_color)
        .style("font-size", axisLabelFontSizeScale(width));

      svg.selectAll("line")
        .style("stroke", theme_font_color)
        .style("stroke-width", 0.25)
        .style("font-size", axisLabelFontSizeScale(width));
        //.style("visibility", "hidden");

    });

}