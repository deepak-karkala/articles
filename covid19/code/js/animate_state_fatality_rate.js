idname = "#fatality_rate_animation";
d3.select(idname).select("svg").remove();
filename = "data/state_case_death_testpm_growth.csv";
width_scale_factor = 1.0;
height_scale_factor = 0.60;
var bb = d3.select(idname).node().offsetWidth;
var margin = {right:20, left:40, top:10, bottom:60};
base_width = bb*width_scale_factor - margin.left - margin.right;
base_height = bb*height_scale_factor - margin.top - margin.bottom;
animate_state_fatality_rate(idname, filename, base_width, base_height);


function animate_state_fatality_rate(idname, file, width, height) {

	var growth_rate_normalised = d3.scaleLinear().domain([0, 20]).range([0, 1]);
	var state_fatality_rate_color_scale = d3.scaleSequential(d3.interpolateYlOrRd);
	var state_fatality_label_list = ["DL", "MH", "GJ", "MP", "AP", "KL", "RJ", "TN", "UP"];

	// parse the date / time
    var parseTime = d3.timeParse("%Y-%m-%d");

    // set the ranges
    var x = d3.scaleLinear().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    // Tooltip
    var tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip_state_fatality_rate")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden");

    var svg = d3.select(idname).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");
    
    // Get the data
    d3.csv(file, function(error, data) {
		if (error) throw error;

		var columns = d3.keys(data[0]);
		start_date_str = columns[2].split("_")[0];
		end_date_str = columns[columns.length-1].split("_")[0];
		//console.log(last_date_str);

		const start_date = new Date(start_date_str);
		const end_date = new Date(end_date_str);
		const diff_time = Math.abs(end_date - start_date);
		const num_days = Math.ceil(diff_time / (1000 * 60 * 60 * 24)); 
		//data = data.filter(function(d,i) {
			
		//});

		// Read last data to set domains
		data.forEach(function(d, i) {
			//console.log(d["state"]);
			//console.log(d[end_date_str+"_cases"]);
			d.cases = +d[end_date_str+"_cases"];
			d.deaths = +d[end_date_str+"_deaths"];
			d.growth = +d[end_date_str+"_growth"];
			d.testspm = +d[end_date_str+"_testspm"];
		});
		//console.log(data);

		//Set domains
      	x.domain([0, d3.max(data, function(d) { return d.cases; })]);
      	//y.domain([0, d3.max(data, function(d) { return d.deaths; })]);
      	y.domain([0, d3.max(data, function(d) { return d.testspm; })]);
		

      	data.forEach(function(d, i) {
      		cdt = start_date_str;
			//console.log(d["state"]);
			//console.log(d[start_date_str+"_cases"]);
			d.cases = +d[cdt+"_cases"];
			d.deaths = +d[cdt+"_deaths"];
			d.growth = +d[cdt+"_growth"];
			d.testspm = +d[cdt+"_testspm"];
			d.state = d.state;
		});

      	

      	svg.selectAll(".dot")
			.data(data)
        .enter().append("circle")
			.attr("class", "state_fatality_circles circles")
			.attr("r", function(d,i) {
				console.log(d.growth/10);
				return d.growth/10;
			})
			.attr("cx", function(d,i) {
				//console.log(d.cases);
				return x(d.cases);
			})
			.attr("cy", function(d,i) {
				//console.log(d.deaths);
				//return y(d.deaths);
				return y(d.testspm);
			})
			.style("z-index", 0)
			.attr("fill", function(d,i) {
				//console.log(state_fatality_rate_color_scale(growth_rate_normalised(d.growth)));
				//return "black";
				return state_fatality_rate_color_scale(growth_rate_normalised(d.growth));
			})
			.attr("stroke", "#000")
			.attr("stroke-width", "0.25px")
			.attr("opacity", 1)
			.on("mouseover", function(d, i) {
			    d3.selectAll(".state_fatality_circles").style("opacity", 0.5);
			    d3.select(this).style('stroke-width', '2px').style("opacity", 1.0);
			    //return tooltip.html(`<div class="well">"+d.state_name+" "</span></div>" ).style("visibility", "visible");
			    return tooltip.html(`<div class='well'>`+
                                      `<span class="state_name text-center">`+d.state_name+`</span></br>` +
                                    `Confirmed Cases: <span class="case_count_info">`+ d.cases +`</span></br>`+
                                    `Deaths: <span class="case_count_info">`+ d.deaths +`</span></br>`+
                                    `Daily Growth Rate: <span class="case_count_info">`+ parseFloat(d.growth).toFixed(1) +`%</span></br>`+
                                    `Tests per million: <span class="case_count_info">`+ Math.round(d.testspm)+`</span>`+
                                    `</div>` )
                              .style("visibility", "visible");
			  }
			)
			.on("mousemove", function(){
				return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
			})
			.on("mouseout", function(d, i){
				//d3.select(this).style('stroke-width', "1px").style("opacity", 1.0);
			    d3.selectAll(".state_fatality_circles").style("opacity", 1.0);
			    d3.select(this).style('stroke-width', '0.25px').style("opacity", 1.0);
				return tooltip.style("visibility", "hidden");
			});

			svg.selectAll(".text")
	      		.data(data)
	      	.enter().append("text")
				.attr("class", "state_fatality_text")
	      		.attr("x", function(d,i) {
					return x(d.cases);
				})
	      		.attr("y", function(d,i) {
					return y(d.testspm);
					//return y(d.deaths);
				})
				.text(function(d,i) {
					if (state_fatality_label_list.includes(d.state)) {
						return d.state;
					} else {
						return "";
					}
				})
				.style("z-index", 10)
				.style("font-size", "0.75rem");

			var xAxis = d3.axisBottom(x);
		        //.scale(x);
		        //.tickFormat(d3.timeFormat("%B %e"))
		        //.tickValues(x.domain().filter(function(d,i){ return !(i%10)}));

		    var yAxis = d3.axisLeft(y)
				      	.tickFormat( (d,i) => {
				          if (d%40 === 0) return d;
				      	}).tickPadding(2);

			// Add the X Axis
			svg.append("g")
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
					return "Total cases";
				})
				.style("fill", "black")
				.style("stroke", "none")
				.style("font-size", "0.75rem");

			// Add the Y Axis
			svg.append("g")
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
				  return "Total deaths";
				})
				.style("fill", "black")
				.style("stroke", "none")
				.style("font-size", "1rem");

			svg.selectAll("text")
		        //.attr("class", "label")
		        .style("fill", "black")
		        .style("shape-rendering", "crispEdges");

		//console.log(num_days);
		//http://bl.ocks.org/darrenjaworski/5544599
		for (var c=2; c<=num_days+1; c++) {
		//for (var c=2; c<4; c++) {
			cdt = columns[c].split("_")[0];

			data.forEach(function(d, i) {
				//console.log(d["state"]);
				//console.log(d[start_date_str+"_cases"]);
				d.cases = +d[cdt+"_cases"];
				d.deaths = +d[cdt+"_deaths"];
				d.growth = +d[cdt+"_growth"];
				d.testspm = +d[cdt+"_testspm"];
				d.state = d.state;
			});

			svg.selectAll(".state_fatality_circles")
				.transition()
				.delay(function(d,i) { return (c-1)*200; })
				.duration(200)
				.attr("cx", function(d,i) {
					//console.log(d[cdt+"_cases"]);
					return x(d[cdt+"_cases"]);
				})
				.attr("cy", function(d,i) {
					//return y(d[cdt+"_deaths"]);
					return y(d[cdt+"_testspm"]);
				})
				.attr("fill", function(d,i) {
					return state_fatality_rate_color_scale(growth_rate_normalised(d[cdt+"_growth"]));
				})
				.attr("r", function(d,i) {
					console.log(d.testspm/500);
					return "0.5rem"; //d.testspm/100;
				});


			//console.log(svg.selectAll(".state_fatality_text"));

			svg.selectAll(".state_fatality_text")
				.transition()
				.delay(function(d,i) { return (c-1)*200; })
				.duration(200)
				.attr("x", function(d,i) {
					//console.log(d[cdt+"_cases"]);
					return x(d[cdt+"_cases"]+100);
				})
				.attr("y", function(d,i) {
					return y(d[cdt+"_deaths"]);
				});
				//.text(function(d,i) { return d.state; });
			/*
			x.domain([0, d3.max(data, function(d) { return d[cdt+"_cases"]; })]);
	      	y.domain([0, d3.max(data, function(d) { return d[cdt+"_deaths"]; })]);


			// Update X Axis
			//http://bl.ocks.org/WilliamQLiu/bd12f73d0b79d70bfbae
            svg.select(".state_fatality_xaxis")
                .transition()
				.delay((c-1)*200)
                .duration(200)
                .call(xAxis);

            svg.select(".state_fatality_yaxis")
                .transition()
				.delay((c-1)*200)
                .duration(200)
                .call(yAxis);
			*/

		}

	});

}
