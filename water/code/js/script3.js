(function() {
	// using d3 for convenience
	var container = d3.select('#scroll3');
	var graphic = container.select('.scroll__graphic3');
	var text = container.select('.scroll__text3');
	var step = text.selectAll('.step3');
	// initialize the scrollama
	var scroller = scrollama();
	// generic window resize listener event
	function handleResize() {
		// 1. update height of step elements
		var stepHeight = Math.floor(window.innerHeight * 0.75);
		step.style('height', stepHeight + 'px');
		// 2. update width/height of graphic element
		var bodyWidth = d3.select('body').node().offsetWidth;
		var graphicMargin = 16 * 4;
		var textWidth = text.node().offsetWidth;
		var graphicWidth = container.node().offsetWidth - textWidth - graphicMargin;
		var graphicHeight = Math.floor(window.innerHeight * 0.95)
		var graphicMarginTop = Math.floor(graphicHeight / 2)
		graphic
			.style('width', graphicWidth + 'px')
			.style('height', graphicHeight + 'px')
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

	}
	function handleStepTransition(data_step_id) {
		if (data_step_id==2) {
			var width_scale_factor = 0.80;
			var height_scale_factor = 0.70;
			var margin = {right:10, left:10, top:10, bottom:10};

			idname = "#country_water_scarcity";
			var bb = d3.select(idname).node().offsetWidth;
			base_width = Math.max(200, bb*width_scale_factor - margin.left - margin.right);
			base_height = 500; //bb*height_scale_factor - margin.top - margin.bottom;
			file = "data/water_scarcity_score.csv";

			d3.select(idname).select("svg").remove();
			plot_country_water_scarcity(idname, file, base_width, base_height);
			//plot_country_water_scarcity_mapbox("country_water_scarcity");

		} else if (data_step_id==2) {
			/*
			width_scale_factor = 0.80;
			height_scale_factor = 0.70;
			margin = {right:10, left:10, top:10, bottom:10};
			idname = "#country_water_scarcity";
			var bb = d3.select(idname).node().offsetWidth;
			base_width = bb*width_scale_factor - margin.left - margin.right;
			base_height = bb*height_scale_factor - margin.top - margin.bottom;

			var p0 = [base_width/2, base_height/2, 500],
				//p1 = [160, 200, 120];
				p1 = [base_width/2, base_height/2, 300];

			//var p0 = [base_width/2, base_height/2],
			//	p1 = [base_width/2 + 100, base_height/2-100];

			d3.select(idname).select("svg") //.select(".countries")
				.call(transition, p0, p1, base_width, base_height);
			*/
		}
	}

	function init() {
		// 1. force a resize on load to ensure proper dimensions are sent to scrollama
		handleResize();
		// 2. setup the scroller passing options
		// this will also initialize trigger observations
		// 3. bind scrollama event handlers (this can be chained like below)
		scroller.setup({
			container: '#scroll3',
			graphic: '.scroll__graphic3',
			text: '.scroll__text3',
			step: '.scroll__text3 .step3',
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