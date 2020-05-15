
			
function hide_state_testing_plot_circles(idname) {
	d3.select(idname).selectAll(".state_center_overall_circles")
    	.transition()
    		.duration(1000)
    		.style("opacity", 0);
}

function show_countries_testing_all(idname, width, height) {
	// set the ranges
    var x = d3.scaleLinear().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    x.domain([0, d3.max(scroll_country_data, function(d) { return d.testspm; })]);
	y.domain([0, d3.max(scroll_country_data, function(d) { return d.casespm; })]);


	d3.select(idname)
		.selectAll(".scroll_country_circles")
		.transition()
		.duration(1000)
			.attr("cx", function(d,i){
				return x(d.testspm);
			})
			.attr("cy", function(d,i){
				console.log(d);
				return y(d.casespm);
			})
			.attr("r", function(d,i) {
				return d.cases/3e4;
			});
}



function show_countries_testing_low(idname, filename, width, height) {
	// set the ranges
    var x = d3.scaleLinear().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    var g4 = svg_map.append("g");

    // Load external data and boot
    d3.queue()
        .defer(d3.csv, filename) //, data_ready)
        .await(ready);

    function ready(error, data) {
        if (error) throw error;

    
	    data.forEach(function(d, i) {
	  		if (1) { 
	  			d.country = d.country;
	  			d.cases = +d.total_cases;
	  			d.testspm = (+d.total_tests_per_thousand)*1000;
	  			d.casespm = +d.total_cases_per_million;
			}
		});
		scroll_country_data = data;

		//x.domain([0, d3.max(scroll_country_data, function(d) { return d.testspm; })]);
		x.domain([0, 5000]);
	    y.domain([0, d3.max(scroll_country_data, function(d) { return d.casespm; })]);

	    g4.selectAll("dot")
	    	.data(data)
	    	.enter()
	    	.append("circle")
				.attr("class", "scroll_country_circles circles")
				.attr("cx", function(d,i){
					return x(d.testspm);
				})
				.attr("cy", function(d,i){
					console.log(d);
					return y(d.casespm);
				})
				.attr("r", function(d,i) {
					return d.cases/2e3;
				})
				.style("fill", "#FF0000")
				.style("opacity", 0)
			.transition()
				.duration(1000)
				.style("opacity", 1);

	}

}

function plot_state_testspm_vs_casespm(idname, width, height) {

	// set the ranges
    var x = d3.scaleLinear().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    //x.domain([0, d3.max(scroll_state_data, function(d) { return d.testspm; })]);
    x.domain([d3.min(data, function(d) { return d.testspm; })-50, d3.max(data, function(d) { return d.testspm; })+200]);
    y.domain([0, d3.max(scroll_state_data, function(d) { return d.casespm; })+50 ]);

    d3.select(idname).selectAll(".state_scroll_circles")
    	.style("opacity", function(d,i) {
			if (scroll_show_state_list.includes(d.state_code)) {
				return 1;
			} else {
				return 0;				
			}
    	})
    	.transition()
    		.duration(2000)
			.attr("cx", function(d,i){
				return x(d.testspm);
			})
			.attr("cy", function(d,i){
				return y(d.casespm);
			});

    d3.select(idname).selectAll(".state_scroll_text")
    	.transition()
    		.duration(2000)
			.attr("x", function(d,i){
				return x(d.testspm);
			})
			.attr("y", function(d,i){
				return y(d.casespm);
			});


	var yAxis = d3.axisLeft(y)
		      	.tickFormat( (d,i) => {
		          if (d%50 === 0) return d;
		      	}).tickPadding(2);

	// Add the Y Axis
	g4.append("g")
		//.attr("transform", "translate("+(width)+",0)")
		//.call(d3.axisLeft(y))
		.call(yAxis)
		.attr("class", "state_fatality_yaxis")
		.style("font-size", "0.75rem")
	.append("text")
		.attr("class", "state_fatality_label")
		.attr("transform", "rotate(-90)")
		.attr("x", 0)
		.attr("y", 15)
		.style("text-anchor", "end")
		.text(function(){
		  return "Cases per million people";
		})
		.style("fill", "black")
		.style("stroke", "none")
		.style("font-weight", "bold")
		.style("font-size", "0.75rem");

}


function sort_state_circles_by_test_count(idname, width, height, margin) {

    d3.select(idname).selectAll(".state_scroll_circles").remove();
	d3.select(idname).selectAll(".outbreak_spread_circles").remove();
    d3.select(idname).selectAll(".state_center_overall_circles").remove();
	var colorScale = d3.scaleSequential(d3.interpolateRdYlGn);
	var tooltip = d3.select("body")
                      .append("div")
                      .attr("class", "tooltip_scroll_state_circles")
                      .style("position", "absolute")
                      .style("z-index", "10")
                      .style("visibility", "hidden");

	// set the ranges
    var x = d3.scaleLinear().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);


    data = scroll_state_data;
    data = data.filter(function(d,i){
    	return d.cases >= 50;
    });
    x.domain([d3.min(data, function(d) { return d.testspm; })-50, d3.max(data, function(d) { return d.testspm; })+200]);

    g4 = svg_map
		.append("g")
      	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");


	g4.selectAll("dot")
	    	.data(data)
	    	.enter()
	    	.append("circle")
				.attr("class", "state_scroll_circles circles")
				.attr("cx", function(d,i){
					console.log(d);
					console.log(x(d.testspm));
					return x(d.testspm);
				})
				.attr("cy", function(d,i){
					return 0.5 * height;
				})
				.attr("r", function(d,i) {
					return d.cases/4000 + "rem"; //Math.log10(d.cases)+"rem"; //d.cases/250;
				})
				.style("fill", function(d) {
					//return "#FF0000";
                	if (isNaN(d.ntod)) {
                		return "#c0c0c0";
                	} else {
                		if (d.state_code=="KL") {
                			return colorScale(1);
                		} else {
	                    	return colorScale(d.ntod/20);
                		}
                	}
                })
                .style("stroke", "#fff")
                .style("stroke-width", 2)
				.on("mouseover", function(d) {
					d3.select(this).style('stroke', 'black').style("stroke-width", 2).style("stroke-opacity", 1.0);
					return tooltip.html(`<div><span class="scroll_circle_state_name">`+ d.state+`</span></br>` +
								`<span class="scroll_circle_state_fact">`+ d.cases+`</span> Cases, <span class="scroll_circle_state_fact">`+ d.deaths+`</span> Deaths</br>` + 
								`<span class="scroll_circle_state_fact">`+ d.testspm+`</span> Tests per million, <span class="scroll_circle_state_fact">`+ d.casespm+`</span> Cases per million` + 
								`</div>`)
					    .style("visibility", "visible");
                })
                .on("mousemove", function() {
					if (event.pageX >= window.innerwidth/2) {
					return tooltip.style("top", (event.pageY-10)+"px").style("right",(width-event.pageX-100)+"px");
					} else {
					  return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
					}
                })
                .on("mouseout", function() {
					d3.select(this).style('stroke', '#fff').style("stroke-opacity", 1.0);
					return tooltip.style("visibility", "hidden");
                })
				.style("opacity", 0)
				.transition()
					.duration(2000)
					.style("opacity", 1);


	g4.selectAll("text")
    	.data(data)
    	.enter()
    	.append("text")
			.attr("class", "state_scroll_text text")
			.attr("x", function(d,i){
				return x(d.testspm);
			})
			.attr("y", function(d,i){
				return height * 0.5;
			})
			.text(function(d,i){
				if (scroll_show_state_list.includes(d.state_code)) {
					return d.state_code;
				} else {
					return "";
				}
			})
			.style("font-size", "0.75rem");


	var xAxis = d3.axisBottom(x)
					.tickFormat( (d,i) => {
			          if (d%500 === 0) return d;
			      	}).tickPadding(2);
		        //.scale(x);
		        //.tickFormat(d3.timeFormat("%B %e"))
		        //.tickValues(x.domain().filter(function(d,i){ return !(i%10)}));


	// Add the X Axis
	g4.append("g")
		.attr("transform", "translate(0," + (height+10)+ ")")
		.call(xAxis)
		.attr("class", "state_fatality_xaxis")
		.style("font-size", "0.75rem")
	.append("text")
		.attr("class", "state_fatality_label")
		.attr("x", width)
		.attr("y", -10)
		.style("text-anchor", "end")
		.text(function(){
			return "Tests per million people";
		})
		.style("fill", "black")
		.style("stroke", "none")
		.style("font-weight", "bold")
		.style("font-size", "0.75rem");

	
					
}


function hide_scroll_map(idname) {
	d3.select(idname).select(".india")
		.transition()
		.duration(1000)
		.style("opacity", 0);

	d3.select(idname).selectAll(".outbreak_spread_circles").remove();
	//	.transition()
	//		.duration(1000)
	//		.style("opacity", 0);
}

/*
function sort_state_circles_by_case_count(idname, width, height) {

	//svg_map.remove();
	d3.select(idname).selectAll(".outbreak_spread_circles").remove();

	// set the ranges
    var x = d3.scaleLinear().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    x.domain([d3.max(scroll_state_data, function(d) { return d.state_id; })+5, 0]);

    d3.select(idname).selectAll(".state_center_overall_circles")
    	.transition()
    		.duration(2000)
			.attr("cx", function(d,i){
				return x(d.state_id);
			})
			.attr("cy", function(d,i){
				return height/2;
			});
}
*/


function sort_state_circles_by_test_count_forcecollide(idname, width, height) {

	d3.select(idname).selectAll(".outbreak_spread_circles").remove();

    d3.select(idname)
		.selectAll(".state_center_overall_circles")
		.transition()
	        .duration(2000)
	        .attr("cx", function(d) {
	        	console.log(d);
	        	return d.x;
	        })
	        .attr("cy", function(d) { return d.y; });
                        
}




function state_circles_to_state_center(idname, filename, width, height) {

	var colorScale = d3.scaleSequential(d3.interpolateRdYlGn);
    d3.select(idname).selectAll(".state_scroll_circles").remove();
	d3.select(idname).selectAll(".outbreak_spread_circles").remove();
	//		.transition()
	//			.duration(2000)
	//			.style("opacity", 0);

	d3.select(idname).selectAll(".state_center_overall_circles")
    	.transition()
    		.duration(1000)
    		.style("opacity", 0);

    var x = d3.scaleLinear().range([0, width]);

   	var tooltip = d3.select("body")
                      .append("div")
                      .attr("class", "tooltip_scroll_state_circles")
                      .style("position", "absolute")
                      .style("z-index", "10")
                      .style("visibility", "hidden");
    
    if (0) {
	   	svg_map = d3.select(idname).append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              //.style("left", "50rem")
              .append("g")
              	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    }

    //console.log(svg_map);
    var g3 = svg_map.append("g");

    // Load external data and boot
    d3.queue()
        .defer(d3.csv, filename) //, data_ready)
        .await(ready);

    function ready(error, data) {
        if (error) throw error;

	    data.forEach(function(d, i) {
	  		if (1) { 
	  			d.state_id = +d.state_id;
	  			d.cases = +d.cases;
	  			d.ntod = +d.ntod;
	  			d.testspm = +d.testspm;
	  			d.casespm = +d.casespm;
				d.state_long = +d.state_long;
				d.state_lat = +d.state_lat;
				d.state = d.state;
				d.deaths = +d.deaths;
			}
		});

	    /*
	    // ---------------  Force collide  ----------------//
		var xScale = d3.scaleLinear().domain(d3.extent(data, function(d) {return d.testspm} )).range([0, width]);
	    var xAxis = d3.axisBottom(xScale);

	    var force_collide_factor_width = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([15, 30]);
	    force_collide_factor = force_collide_factor_width(width);

	    var simulation = d3.forceSimulation(data)
	        .force("x", d3.forceX(function(d) { return xScale(d.testspm); }).strength(1))
	        .force("y", d3.forceY(height / 2))
	        .force("collide", d3.forceCollide(force_collide_factor)) //15
	        .stop();

	    for (var i = 0; i < 120; ++i) simulation.tick();
	    // ---------------  Force collide  ----------------//
		*/
	    scroll_state_data = data;


	    g3.selectAll("dot")
	    	.data(data)
	    	.enter()
	    	.append("circle")
				.attr("class", "state_center_overall_circles circles")
				.attr("cx", function(d,i){
					//console.log(d);
					//console.log(projection([d.district_long, d.district_lat])[0]);
					return projection([d.state_long, d.state_lat])[0];
					//return x(d.district_long);
					//return randomNumber(0, width);
				})
				.attr("cy", function(d,i){
					//console.log(d);
					//console.log(y(d.district_lat));
					//return y(d.district_lat);
					//return randomNumber(0, height);
					return projection([d.state_long, d.state_lat])[1];
				})
				.attr("r", function(d,i) {
					return 0; //d.cases/250;
				})
				.style("fill", "none")
				.style("opacity", 0)
				.on("mouseover", function(d){
                  d3.select(this).style('stroke', 'white').style("stroke-width", 1).style("stroke-opacity", 1.0);
                  return tooltip.html(`<div><span class="scroll_circle_state_name">`+ d.state+`</span></br>` +
                  			`<span class="scroll_circle_state_fact">`+ d.cases+`</span> Cases, <span class="scroll_circle_state_fact">`+ d.deaths+`</span> Deaths</br>` + 
                  			`<span class="scroll_circle_state_fact">`+ d.testspm+`</span> Tests per million, <span class="scroll_circle_state_fact">`+ d.casespm+`</span> Cases per million` + 
                  			`</div>`)
                        .style("visibility", "visible");
                })
                .on("mousemove", function(){
                  if (event.pageX >= window.innerwidth*0.75/2) {
                    return tooltip.style("top", (event.pageY-10)+"px").style("right",(width-event.pageX-100)+"px");
                  } else {
                      return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
                  }
                })
                .on("mouseout", function(){
                  d3.select(this).style('stroke', 'white').style("stroke-opacity", 0);
                  return tooltip.style("visibility", "hidden");
                })
				.transition()
					.duration(100)
					.attr("r", function(d,i){
						return d.cases/4000 + "rem"; //Math.log10(d.cases)+"rem";
					})
					.style("opacity", 1)
					.style("fill", function(d) {
                    	if (isNaN(d.ntod)) {
                    		return "#c0c0c0";
                    	} else {
	                        if (d.state_code=="KL") {
	                			return colorScale(1);
	                		} else {
		                    	return colorScale(d.ntod/20);
	                		}
                    	}
                    });

	/*
        g3.selectAll("text")
	    	.data(data)
	    	.enter()
	    	.append("text")
				.attr("class", "state_scroll_text text")
				.attr("cx", function(d,i) {
					return projection([d.state_long, d.state_lat])[0];
				})
				.attr("cy", function(d,i) {
					return projection([d.state_long, d.state_lat])[1];
				})
				.text(function(d,i) {
    				if (["DL", "MH", "GJ", "WB", "KL", "KA", "MP", "AP", "TN", "RJ"].includes(d.state_code)) {
						return d.state_code;
					} else {
						return "";
					}
				});
	*/

		var xAxis = d3.axisBottom(x)
					.tickFormat( (d,i) => {
			          if (d%500 === 0) return d;
			      	}).tickPadding(2);

		// Add the X Axis
		g3.append("g")
			.attr("transform", "translate(0," + (height+20)+ ")")
			.call(xAxis)
			.attr("class", "state_fatality_xaxis")
			.style("font-size", "0.75rem")
		.append("text")
			.attr("class", "state_fatality_label")
			.attr("x", width)
			.attr("y", -10)
			.style("text-anchor", "end")
			.text(function(){
				return "Tests per million people";
			})
			.style("fill", "black")
			.style("stroke", "none")
			.style("font-weight", "bold")
			.style("font-size", "0.75rem");

	}

}