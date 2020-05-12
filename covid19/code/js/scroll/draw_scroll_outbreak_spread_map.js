
idname = "#scroll1_test";
d3.select(idname).select("svg").remove();
filename = "data/scroll/scroll_data_test.csv";
width_scale_factor = 0.90;
height_scale_factor = 0.60;
var bb = d3.select(idname).node().offsetWidth;
var margin = {right:20, left:40, top:10, bottom:60};
base_width = bb*width_scale_factor - margin.left - margin.right;
base_height = bb*height_scale_factor - margin.top - margin.bottom;
draw_scroll_outbreak_spread_map(idname, filename, base_width, base_height);

function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

function draw_scroll_outbreak_spread_map(idname, filename, width, height) {

	// set the ranges
    var x = d3.scaleLinear().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

	var scale0 = (width - 1) / 2 / Math.PI;
	var month_list = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

	var tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip_outbreak_spread")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden");

	// parse the date / time
    var parseTime = d3.timeParse("%Y-%m-%d");

    /* Projection */
    /*
    var projection = d3.geoNaturalEarth2() //d3.geoNaturalEarth2() //d3.geoTimes() d3.geoWagner4() geoEquirectangular()
        .scale(width / 1.5 / Math.PI)
        .translate([width / 2.5, height / 1.5])

    var projection = d3.geoAlbers()
	    .center([23.5937, 80.9629])
	    //.rotate([4.4, 0])
	    //.parallels([50, 60])
	    .scale(6000)
	    .translate([width / 2, height / 2]);
	*/
	var projection = d3.geoMercator();

    var path = d3.geoPath()
        .projection(projection)
        .pointRadius(5);


    /* Zoom */
	var zoom = d3.zoom()
	    .scaleExtent([1, 8])    //.scaleExtent([scale0, 8 * scale0])
	    .on("zoom", zoomed);

	/* SVG */
	var svg = d3.select(idname).append("svg")
              .attr("width", width)
              .attr("height", height)
              .append("g")
              .call(zoom);
    var g = svg.append("g");
    var g2 = svg.append("g");


    // Load external data and boot
    d3.queue()
        .defer(d3.json, "data/india_topojson.json")
        .defer(d3.csv, filename) //, data_ready)
        .await(ready);

    function ready(error, india, data) {
        if (error) throw error;

        //data = scroll_data;
        data = data.filter(function(d,i){
			return i%100==0;
			//return i==0;
		})
		//data = data.filter(function(d,i) {
		//	return +d.district_long!=0;
		//})
        //console.log(data);


        // Zoom to India
        var o = topojson.mesh(india, india.objects.india, function(a, b) { return a === b; });
      	projection
          .scale(1)
          .translate([0, 0]);
		var b = path.bounds(o),
		  s = 1 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
		  t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];
        projection = projection.scale(s).translate(t);

        path = d3.geoPath()
	        .projection(projection)
	        .pointRadius(2);

        start_date = new Date(2020, 2, 1); //Start from March
        end_date = new Date(2020, 4, 7); //Start from March
		//end_date = new Date(data[data.length-1].date);
		num_sim_days = Math.ceil(Math.abs(end_date - start_date) / (1000 * 60 * 60 * 24)) - 1;
		num_milliseconds_per_date = 500;
		total_sim_duration = num_sim_days * num_milliseconds_per_date;


		
        g.attr("class", "india")
			.selectAll("india_path")
	      .data(topojson.feature(india, india.objects.india).features)
          .enter().append("path")
          	.attr("class", "country_focus")
			.attr("d", path)
			.style("fill", "#fff")
			.style("stroke", "#c0c0c0")


        // Form list of network arcs
        var link = [];
		data.forEach(function(d, i){
			d.date = parseTime(d.date);
			d.status_change_date = parseTime(d.status_change_date);
			d.num_cases = 0;
			//console.log(+d.district_long);

			//if ( (!isNaN(+d.district_long)) && (!isNaN(+d.district_lat)) ) {
			if ( (+d.district_long!=0) && (+d.district_lat!=0) ) {
				case_location = [+d.district_long, +d.district_lat]
				topush = {type: "Point", coordinates: case_location, date: d.date, status: d.status,
							district: d.district, num_cases: +d.num_cases, status_change_date: d.status_change_date}
				link.push(topush)
			}
		})
		

		data.forEach(function(d,i) {
			d.date = parseTime(d.date);
			d.status_change_date = parseTime(d.status_change_date);
			d.district_lat = +d.district_lat;
			d.district_long = +d.district_long;
			d.state_long = +d.state_long;
			d.state_lat = +d.state_lat;
		});


		//console.log(data);

		/*
		x.domain(data.map(function(d) {
			return d.district_long;
		}));
		y.domain(data.map(function(d) {
			return d.district_lat;
		}));
		*/

		//x.domain([68.7, 97.25]);
		//y.domain([8.4, 37.6]);
		/*
        g.append("path")
	      .datum({type: "MultiPoint", coordinates: data})
	      .attr("class", "outbreak_spread_cases")
	      .attr("d", path)
	      .style("opacity", 0);
		*/

		//console.log(link);

		/*
	    // Add the path
		g.selectAll("myPath")
			.data(link)
			.enter()
			.append("path")
				.attr("class", "outbreak_spread_cases")
				.attr("d", path)
				.style("opacity", 1)
				.style("fill", "#FA8072")  // #f032e6
				.style("stroke", "none")
				.on("mouseover", function(d,i) {
                	return tooltip.html(`<div class='well'>`+
                                              `<span class="state_name text-center">`+d.district+`</span></br>` +
                                            ` Total <span class="case_count_info">`+ d.num_cases +`</span>  cases</div>` )
                                      .style("visibility", "visible");
                })
                .on("mousemove", function(){
                    return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
                })
                .on("mouseout", function(d,i) {
                    return tooltip.style("visibility", "hidden");
                })
            .transition()
            	.duration(1000)
            	.attr("d", path2);
        */

        
        g2.selectAll("dot")
        	.data(data)
        	.enter()
        	.append("circle")
				.attr("class", "outbreak_spread_circles circles")
				.attr("cx", function(d,i){
					//console.log(projection([d.district_long, d.district_lat])[0]);
					return projection([d.district_long, d.district_lat])[0];
					//return x(d.district_long);
					//console.log(d);
					//return randomNumber(0, width);
				})
				.attr("cy", function(d,i){
					//console.log(y(d.district_lat));
					//return y(d.district_lat);
					//return randomNumber(0, height);
					return projection([d.district_long, d.district_lat])[1];
				})
				.attr("r", "0.15rem")
				.style("fill", "#0000FF")
				.style("opacity", 1)
			.transition()
				.duration(3000)
				.attr("cx", function(d,i){
					console.log(projection([d.state_long, d.state_lat])[0]);
					return projection([d.state_long, d.state_lat])[0];
					//return x(d.district_long);
					//console.log(d);
					//return randomNumber(0, width);
				})
				.attr("cy", function(d,i){
					//console.log(y(d.district_lat));
					//return y(d.district_lat);
					//return randomNumber(0, height);
					return projection([d.state_long, d.state_lat])[1];
				});

		

		current_date = start_date;
		function update_date() {
			// Add a day
			current_date.setDate(current_date.getDate() + 1);
			if (current_date <= end_date) {
				g.selectAll(".outbreak_spread_map_date_label").remove();
				//g.selectAll(".cluster_map_casecount_label").remove();

				g.append("text")
					.attr("class", "outbreak_spread_map_date_label")
					.attr("x", width-120)
					.attr("y", 40)
					.text(current_date.getDate() + " " + month_list[current_date.getMonth()])
					.style("font-size", "2rem")
					.style("font-weight", "bold")
					.style("stroke", "none")
					.style("fill", "black");

				/*
				g.append("text")
					.attr("class", "cluster_map_casecount_label")
					.attr("x", width-120)
					.attr("y", 60)
					.text(numberWithCommas(daily_cum_cases_count[current_date]) + " cases")
					.style("font-size", "1rem")
					//.style("font-weight", "bold")
					.style("stroke", "none")
					.style("fill", "#404040");

				*/
				
				g.selectAll(".outbreak_spread_cases")
					.transition()
					.duration(10)
						.style("opacity", function(d, i) {
							dt = d.date;
							if (current_date >= dt) {
								return 1;
							} else {
								return 0;
							}
							//return 1;
						})
						.style("fill", function(d, i) {
							if (current_date >= d.status_change_date) {
								if (d.status == "Recovered") {
									return "#229954";
								} else if (d.status == "Deceased") {
									return "#000000";
								} else if (d.status == "Hospitalized") {
									return "#FA8072";
								}
							} else {
								return "#FA8072";
							}
						});
			}
		}

		for (let i=1; i<=num_sim_days; i++) {
			//setTimeout( update_date, i*num_milliseconds_per_date );
		}


    }


    // When cases data is loaded do this
	function data_ready(d) {
		d[0] = +d.longitude;
		d[1] = +d.latitude;
		return d;
	}

	// Zoom functionality
	function zoomed() {
		g.style("stroke-width", 1 / d3.event.transform.k + "px");
      	g.selectAll('path') // To prevent stroke width from scaling
        	.attr('transform', d3.event.transform);
		g.selectAll(".country_focus").style("stroke-width", d3.event.transform.k/10 + "px").style("stroke", "#000");
    }

    function numberWithCommas(x) {
    	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}

}