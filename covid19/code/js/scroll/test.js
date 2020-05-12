idname = "#scroll1_test";
d3.select(idname).select("svg").remove();
filename = "data/scroll/scroll_data_test.csv";
width_scale_factor = 0.98;
height_scale_factor = 0.3;
var bb = d3.select(idname).node().offsetWidth;
var margin = {right:0, left:0, top:0, bottom:30};
base_width = bb*width_scale_factor - margin.left - margin.right;
base_height = Math.floor(window.innerHeight * 0.95);
test(idname, filename, base_width, base_height, margin)


function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}


function test(idname, filename, width, height, margin) {

	console.log("Here");

	// parse the date / time
    var parseTime = d3.timeParse("%Y-%m-%d");

	// set the ranges
    var x = d3.scaleLinear().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    // Tooltip
    var tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip_scroll")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden");


    var svg = d3.select(idname).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g");
        //.attr("transform",
        //      "translate(" + margin.left + "," + margin.top + ")");



	d3.csv(filename, function(error, data) {
		if (error) throw error;

		data = data.filter(function(d,i){
			return i%100==0;
		})

		scroll_data = data;
		data.forEach(function(d, i) {
      		if (1) { 
      			d.id = +d.id;
				d.date = parseTime(d.date);
				d.status_change_date = parseTime(d.status_change_date); 
				d.day_id = +d.day_id;
				d.district_lat = +d.district_lat;
				d.district_long = +d.district_long;
			}
		});

		x.domain([68.7, 97.25]);
		y.domain([8.4, 37.6]);

		svg.selectAll(".dot")
			.data(data)
        .enter().append("circle")
			.attr("class", "scroll_randompos_circles circles")
			.attr("r", function(d,i) {
				return "0.15rem"
			})
			.attr("cx", function(d,i) {
				console.log(d.district_long)
				return x(d.district_long);
				//return randomNumber(0, width);
			})
			.attr("cy", function(d,i) {
				return y(d.district_lat);
				//return randomNumber(0, height);
			})
			.style("z-index", 0)
			.attr("fill", function(d,i) {
				return "#FA8072"; //"#FA8072"; //#FF0000
			})
			//.attr("stroke", "#FF0000")
			//.attr("stroke-width", "0.25px")
			.attr("opacity", 1)
			.on("mouseover", function(d, i) {
			    //d3.selectAll(".scroll_randompos_circles").style("opacity", 0.5);
			    d3.select(this).style('stroke-width', '2px').style("opacity", 1.0);
			    return tooltip.html(`<div class='well'>Case detected on `+
			    					month_abbrv_list[d.date.getMonth()]+` `+d.date.getDate()+` at `+d.district + `, `+d.state_code+
                                    `</div>`)
                              .style("visibility", "visible");
			  }
			)
			.on("mousemove", function(){
				return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
			})
			.on("mouseout", function(d, i){
			    //d3.selectAll(".scroll_randompos_circles").style("opacity", 1.0);
			    d3.select(this).style('stroke-width', '0.25px').style("opacity", 1.0);
				return tooltip.style("visibility", "hidden");
			});



	});

}