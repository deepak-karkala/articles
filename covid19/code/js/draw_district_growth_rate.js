// Daily cases
idname = "#district_growth_rates"
d3.select(idname).select("svg").remove();
filename = "data/districtwise_growth_rate.csv";
//type = "cases";
width_scale_factor = 0.95;
height_scale_factor = 0.35;
var bb = d3.select(idname).node().offsetWidth;
var margin = {right:80, left:30, top:20, bottom:60};
base_width = bb*width_scale_factor - margin.left - margin.right;
base_height = bb*height_scale_factor - margin.top - margin.bottom;
plot_district_growth_rate(idname, filename, base_width, base_height);


var state_code_mapping = {'AP': 0, 'AR': 1, 'AS': 2, 'BR': 3,'CT': 4,'GA': 5, 'GJ': 6,'HR': 7,'HP': 8,
	 						  'JH': 9, 'KA': 10, 'KL': 11, 'MP': 12, 'MH': 13, 'MN': 14, 'ML': 15, 'MZ': 16,
	 						  'NL': 17, 'OR': 18, 'PB': 19, 'RJ': 20, 'SK': 21, 'TN': 22, 'TG': 23, 'TR': 24,
	 						  'UT': 25, 'UP': 26, 'WB': 27, 'AN': 28, 'CH': 29, 'DN': 30, 'DD': 31, 'DL': 32,
	 						  'JK': 33, 'LA': 34, 'LD': 35, 'PY': 36};

var state_colors_list = ["#404040", "#FF0000", "#800000", "#F1C40F", "#808000", "#00FF00", "#008000", "#0000FF",
						 "#000080", "#FF00FF", "#800080", "#F77210",
						 "#404040", "#FF0000", "#800000", "#F1C40F", "#808000", "#00FF00", "#008000", "#0000FF",
						 "#000080", "#FF00FF", "#800080", "#F77210",
						 "#404040", "#FF0000", "#800000", "#F1C40F", "#808000", "#00FF00", "#008000", "#0000FF",
						 "#000080", "#FF00FF", "#800080", "#F77210"]

//var state_color_mapping = d3.scaleLinear()
//							.domain([0, 36])
//							.range([0, 1]);
//var district_growth_rate_color_scale = d3.scaleSequential(d3.interpolateTurbo);

var district_growth_rate_state_color_mapping = d3.scaleOrdinal()
			.domain([0, 36])
			.range(state_colors_list);


var district_growth_rate_highlight_list = ["Bhopal_MP", "Banswara_RJ", "Tiruppur_TN", "SPS-Nellore_AP", "Kasaragod_KL",
										 "Delhi_DL", "Vadodara_GJ"];

var default_background_color = "#c0c0c0";

function plot_district_growth_rate(idname, filename, width, height) {

	var growth_rate_district_list = [];

	var tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip_flattening_curve")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden");
	

    var x = d3.scaleBand().rangeRound([0, width], .05).padding(0.1);
    var y = d3.scaleLinear().range([height, 0]);

    var yAxis = d3.axisRight()
                  .scale(y)
                  .ticks(4);

    // parse the date / time
    var parseTime = d3.timeParse("%Y-%m-%d");
          
    // append the svg object to the body of the page
    // append a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3.select(idname).append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // get the data
    var date_data = [];
    var dates = [];
    var district_growth_rate = [];
    var growth_rate_50 = [];
    var growth_rate_100 = [];
    var growth_rate_150 = [];

    d3.csv(filename, function(error, data_csv) {
		if (error) throw error;

		dates = d3.keys(data_csv[0]); //.slice(1, data_csv.length-1));

		for (var i=1; i<dates.length-1; i++) {
			date_data[i-1] = [];
			date_data[i-1].date = parseTime(dates[i]);

			growth_rate_50[i-1] = [];
			growth_rate_50[i-1].date = date_data[i-1].date;
			growth_rate_50[i-1].rate = 50;

			growth_rate_100[i-1] = [];
			growth_rate_100[i-1].date = date_data[i-1].date;
			growth_rate_100[i-1].rate = 100;

			growth_rate_150[i-1] = [];
			growth_rate_150[i-1].date = date_data[i-1].date;
			growth_rate_150[i-1].rate = 150;
		}

		x.domain(date_data.map(function(d) {
			//console.log(d.date);
			return d.date;
		}));
	    y.domain([0, 150]);

	    var district_latest_growth_rate = [];
		for (var j=0; j<data_csv.length; j++) {
		//for (var j=2; j<=2; j++) {

			district_growth_rate = data_csv[j]; //.slice(1, data_csv.length-1));
			district_name = district_growth_rate[dates[0]].replace(/\./g,"").replace(", ","_").split(" ").join("-");
			growth_rate_district_list.push(district_name);
			state_code = district_name.split("_")[1];
			//state_color = district_growth_rate_color_scale(state_color_mapping(state_code_mapping[state_code]));
			state_color = district_growth_rate_state_color_mapping(state_code_mapping[state_code]);

			var didx = 0;
			var first_nonzero = 0;
			var data = []
			for (var i=1; i<dates.length-1; i++) {
				
				//console.log((district_growth_rate[dates[i]])==="");

				if (parseFloat(district_growth_rate[dates[i]])>0) {
					first_nonzero = 1
				}

				if ((first_nonzero==1) && (district_growth_rate[dates[i]]!=="")) {
					data[didx] = [];
					data[didx].date = parseTime(dates[i]);
					data[didx].rate = parseFloat(district_growth_rate[dates[i]]);
					didx += 1;
				}
	    	}
	    	district_latest_growth_rate[district_name] = data[didx-1].rate;

	    	//console.log(data);

	        // define the line
			var valueline = d3.line()
				.x(function(d) {
					console.log(d.date);
					return x(d.date);
				})
				.y(function(d) {
					console.log(d.rate);
					return y(d.rate);
				});

			// Add the valueline path.
			path = svg.append("path")
	                .data([data])
	                .attr("class", district_name+"_growth_rate_curve growth_rate_curve")
	                .attr("d", valueline)
	                .attr("fill", "none")
	                .attr("stroke-width", "1.5px")
	                .attr("stroke", function() {
			      		if (district_growth_rate_highlight_list.includes(district_name)) {
			      			return state_color;
	                	} else {
	                		return default_background_color; 
	                	}
	                })
	                .attr("opacity", function() {
			      		if (district_growth_rate_highlight_list.includes(district_name)) {
			      			return 1;
			      		} else {
			      			return 0.5;
			      		}
		      		})
	                .on("mouseover", function(d,i) {
                    	dname_with_state_code = this.getAttribute("class").split("_growth_rate_curve")[0];
						show_selected_district_growth_rate(dname_with_state_code);

                    	return tooltip.html(`<div class='well'>`+
                                                  `<span class="state_name text-center">`+dname_with_state_code.replace("_",", ")+`</span></br>` +
                                                ` Current daily growth rate of <span class="case_count_info">`+ Math.round(district_latest_growth_rate[dname_with_state_code],0) +`</span> %</div>` )
                                          .style("visibility", "visible");
	                })
	                .on("mousemove", function(){
                        return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
                    })
	                .on("mouseout", function(d,i) {
						show_all_districts_growth_rate_button_click_handler();
                        return tooltip.style("visibility", "hidden");
	                })


	        svg.append("text")
	        	.attr("class", district_name+"_label label")
	        	.attr("x", width-margin.right+50)
	        	.attr("y", y(data[didx-1].rate))
	        	.text(district_name.replace("_"," "))
	        	.style("font-size", "0.75rem")
	        	.style("font-weight", "bold")
	        	.style("fill", state_color)
	        	.attr("opacity", function() {
	      			if (district_growth_rate_highlight_list.includes(district_name)) {
	      				return 1;
	      			} else {
	      				return 0;
	      			}
	      		});


	      	svg.selectAll(".dot")
	      		.data(data)
              .enter().append("circle")
	      		.attr("class", function(d) {
	      			//console.log(district_name+"_circles");
	      			return district_name+"_circles circles"
	      		})
	      		.attr("cx", function(d,i) { return x(d.date); })
	      		.attr("cy", function(d,i) { return y(d.rate); })
	      		.attr("r", "0.15rem")
	      		.style("fill", state_color)
	      		.attr("opacity", function(d) {
	      			if (district_growth_rate_highlight_list.includes(district_name)) {
	      				return 1;
	      			} else {
	      				return 0;
	      			}
	      		});

        }
		set_select_district_growth_rate(growth_rate_district_list);

		var xAxis = d3.axisBottom()
                    .scale(x)
                    .tickFormat(d3.timeFormat("%B %e"))
                    .tickValues(x.domain().filter(function(d,i){ return !(i%7)}));

		// add the x Axis
		svg.append("g")
		  .attr("transform", "translate(0," + (height+10) + ")")
		  .attr("class", "label_histogram")
		  .call(xAxis)
		  .style("font-size", "0.75rem")
		.append("text")
		  .attr("class", "label_histogram")
		  .attr("x", width)
		  .attr("y", -40)
		  .style("text-anchor", "end")
		  .style("fill", "black")
		  .style("font-size", "0.75rem");


		horizontal_grid_lines_data = [growth_rate_50, growth_rate_100, growth_rate_150];
		for (var hg=0; hg<3; hg++) {
			svg.append("path")
	            .data([horizontal_grid_lines_data[hg]])
	            .attr("d", valueline)
	            .attr("fill", "none")
	            .attr("stroke", "#c0c0c0")
	            .attr("stroke-width", "1.5px")
	            .attr("stroke-dasharray", 2);
        }

		// add the y Axis
		svg.append("g")
		  .attr("class", "label_histogram axis--y")
		  //.attr("transform", "translate("+(width+margin.right-40)+",0)")
		  .call(yAxis)
		  .style("font-size", "0.75rem")
		.append("text")
		  .attr("class", "label_histogram")
		  .attr("transform", "rotate(-90)")
		  .attr("x", 0)
		  .attr("y", -10)
		  .style("text-anchor", "end")
		  .text(function(){
		      return "Daily growth rate (%)";
		  })
		  .style("fill", "black")
		  .style("font-weight", "bold")
		  .style("font-size", "1.0rem");


		svg.append("text")
			.attr("class", "label_histogram")
			.attr("x", width)
			.attr("y", height+50)
			.text("Districts with min 50 cases, Growth rate averaged over previous week")
			.style("text-anchor", "end")
			.style("fill", "#808080")
			.style("font-size", "0.75rem");
	    	
    });

    
}


$("#select_district_growth_rate").change(function() {

    district_name = this.value;

	if (district_name=="") {
		show_all_districts_growth_rate_button_click_handler();
	} else {
		show_selected_district_growth_rate(district_name);
	}

});



function show_selected_district_growth_rate(district_name) {
	state_code = district_name.split("_")[1];
	state_color = district_growth_rate_state_color_mapping(state_code_mapping[state_code]);

	d3.selectAll(".growth_rate_curve").attr("stroke", default_background_color).attr("opacity", 0.25).attr("stroke-width", "2px");
	d3.selectAll(".label").attr("opacity", 0);
	d3.selectAll(".circles").attr("opacity", 0);
	
	d3.select("."+district_name+"_growth_rate_curve").attr('stroke-width', "2px").attr("stroke", state_color).attr("opacity", 1.0);
	d3.select("."+district_name+"_label").attr("opacity", 1);
	d3.selectAll("."+district_name+"_circles").attr("opacity", 1);
}



$("#show_all_districts_growth_rate").click(function() {
    show_all_districts_growth_rate_button_click_handler();
    $('#select_district_growth_rate').val("").trigger('change');
});

function show_highlight_districts() {
	for (var h=0; h<district_growth_rate_highlight_list.length; h++) {
		highlight_state_name = district_growth_rate_highlight_list[h];
		state_code = highlight_state_name.split("_")[1];
		state_color = district_growth_rate_state_color_mapping(state_code_mapping[state_code]);

		d3.select("."+highlight_state_name+"_growth_rate_curve").attr('stroke-width', "2px").attr("stroke", state_color).attr("opacity", 1.0);
		d3.select("."+highlight_state_name+"_label").attr("opacity", 1);
		d3.selectAll("."+highlight_state_name+"_circles").attr("opacity", 1);
	}
}

function set_select_district_growth_rate(growth_rate_district_list) {
    var district_list = '';
    for (var i=0; i<growth_rate_district_list.length; i++) {
    	district_name = growth_rate_district_list[i].replace("_",", ").replace("-", " ")
        district_list += `<option value="`+growth_rate_district_list[i]+`">`+district_name+`</option>`;
    }
    $('#select_district_growth_rate').append(district_list);
}

function show_all_districts_growth_rate_button_click_handler() {
	d3.selectAll(".growth_rate_curve").attr("stroke", default_background_color).attr("opacity", 0.5).attr("stroke-width", "1.5px");
	d3.selectAll(".label").attr("opacity", 0);
	d3.selectAll(".circles").attr("opacity", 0);

	show_highlight_districts();
}
