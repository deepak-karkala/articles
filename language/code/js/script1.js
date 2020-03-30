(function() {
	// using d3 for convenience
	var main = d3.select('main')
	var scrolly = main.select('#scrolly');
	var figure = scrolly.select('figure');
	var article = scrolly.select('article');
	var step = article.selectAll('.step');
	var current_year = figure.select('.current_year');
	// initialize the scrollama
	var scroller = scrollama();
	// generic window resize listener event
	function handleResize() {
		// 1. update height of step elements
		//var stepH = Math.floor(window.innerHeight * 0.75);
		var stepH = Math.floor(window.innerHeight * 1.0);
		step.style('height', stepH + 'px');
		var figureHeight = window.innerHeight; // / 2
		var figureMarginTop = (window.innerHeight - figureHeight) / 2  
		figure
			.style('height', figureHeight + 'px')
			.style('top', figureMarginTop + 'px');
			//.style('top', '0px')
			//.style('bottom', '0px');
		// 3. tell scrollama to update new element dimensions
		scroller.resize();
		// Set migration map height
		//var mmap = document.getElementById("migration-map");
		var mmap = main.select("#migration-map");
		mmap.style('height', figureHeight + 'px');
	}
	// scrollama event handlers
	function handleStepEnter(response) {
		// response = { element, direction, index }
		// add color to current step only
		step.classed('is-active', function (d, i) {
			return i === response.index;
		})
		// update graphic based on step
		//figure.select('p').text(response.index + 1);
        var el = d3.select(response.element);
        var val = el.attr('data-step');
	    handleStepTransition(val);
	}
	function setupStickyfill() {
		d3.selectAll('.sticky').each(function () {
			Stickyfill.add(this);
		});
	}
	function handleStepProgress(response) {
		console.log(response.progress);
		current_year.text(response.progress);
	}
	function handleStepTransition(data_step_id) {
	    //console.log(data_step_id);
	    if (data_step_id==1) {
	        map.setView([-4.538027, 29.376260], 2.25);
	        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
	        }).addTo(map);
	        //var labelLocation = new L.LatLng(-29.904054, -141.404188);
	        //var labelTitle = new L.LabelOverlay(labelLocation, '<b>GERMANY</b>');
    		//map.addLayer(labelTitle);
	        
	    } else if (data_step_id==2) {
	        map.flyTo([-4.538027, 29.376260], 2, {"animate":true, "duration":2, "easeLinearity":2});
	    } else if (data_step_id==3) {
		    var trackRoute1 = JSON.parse('[{"lat": -20.0, "lng": 24.22},{"lat": -19.49, "lng": 24.22},{"lat": -18.99, "lng": 24.16},{"lat": -18.48, "lng": 24.8},{"lat": -17.98, "lng": 25.25},{"lat": -17.47, "lng": 24.81},{"lat": -16.97, "lng": 24.74},{"lat": -16.46, "lng": 25.09},{"lat": -15.96, "lng": 24.6},{"lat": -15.45, "lng": 25.23},{"lat": -14.95, "lng": 25.05},{"lat": -14.44, "lng": 25.47},{"lat": -13.94, "lng": 25.56},{"lat": -13.43, "lng": 25.17},{"lat": -12.93, "lng": 25.56},{"lat": -12.42, "lng": 25.62},{"lat": -11.92, "lng": 24.76},{"lat": -11.41, "lng": 24.82},{"lat": -10.91, "lng": 24.99},{"lat": -10.4, "lng": 25.31},{"lat": -9.9, "lng": 25.79},{"lat": -9.39, "lng": 25.66},{"lat": -8.89, "lng": 25.85},{"lat": -8.38, "lng": 26.28},{"lat": -7.88, "lng": 26.46},{"lat": -7.37, "lng": 26.9},{"lat": -6.87, "lng": 26.67},{"lat": -6.36, "lng": 26.67},{"lat": -5.86, "lng": 26.86},{"lat": -5.35, "lng": 26.74},{"lat": -4.85, "lng": 26.53},{"lat": -4.34, "lng": 27.11},{"lat": -3.84, "lng": 27.54},{"lat": -3.33, "lng": 28.15},{"lat": -2.83, "lng": 27.3},{"lat": -2.32, "lng": 28.63},{"lat": -1.82, "lng": 28.72},{"lat": -1.31, "lng": 29.23},{"lat": -0.81, "lng": 28.85},{"lat": -0.3, "lng": 29.38},{"lat": 0.2, "lng": 30.09},{"lat": 0.71, "lng": 30.28},{"lat": 1.21, "lng": 30.39},{"lat": 1.72, "lng": 30.58},{"lat": 2.22, "lng": 31.28},{"lat": 2.73, "lng": 31.68},{"lat": 3.23, "lng": 32.1},{"lat": 3.74, "lng": 31.96},{"lat": 4.24, "lng": 33.06},{"lat": 4.75, "lng": 33.37},{"lat": 5.25, "lng": 33.48},{"lat": 5.76, "lng": 33.95},{"lat": 6.26, "lng": 34.43},{"lat": 6.77, "lng": 34.19},{"lat": 7.27, "lng": 34.21},{"lat": 7.78, "lng": 34.76},{"lat": 8.28, "lng": 34.66},{"lat": 8.79, "lng": 34.64},{"lat": 9.29, "lng": 35.42},{"lat": 9.8, "lng": 34.35},{"lat": 10.3, "lng": 35.19},{"lat": 10.81, "lng": 34.52},{"lat": 11.31, "lng": 34.69},{"lat": 11.82, "lng": 34.47},{"lat": 12.32, "lng": 34.29},{"lat": 12.83, "lng": 33.82},{"lat": 13.33, "lng": 34.04},{"lat": 13.84, "lng": 33.07},{"lat": 14.34, "lng": 33.47},{"lat": 14.85, "lng": 32.29},{"lat": 15.35, "lng": 32.1},{"lat": 15.86, "lng": 31.66},{"lat": 16.36, "lng": 31.77},{"lat": 16.87, "lng": 30.56},{"lat": 17.37, "lng": 29.85},{"lat": 17.88, "lng": 29.99},{"lat": 18.38, "lng": 29.02},{"lat": 18.89, "lng": 29.26},{"lat": 19.39, "lng": 28.38},{"lat": 19.9, "lng": 27.8},{"lat": 20.4, "lng": 27.4},{"lat": 20.91, "lng": 27.21},{"lat": 21.41, "lng": 27.16},{"lat": 21.92, "lng": 26.53},{"lat": 22.42, "lng": 26.19},{"lat": 22.93, "lng": 26.12},{"lat": 23.43, "lng": 25.26},{"lat": 23.94, "lng": 26.09},{"lat": 24.44, "lng": 26.02},{"lat": 24.95, "lng": 26.15},{"lat": 25.45, "lng": 26.02},{"lat": 25.96, "lng": 26.66},{"lat": 26.46, "lng": 26.88},{"lat": 26.97, "lng": 27.38},{"lat": 27.47, "lng": 27.57},{"lat": 27.98, "lng": 27.85},{"lat": 28.48, "lng": 27.94},{"lat": 28.99, "lng": 28.7},{"lat": 29.49, "lng": 29.63},{"lat": 30.0, "lng": 29.71}]');
		    var trackRoute2 = JSON.parse('[{"lat": -20.0, "lng": 24.47},{"lat": -19.49, "lng": 24.19},{"lat": -18.99, "lng": 24.15},{"lat": -18.48, "lng": 24.89},{"lat": -17.98, "lng": 24.28},{"lat": -17.47, "lng": 24.15},{"lat": -16.97, "lng": 23.91},{"lat": -16.46, "lng": 24.11},{"lat": -15.96, "lng": 24.33},{"lat": -15.45, "lng": 25.1},{"lat": -14.95, "lng": 24.34},{"lat": -14.44, "lng": 24.77},{"lat": -13.94, "lng": 24.09},{"lat": -13.43, "lng": 25.03},{"lat": -12.93, "lng": 24.86},{"lat": -12.42, "lng": 24.83},{"lat": -11.92, "lng": 24.85},{"lat": -11.41, "lng": 25.29},{"lat": -10.91, "lng": 25.21},{"lat": -10.4, "lng": 25.86},{"lat": -9.9, "lng": 25.63},{"lat": -9.39, "lng": 25.78},{"lat": -8.89, "lng": 26.2},{"lat": -8.38, "lng": 25.69},{"lat": -7.88, "lng": 27.06},{"lat": -7.37, "lng": 26.51},{"lat": -6.87, "lng": 26.38},{"lat": -6.36, "lng": 27.13},{"lat": -5.86, "lng": 27.59},{"lat": -5.35, "lng": 27.73},{"lat": -4.85, "lng": 27.59},{"lat": -4.34, "lng": 28.1},{"lat": -3.84, "lng": 27.86},{"lat": -3.33, "lng": 28.54},{"lat": -2.83, "lng": 29.4},{"lat": -2.32, "lng": 29.26},{"lat": -1.82, "lng": 29.09},{"lat": -1.31, "lng": 29.78},{"lat": -0.81, "lng": 29.66},{"lat": -0.3, "lng": 29.83},{"lat": 0.2, "lng": 30.49},{"lat": 0.71, "lng": 31.06},{"lat": 1.21, "lng": 31.12},{"lat": 1.72, "lng": 31.39},{"lat": 2.22, "lng": 31.91},{"lat": 2.73, "lng": 32.06},{"lat": 3.23, "lng": 32.42},{"lat": 3.74, "lng": 32.88},{"lat": 4.24, "lng": 32.52},{"lat": 4.75, "lng": 32.45},{"lat": 5.25, "lng": 33.84},{"lat": 5.76, "lng": 33.2},{"lat": 6.26, "lng": 33.55},{"lat": 6.77, "lng": 33.82},{"lat": 7.27, "lng": 33.43},{"lat": 7.78, "lng": 33.54},{"lat": 8.28, "lng": 33.73},{"lat": 8.79, "lng": 34.25},{"lat": 9.29, "lng": 34.33},{"lat": 9.8, "lng": 34.17},{"lat": 10.3, "lng": 33.64},{"lat": 10.81, "lng": 33.28},{"lat": 11.31, "lng": 33.73},{"lat": 11.82, "lng": 33.54},{"lat": 12.32, "lng": 33.38},{"lat": 12.83, "lng": 33.55},{"lat": 13.33, "lng": 32.99},{"lat": 13.84, "lng": 32.26},{"lat": 14.34, "lng": 32.64},{"lat": 14.85, "lng": 31.52},{"lat": 15.35, "lng": 31.85},{"lat": 15.86, "lng": 30.74},{"lat": 16.36, "lng": 31.2},{"lat": 16.87, "lng": 30.45},{"lat": 17.37, "lng": 30.33},{"lat": 17.88, "lng": 29.84},{"lat": 18.38, "lng": 29.18},{"lat": 18.89, "lng": 29.33},{"lat": 19.39, "lng": 28.97},{"lat": 19.9, "lng": 28.74},{"lat": 20.4, "lng": 27.65},{"lat": 20.91, "lng": 27.96},{"lat": 21.41, "lng": 27.57},{"lat": 21.92, "lng": 27.66},{"lat": 22.42, "lng": 27.48},{"lat": 22.93, "lng": 26.03},{"lat": 23.43, "lng": 27.02},{"lat": 23.94, "lng": 26.27},{"lat": 24.44, "lng": 26.61},{"lat": 24.95, "lng": 27.36},{"lat": 25.45, "lng": 26.77},{"lat": 25.96, "lng": 26.69},{"lat": 26.46, "lng": 26.64},{"lat": 26.97, "lng": 26.85},{"lat": 27.47, "lng": 27.57},{"lat": 27.98, "lng": 27.46},{"lat": 28.48, "lng": 27.73},{"lat": 28.99, "lng": 28.53},{"lat": 29.49, "lng": 29.0},{"lat": 30.0, "lng": 30.17}]');
		    seqGroup = L.motion.group([
					L.motion.polyline(trackRoute1, {
					color: "transparent"
					}, {
						easing: L.Motion.Ease.easeInOutQuad
					}, {
						removeOnEnd: true,
						icon: L.divIcon({html: "<i class='fa fa-truck fa-2x fa-flip-horizontal' aria-hidden='true'></i>", iconSize: L.point(27.5, 24)})
					}).motionDuration(3000),
					L.motion.polyline(trackRoute2, {
					color: "transparent"
					}, {
						easing: L.Motion.Ease.easeInOutQuad
					}, {
						removeOnEnd: true,
						icon: L.divIcon({html: "<i class='fa fa-truck fa-2x fa-flip-horizontal' aria-hidden='true'></i>", iconSize: L.point(27.5, 24)})
					}).motionDuration(3000),

				]).addTo(map);
		    setTimeout(function () {
				seqGroup.motionStart();
			}, 10);
	    } else if (data_step_id==4) {
	    	map.removeLayer(seqGroup);
	    	//marker = new L.marker([30.0, 29.71])
    		//				.bindPopup("Test")
    		//				.addTo(map);
		    var trackRoute1 = JSON.parse('[{"lat": -20.0, "lng": 24.22},{"lat": -19.49, "lng": 24.22},{"lat": -18.99, "lng": 24.16},{"lat": -18.48, "lng": 24.8},{"lat": -17.98, "lng": 25.25},{"lat": -17.47, "lng": 24.81},{"lat": -16.97, "lng": 24.74},{"lat": -16.46, "lng": 25.09},{"lat": -15.96, "lng": 24.6},{"lat": -15.45, "lng": 25.23},{"lat": -14.95, "lng": 25.05},{"lat": -14.44, "lng": 25.47},{"lat": -13.94, "lng": 25.56},{"lat": -13.43, "lng": 25.17},{"lat": -12.93, "lng": 25.56},{"lat": -12.42, "lng": 25.62},{"lat": -11.92, "lng": 24.76},{"lat": -11.41, "lng": 24.82},{"lat": -10.91, "lng": 24.99},{"lat": -10.4, "lng": 25.31},{"lat": -9.9, "lng": 25.79},{"lat": -9.39, "lng": 25.66},{"lat": -8.89, "lng": 25.85},{"lat": -8.38, "lng": 26.28},{"lat": -7.88, "lng": 26.46},{"lat": -7.37, "lng": 26.9},{"lat": -6.87, "lng": 26.67},{"lat": -6.36, "lng": 26.67},{"lat": -5.86, "lng": 26.86},{"lat": -5.35, "lng": 26.74},{"lat": -4.85, "lng": 26.53},{"lat": -4.34, "lng": 27.11},{"lat": -3.84, "lng": 27.54},{"lat": -3.33, "lng": 28.15},{"lat": -2.83, "lng": 27.3},{"lat": -2.32, "lng": 28.63},{"lat": -1.82, "lng": 28.72},{"lat": -1.31, "lng": 29.23},{"lat": -0.81, "lng": 28.85},{"lat": -0.3, "lng": 29.38},{"lat": 0.2, "lng": 30.09},{"lat": 0.71, "lng": 30.28},{"lat": 1.21, "lng": 30.39},{"lat": 1.72, "lng": 30.58},{"lat": 2.22, "lng": 31.28},{"lat": 2.73, "lng": 31.68},{"lat": 3.23, "lng": 32.1},{"lat": 3.74, "lng": 31.96},{"lat": 4.24, "lng": 33.06},{"lat": 4.75, "lng": 33.37},{"lat": 5.25, "lng": 33.48},{"lat": 5.76, "lng": 33.95},{"lat": 6.26, "lng": 34.43},{"lat": 6.77, "lng": 34.19},{"lat": 7.27, "lng": 34.21},{"lat": 7.78, "lng": 34.76},{"lat": 8.28, "lng": 34.66},{"lat": 8.79, "lng": 34.64},{"lat": 9.29, "lng": 35.42},{"lat": 9.8, "lng": 34.35},{"lat": 10.3, "lng": 35.19},{"lat": 10.81, "lng": 34.52},{"lat": 11.31, "lng": 34.69},{"lat": 11.82, "lng": 34.47},{"lat": 12.32, "lng": 34.29},{"lat": 12.83, "lng": 33.82},{"lat": 13.33, "lng": 34.04},{"lat": 13.84, "lng": 33.07},{"lat": 14.34, "lng": 33.47},{"lat": 14.85, "lng": 32.29},{"lat": 15.35, "lng": 32.1},{"lat": 15.86, "lng": 31.66},{"lat": 16.36, "lng": 31.77},{"lat": 16.87, "lng": 30.56},{"lat": 17.37, "lng": 29.85},{"lat": 17.88, "lng": 29.99},{"lat": 18.38, "lng": 29.02},{"lat": 18.89, "lng": 29.26},{"lat": 19.39, "lng": 28.38},{"lat": 19.9, "lng": 27.8},{"lat": 20.4, "lng": 27.4},{"lat": 20.91, "lng": 27.21},{"lat": 21.41, "lng": 27.16},{"lat": 21.92, "lng": 26.53},{"lat": 22.42, "lng": 26.19},{"lat": 22.93, "lng": 26.12},{"lat": 23.43, "lng": 25.26},{"lat": 23.94, "lng": 26.09},{"lat": 24.44, "lng": 26.02},{"lat": 24.95, "lng": 26.15},{"lat": 25.45, "lng": 26.02},{"lat": 25.96, "lng": 26.66},{"lat": 26.46, "lng": 26.88},{"lat": 26.97, "lng": 27.38},{"lat": 27.47, "lng": 27.57},{"lat": 27.98, "lng": 27.85},{"lat": 28.48, "lng": 27.94},{"lat": 28.99, "lng": 28.7},{"lat": 29.49, "lng": 29.63},{"lat": 30.0, "lng": 29.71}]');
		    var trackRoute2 = JSON.parse('[{"lat": -20.0, "lng": 24.47},{"lat": -19.49, "lng": 24.19},{"lat": -18.99, "lng": 24.15},{"lat": -18.48, "lng": 24.89},{"lat": -17.98, "lng": 24.28},{"lat": -17.47, "lng": 24.15},{"lat": -16.97, "lng": 23.91},{"lat": -16.46, "lng": 24.11},{"lat": -15.96, "lng": 24.33},{"lat": -15.45, "lng": 25.1},{"lat": -14.95, "lng": 24.34},{"lat": -14.44, "lng": 24.77},{"lat": -13.94, "lng": 24.09},{"lat": -13.43, "lng": 25.03},{"lat": -12.93, "lng": 24.86},{"lat": -12.42, "lng": 24.83},{"lat": -11.92, "lng": 24.85},{"lat": -11.41, "lng": 25.29},{"lat": -10.91, "lng": 25.21},{"lat": -10.4, "lng": 25.86},{"lat": -9.9, "lng": 25.63},{"lat": -9.39, "lng": 25.78},{"lat": -8.89, "lng": 26.2},{"lat": -8.38, "lng": 25.69},{"lat": -7.88, "lng": 27.06},{"lat": -7.37, "lng": 26.51},{"lat": -6.87, "lng": 26.38},{"lat": -6.36, "lng": 27.13},{"lat": -5.86, "lng": 27.59},{"lat": -5.35, "lng": 27.73},{"lat": -4.85, "lng": 27.59},{"lat": -4.34, "lng": 28.1},{"lat": -3.84, "lng": 27.86},{"lat": -3.33, "lng": 28.54},{"lat": -2.83, "lng": 29.4},{"lat": -2.32, "lng": 29.26},{"lat": -1.82, "lng": 29.09},{"lat": -1.31, "lng": 29.78},{"lat": -0.81, "lng": 29.66},{"lat": -0.3, "lng": 29.83},{"lat": 0.2, "lng": 30.49},{"lat": 0.71, "lng": 31.06},{"lat": 1.21, "lng": 31.12},{"lat": 1.72, "lng": 31.39},{"lat": 2.22, "lng": 31.91},{"lat": 2.73, "lng": 32.06},{"lat": 3.23, "lng": 32.42},{"lat": 3.74, "lng": 32.88},{"lat": 4.24, "lng": 32.52},{"lat": 4.75, "lng": 32.45},{"lat": 5.25, "lng": 33.84},{"lat": 5.76, "lng": 33.2},{"lat": 6.26, "lng": 33.55},{"lat": 6.77, "lng": 33.82},{"lat": 7.27, "lng": 33.43},{"lat": 7.78, "lng": 33.54},{"lat": 8.28, "lng": 33.73},{"lat": 8.79, "lng": 34.25},{"lat": 9.29, "lng": 34.33},{"lat": 9.8, "lng": 34.17},{"lat": 10.3, "lng": 33.64},{"lat": 10.81, "lng": 33.28},{"lat": 11.31, "lng": 33.73},{"lat": 11.82, "lng": 33.54},{"lat": 12.32, "lng": 33.38},{"lat": 12.83, "lng": 33.55},{"lat": 13.33, "lng": 32.99},{"lat": 13.84, "lng": 32.26},{"lat": 14.34, "lng": 32.64},{"lat": 14.85, "lng": 31.52},{"lat": 15.35, "lng": 31.85},{"lat": 15.86, "lng": 30.74},{"lat": 16.36, "lng": 31.2},{"lat": 16.87, "lng": 30.45},{"lat": 17.37, "lng": 30.33},{"lat": 17.88, "lng": 29.84},{"lat": 18.38, "lng": 29.18},{"lat": 18.89, "lng": 29.33},{"lat": 19.39, "lng": 28.97},{"lat": 19.9, "lng": 28.74},{"lat": 20.4, "lng": 27.65},{"lat": 20.91, "lng": 27.96},{"lat": 21.41, "lng": 27.57},{"lat": 21.92, "lng": 27.66},{"lat": 22.42, "lng": 27.48},{"lat": 22.93, "lng": 26.03},{"lat": 23.43, "lng": 27.02},{"lat": 23.94, "lng": 26.27},{"lat": 24.44, "lng": 26.61},{"lat": 24.95, "lng": 27.36},{"lat": 25.45, "lng": 26.77},{"lat": 25.96, "lng": 26.69},{"lat": 26.46, "lng": 26.64},{"lat": 26.97, "lng": 26.85},{"lat": 27.47, "lng": 27.57},{"lat": 27.98, "lng": 27.46},{"lat": 28.48, "lng": 27.73},{"lat": 28.99, "lng": 28.53},{"lat": 29.49, "lng": 29.0},{"lat": 30.0, "lng": 30.17}]');
		    seqGroup = L.motion.group([
					L.motion.polyline(trackRoute1, {
					color: "transparent"
					}, {
						easing: L.Motion.Ease.easeInOutQuad
					}, {
						removeOnEnd: false,
						icon: L.divIcon({html: "<i class='fa fa-truck fa-2x fa-flip-horizontal' aria-hidden='true'></i>", iconSize: L.point(27.5, 24)})
					}).motionDuration(3000),
					L.motion.polyline(trackRoute2, {
					color: "transparent"
					}, {
						easing: L.Motion.Ease.easeInOutQuad
					}, {
						removeOnEnd: false,
						icon: L.divIcon({html: "<i class='fa fa-truck fa-2x fa-flip-horizontal' aria-hidden='true'></i>", iconSize: L.point(27.5, 24)})
					}).motionDuration(3000),

				]).addTo(map);
		    setTimeout(function () {
				seqGroup.motionStart();
			}, 0);
	    }

			
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
			offset: 0.66,
			progress: true,
			debug: false,
		})
		.onStepEnter(handleStepEnter)
		.onStepProgress(handleStepProgress)
		// setup resize event
		window.addEventListener('resize', handleResize);
	}
	// kick things off
	init();
})();

function pageScroll() {
    window.scrollBy(0,1);
    scrolldelay = setTimeout(pageScroll,10);
}
//pageScroll();