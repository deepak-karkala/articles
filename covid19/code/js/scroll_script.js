(function() {
	// using d3 for convenience
	var container = d3.select('#scroll1');
	var graphic = container.select('.scroll__graphic1');
	var text = container.select('.scroll__text1');
	var step = text.selectAll('.step1');
	// initialize the scrollama
	var scroller = scrollama();
	// generic window resize listener event
	function handleResize() {
		// 1. update height of step elements
		var stepHeight = Math.floor(window.innerHeight * 0.25);
		step.style('height', stepHeight + 'px');
		// 2. update width/height of graphic element
		var bodyWidth = d3.select('body').node().offsetWidth;
		var graphicMargin = 16 * 4;
		var textWidth = text.node().offsetWidth;
		var graphicWidth = container.node().offsetWidth; // - textWidth - graphicMargin;
		var graphicHeight = Math.floor(window.innerHeight * 0.5);
		var graphicMarginTop = Math.floor(graphicHeight / 2);
		graphic
			.style('width', graphicWidth + 'px')
			.style('height', graphicHeight + 'px');
		// 3. tell scrollama to update new element dimensions
		scroller.resize();
	}
	// scrollama event handlers
	function handleStepEnter(response) {
		var el = d3.select(response.element);
		var val = el.attr('data-step');
		// response = { element, direction, index }
		// add color to current step only
		step.classed('is-active', function (d, i) {
			return i === response.index;
		});
		// update graphic based on step
		graphic.select('p').text(response.index + 1);
		handleStepTransition(val);
	}
	function handleContainerEnter(response) {
		// response = { direction }
		// old school
		// sticky the graphic
		graphic.classed('is-fixed', true);
		graphic.classed('is-bottom', false);
	}
	function handleContainerExit(response) {
		// response = { direction }
		// old school
		// un-sticky the graphic, and pin to top/bottom of container
		graphic.classed('is-fixed', false);
		graphic.classed('is-bottom', response.direction === 'down');
	}
	function handleStepProgress(response) {
		//console.log(response);
		var el = d3.select(response.element);
		
		var val = el.attr('data-step');
		var rgba = 'rgba(' + val + ', ' + response.progress + ')';
		el.style('background-color', rgba);
		el.select('.progress').text(d3.format('.1%')(response.progress));

		handleProgressTransition(val, response.progress);
	}
	function handleStepTransition(data_step_id) {
		if (data_step_id==5) {
			
			idname = "#scroll1_chart";
			d3.select(idname).select("svg").remove();
			filename = "data/scroll/scroll_data.csv";
			width_scale_factor = 0.98;
			height_scale_factor = 0.3;
			var bb = d3.select(idname).node().offsetWidth;
			var margin = {right:0, left:0, top:0, bottom:30};
			base_width = bb*width_scale_factor - margin.left - margin.right;
			base_height = Math.floor(window.innerHeight * 0.95); //bb*height_scale_factor - margin.top - margin.bottom;
			load_data(idname, filename, base_width, base_height, margin);

			//scroll_script1(idname, filename, base_width, base_height);
			var title_id = document.getElementById("scroll1_chart_title");
			title_id.innerHTML = `Each dot is a confirmed case of India`;

		}  else if (data_step_id==7) {
			
			var opacity = 0;
			hide_existing_cases(idname, opacity);

		}  else if (data_step_id==8) {

			idname = "#scroll1_chart";
			d3.select(idname).select("svg").remove();
			filename = "data/cluster_network_map.csv";
			width_scale_factor = 0.90;
			height_scale_factor = 0.40;
			var bb = d3.select(idname).node().offsetWidth;
			//var margin = {right:20, left:40, top:10, bottom:60};
			var margin = {right:0, left:0, top:0, bottom:30};
			base_width = bb*width_scale_factor - margin.left - margin.right;
			//base_height = bb*height_scale_factor - margin.top - margin.bottom;
			base_height = Math.floor(window.innerHeight * 0.90); 
			//draw_cluster_map(idname, filename, base_width, base_height);


		} else if (data_step_id==9) {

			d3.select(idname).select("svg").remove();
			var opacity = 1;
			idname = "#scroll1_chart";
			width_scale_factor = 0.98;
			height_scale_factor = 0.3;
			var bb = d3.select(idname).node().offsetWidth;
			var margin = {right:0, left:0, top:0, bottom:30};
			base_width = bb*width_scale_factor - margin.left - margin.right;
			base_height = Math.floor(window.innerHeight * 0.95);
			show_individual_cases(idname, base_width, base_height, opacity);

		} else if (data_step_id==10) {
			
			color_case_by_status(idname);

		} else if (data_step_id==11) {
			base_height = Math.floor(window.innerHeight * 0.70); 
			var margin = {right:0, left:0, top:0, bottom:30};
			plot_over_time(idname, base_width, base_height, margin);

		} else if (data_step_id==12) {

			idname = "#scroll1_chart";
			d3.select(idname).select("svg").remove();
			filename = "data/scroll/scroll_data.csv";
			width_scale_factor = 0.90;
			height_scale_factor = 0.60;
			var bb = d3.select(idname).node().offsetWidth;
			var margin = {right:20, left:40, top:10, bottom:60};
			base_width = bb*width_scale_factor - margin.left - margin.right;
			base_height = bb*height_scale_factor - margin.top - margin.bottom;
			draw_scroll_outbreak_spread_map(idname, filename, base_width, base_height);

		}
	}
	function handleProgressTransition(data_step_id, progress) {

		if (data_step_id==1) {
			
		} else if (data_step_id == 2) {
			

		} else if (data_step_id == 3) {
			
		} else if ((data_step_id >= 7) && (data_step_id <= 10)) {

			
		} else if (data_step_id == 13) {
			
		}


	}
	function init() {
		// 1. force a resize on load to ensure proper dimensions are sent to scrollama
		handleResize();
		// 2. setup the scroller passing options
		// this will also initialize trigger observations
		// 3. bind scrollama event handlers (this can be chained like below)
		scroller.setup({
			container: '#scroll1',
			graphic: '.scroll__graphic1',
			text: '.scroll__text1',
			step: '.scroll__text1 .step1',
			progress: 'true',
			debug: false,
			offset: 0.80,
		})
			.onStepEnter(handleStepEnter)
			.onContainerEnter(handleContainerEnter)
			.onContainerExit(handleContainerExit)
			.onStepProgress(handleStepProgress);
		// setup resize event
		window.addEventListener('resize', handleResize);
	}
	// kick things off
	init();
})();