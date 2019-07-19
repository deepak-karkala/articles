(function() {
	// using d3 for convenience
	var main = d3.select('main')
	var scrolly = main.select('#scrolly');
	var figure = scrolly.select('figure');
	var article = scrolly.select('article');
	var step = article.selectAll('.step');

	// initialize the scrollama
	var scroller = scrollama();

	// generic window resize listener event
	function handleResize() {
		// 1. update height of step elements
		var stepH = Math.floor(window.innerHeight * 0.75);
		step.style('height', stepH + 'px');

		var figureHeight = window.innerHeight * 0.8// / 2
		var figureMarginTop = (window.innerHeight - figureHeight) / 2  

		figure
			.style('height', figureHeight + 'px')
			.style('top', figureMarginTop + 'px');


		// 3. tell scrollama to update new element dimensions
		scroller.resize();
	}

	// scrollama event handlers
	function handleStepEnter(response) {
		//console.log(response)
		// response = { element, direction, index }

		// add color to current step only
		step.classed('is-active', function (d, i) {
			return i === response.index;
		})

		// update graphic based on step
		//figure.select('p').text(response.index);
		val = response.index;
	    handleStepTransition(val);

	}

	function setupStickyfill() {
		d3.selectAll('.sticky').each(function () {
			Stickyfill.add(this);
		});
	}

	function init() {
		setupStickyfill();

		// 1. force a resize on load to ensure proper dimensions are sent to scrollama
		handleResize();

		// 2. setup the scroller passing options
		// 		this will also initialize trigger observations
		// 3. bind scrollama event handlers (this can be chained like below)
		scroller.setup({
			step: '#scrolly article .step',
			offset: 0.33,
			debug: false,
		})
			.onStepEnter(handleStepEnter)


		// setup resize event
		window.addEventListener('resize', handleResize);
	}

	// kick things off
	init();


	function handleStepTransition(data_step_id) {
	    d3.select("#graphic").select("svg").remove();

	    div_slider_text = document.getElementById("slider_text");
        div_slider_text.innerHTML = '';
        div_slider = document.getElementById("slider");
        div_slider.innerHTML = '';
        div_slider_tag = document.getElementById("slider_tag");
        div_slider_tag.innerHTML = '';

	    if (data_step_id == 3) {
	    	div_slider_text.innerHTML = "Use the slider to see how the rider's weight affects the speed of the bike";
			div_slider.innerHTML = `<div id="slider-range-min"></div>`;

	    	initial_value = 100;
			var output = document.getElementById("slider_tag");
        	output.innerHTML = `Bike + Rider Weight: <span class="slider_value">`+initial_value+` kg</span>`;
           	set_range_slider_rolling();

           	file = "data/bicycle_position_rolling.csv";
           	idname = "#graphic";
			transition_duration = [0, 0];
			end_x = 5;
			start_y_arr = [70, 30];
			end_y_arr = [70, 30];
			max_y = 100;
			user_value = initial_value + ' kg';
			type = "rolling";
           	plot_bicycle_comparison_top(file, idname, transition_duration, end_x, start_y_arr, end_y_arr, max_y, user_value, type);

	    } else if (data_step_id == 4) {
	    	div_slider_text.innerHTML = "Use the slider to see how the slope affects the speed of the bike";
			div_slider.innerHTML = `<div id="slider-range-min"></div>`;

	    	initial_value = 60;
			var output = document.getElementById("slider_tag");
        	output.innerHTML = `Slope: <span class="slider_value">`+initial_value+` kg</span>`;
           	set_range_slider_gravity();

           	file = "data/bicycle_position_gravity.csv";
           	idname = "#graphic";
			transition_duration = [0, 0];
			end_x = 5;
			start_y_arr = [200, 150];
			end_y_arr = [200, 150];
			max_y = 250;
			user_value = initial_value + ' degrees';
			type = "gravity";
           	plot_bicycle_comparison_top(file, idname, transition_duration, end_x, start_y_arr, end_y_arr, max_y, user_value, type);
	    }
	}

    function plot_bicycle_comparison_top(file, idname, transition_duration, end_x, start_y_arr, end_y_arr,  max_y, user_value, type) {
	    d3.select(idname).select("svg").remove();

		var width_scale_factor = 0.80;
		var margin = {right:20, left:20, top:10, bottom:10};

		var bb = d3.select(idname).node().offsetWidth;
		base_width = bb*width_scale_factor - margin.left - margin.right;
		if (type=="rolling") {
			var height_scale_factor = 0.5;
		} else if (type=="gravity") {
			var height_scale_factor = 0.3;
		}
		base_height = bb*height_scale_factor - margin.top - margin.bottom;
		
		plot_bicycle_comparison(idname, file, base_width, base_height, margin, transition_duration, end_x, start_y_arr, end_y_arr, max_y, user_value, type);
    }


	function plot_bicycle_comparison(id, file, width, height, margin, transition_duration, end_x, start_y_arr, end_y_arr, max_y, user_value, type) {

		if (type == "rolling") {
			line_start_y_arr = [45, 5];
			line_end_y_arr = [45, 5];
		} else if (type =="gravity") {
			console.log(start_y_arr);
			console.log(end_y_arr);
			line_start_y_arr = [45, 5];
			line_end_y_arr = [45 + end_y_arr[0]-start_y_arr[0], 5 + end_y_arr[1]-start_y_arr[1]];
		}

		var x = d3.scaleLinear()
	    	  .range([0, width]);
	  	var y = d3.scaleLinear()
	    	  .range([height, 0]);

	   	var xAxis = d3.axisBottom(x);
	   	var yAxis = d3.axisLeft(y);

	   	var svg = d3.select(id).append("svg")
	      		.attr("width", width + margin.left + margin.right)
	      		.attr("height", height + margin.top + margin.bottom)
	    	.append("g")
	      		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		// Bicycle bubbles
	  	d3.csv(file, function(error, data) {
	  	 	if (error) throw error;

		    data.forEach(function(d) {
		   		d.start_x = +d.start_x;
		    });

		    x.domain([0, 100]);
		    y.domain([0, max_y]);

		    svg.selectAll(".line")
		    	.data(data)
		    	.enter()
			    .append("line")
		    	.style("stroke", "black")
		    	.attr("x1", function(d) {return x(d.start_x);})
		    	.attr("x2", function(d) {return x(end_x);})
		    	.attr("y1", function(d, i) {return y(line_start_y_arr[i]); })
		    	.attr("y2", function(d, i) {return y(line_end_y_arr[i]); });

			var images = svg.selectAll(".images")
							  .data(data)
							  .enter()
							  .append("image");

			images.attr("xlink:href", function(d) {return d.url; })
			  .attr("x", function(d) {return x(d.start_x); })
			  .attr("y", function(d, i) {return y(start_y_arr[i]); })
			  .attr("width", 80)
			  .attr("height", 80)
			  .transition()
		      	.ease(d3.easeLinear)
		      	.duration(function(d, i) { return transition_duration[i]; })
		      	.attr("x", function(d) { return x(end_x); })
		      	.attr("y", function(d, i) { return y(end_y_arr[i]); });

		    var text = svg.selectAll(".text")
                    .data(data)
                    .enter()
                    .append("text")
                    .attr("x", function(d) { return x(d.start_x)-5; })
                    .attr("y", function(d, i) { return y(start_y_arr[i]); })
                    .style("fill", "black")
                    .text(function(d,i) { return d.name;} )
                        .transition()
                        	.ease(d3.easeLinear)
		      				.duration(function(d, i) { return transition_duration[i]; })
                            .attr("x", function(d) { return x(end_x); })
		     			 	.attr("y", function(d, i) { return y(end_y_arr[i]); })
                            .text(function(d,i) { 
                            	if (i==0) {
                            		return d.name;
                            	} else {
                            		return d.name + ' [' + user_value + ']'; 
                            	}
                            })
                            .style("fill", "black");

		});
	}

	function set_range_slider_rolling() {
		//var handle = $( "#custom-handle" );
	    $( "#slider-range-min" ).slider({
	      create: function() {
	        //handle.text( $( this ).slider( "value" ) );
	      },
	      slide: function( event, ui ) {
	        //handle.text( ui.value );
	      	value = ui.value;
	        var output = document.getElementById("slider_tag");
        	output.innerHTML = `Bike + Rider Weight: <span class="slider_value">`+value+` kg</span>`;
	      },
	      change: function(event, ui) {
           	file = "data/bicycle_position_rolling.csv";
	      	idname = "#graphic";
	      	W1 = 80; t1 = 2000;
	      	W2 = ui.value;
	      	t2 = W2 * t1 / W1;
			transition_duration = [t1, t2];
			end_x = 80;
			max_y = 100;
			start_y_arr = [70, 30];
			end_y_arr = [70, 30];
			user_value = W2 + ' kg';
           	plot_bicycle_comparison_top(file, idname, transition_duration, end_x, start_y_arr, end_y_arr, max_y, user_value);
	      },
          range: "min",
	      max: 120,
	      min: 40,
	      step: 5,
	      value: 100,
	    });
	}

	function set_range_slider_gravity() {
		//var handle = $( "#custom-handle" );
	    $( "#slider-range-min" ).slider({
	      create: function() {
	        //handle.text( $( this ).slider( "value" ) );
	      },
	      slide: function( event, ui ) {
	        //handle.text( ui.value );
	      	value = ui.value;
	        var output = document.getElementById("slider_tag");
        	output.innerHTML = `Slope: <span class="slider_value">`+value+` degrees</span>`;
	      },
	      change: function(event, ui) {
           	file = "data/bicycle_position_gravity.csv";
	      	idname = "#graphic";
	      	G1 = Math.tan(45); t1 = 2000;
	      	G2 = Math.tan(ui.value);
	      	t2 = t1 * Math.sin(Math.atan(G2)) / Math.sin(Math.atan(G1));
			transition_duration = [t1, t2];
			end_x = 80;
			max_y = 250;
			start_y_arr = [150, 100];
			end_y_arr = [start_y_arr[0]+70*G1, start_y_arr[1]+70*G2];
			user_value = G2 + ' degrees';
           	plot_bicycle_comparison_top(file, idname, transition_duration, end_x, start_y_arr, end_y_arr, max_y, user_value);
	      },
          range: "min",
	      max: 70,
	      min: 10,
	      step: 5,
	      value: 60,
	    });
	}

})();