function plot_rhythm_visualisation_initial() {
    idname = "#plot_song_artist_rhythm_visualisation";
    d3.select(idname).select("svg").remove();
    var bb = d3.select(idname).node().offsetWidth;
    width_scale_factor = 0.4;
    height_scale_factor = 0.4;
    var margin = {right:10, left:10, top:30, bottom:10};
    base_width = bb*width_scale_factor - margin.left - margin.right;
    base_height = bb*height_scale_factor - margin.top - margin.bottom;
    //csv_processed_file = "data/rhythm_viz/viz_csv/Shape_of_you.csv";
    csv_processed_file = "data/rhythm_viz/viz_csv/Back_in_black.csv";
    plot_rhythm_visualisation(idname, csv_processed_file, base_width, base_height);
}
plot_rhythm_visualisation_initial();


function plot_rhythm_visualisation(idname, csv_processed_file, width, height) {
    d3.select(idname).select("svg").remove();

    d3.csv(csv_processed_file, function (data) {

        // Scales
        //var colorScale = ["#0000ff", "#ff0000", "#ffe119"]; //d3.scale.category20()
        var colorScale = ["#0000ff", "#ff0000", "#f3cd05"]; //d3.scale.category20()
        //var colorScale = ["#0444bf", "#ff0000", "#f3cd05"]; //Blue alternative: 0444bf
        //var colorScale = ["#4363d8", "#e6194B", "#ffe119"]; //d3.scale.category20()
        //var pitchScale = d3.scaleLinear().domain([10, 110]).range([0, 1]);
        var pitchScale = d3.scaleLinear().domain([35, 80]).range([0, 1]);
        var radiusScale = d3.scaleLinear().domain([0, 1]).range([0, width]);
        var margin = {right:10, left:10, top:10, bottom:10};
        var c_tones = [36, 48, 60, 72,];
        


        data.forEach(function(d) {
            d.pitch = +d.pitch;
            d.theta = +d.theta;
            d.cx = pitchScale(d.pitch) * Math.sin(d.theta);
            d.cy = pitchScale(d.pitch) * Math.cos(d.theta);
            //d.cx = +d.cx;
            //d.cy = +d.cy;
            d.note_duration_secs = +d.note_duration_secs;
            d.note_start_secs = +d.note_start_secs;
        });

        var xScale = d3.scaleLinear()
          .domain([
            d3.min(data,function (d) { return d.cx; }),
            d3.max(data,function (d) { return d.cx; })
            ])
          .range([0, width]);
        var yScale = d3.scaleLinear()
          .domain([
            d3.min(data,function (d) { return d.cy; }),
            d3.max(data,function (d) { return d.cy; })
            ])
          .range([height, 0]);
        // SVG
        var svg = d3.select(idname).append('svg')
            .attr('height', height + margin.top + margin.bottom)
            .attr('width', width + margin.left + margin.right)
          .append('g')
            .attr('transform','translate(' + margin.left + ',' + margin.top + ')');
            //.attr('transform','translate(' + 100 + ',' + 100 + ')')
            
        // Circles
        var circles = svg.selectAll('circle')
            .data(data)
            .enter()
          .append('circle')
            .attr('class', 'dot')
            .attr('class', 'notes')
            .attr('cx',function (d) { return xScale(d.cx); })
            .attr('cy',function (d) { return yScale(d.cy); })
            .attr('r', function (d) {
                return "0.25rem";
            }) //return d.pitch/50 })
            //.attr('cx',function (d) { return xScale(d.start_secs) })
            //.attr('cy',function (d) { return yScale(d.pitch) })
            //.attr('r','4')
            .attr('stroke','white')
            .attr('stroke-width',0.25)
            .attr('fill',function (d,i) { return colorScale[d.note]; })
            .style("opacity", 1);

        for(var i=0; i<c_tones.length; i++) {
            var c_circles = svg.append('circle')
                    .attr('class', 'dot')
                    .attr('class', 'c_tones')
                    .attr('cx', xScale(radiusScale(0)))
                    .attr('cy', yScale(radiusScale(0)))
                    .attr('r', function(d) { return radiusScale(pitchScale(c_tones[i])); })
                    .attr('fill', 'none')
                    .attr('stroke', 'white')
                    .style("opacity", 0.5);
        }

    });
}

var song_list = '';

function set_song_viz_combobox() {
    /*
    song_info_file = "data/song_similarity/song_similarity_score.csv";
    d3.csv(song_info_file, function (data) {
        var song_info_arr = [];
        data.forEach(function(d,i){
            song_info = {};
            song_info["id"] = +d.id;
            song_info["song_name"] = toTitleCase(d.song_name);
            song_info["artist"] = toTitleCase(d.artist);
            song_info["decade"] = +d.decade;
            song_info["year"] = +d.year;
            song_info["similarity_score"] = +d.similarity_score;
            song_info_arr.push(song_info);
        })
        // Append songs to dropdown menu
        for (var i=0; i<song_info_arr.length; i++) {
            song_list += `<option value="`+song_info_arr[i]["id"]+`">`+song_info_arr[i]["artist"]+`-`+ song_info_arr[i]["song_name"]+`</option>`;
        }
    });
    console.log(song_list);
    */

    artist_info_file = "data/rhythm_viz/all_songs_artist_list.csv";
    var song_list = '';
    d3.csv(artist_info_file, function(data) {
        data.forEach(function(d,i) {
            d["id"] = +d.id;
            d["song"] = +d.song;
            song_list += `<option value="`+d["id"]+`">`+d["song"]+`</option>`;
        })
    })
    $('#viz_combobox').append(song_list);
}
set_song_viz_combobox();

$("#viz_combobox").change(function() {
    //alert(this.value);
    song_id = this.value;

    idname = "#plot_song_artist_rhythm_visualisation";
    d3.select(idname).select("svg").remove();
    var bb = d3.select(idname).node().offsetWidth;
    width_scale_factor = 0.4;
    height_scale_factor = 0.4;
    var margin = {right:10, left:10, top:30, bottom:10};
    base_width = bb*width_scale_factor - margin.left - margin.right;
    base_height = bb*height_scale_factor - margin.top - margin.bottom;
    csv_processed_file = "data/rhythm_viz/viz_csv/Shape_of_you.csv";
    plot_rhythm_visualisation(idname, csv_processed_file, base_width, base_height);
});