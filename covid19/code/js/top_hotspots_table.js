table_idname = "top_hotspots_table_body";
//filename = "data/districtwise_top_hotspots.csv";
filename = "data/districtwise_case_death_growth_density_withNamesMapped.csv";
insert_district_rows(table_idname, filename);

min_case_count_to_show_in_table = 50;
num_past_days_growth_rate = 15;

function insert_district_rows(table_idname, file) {
	var table = document.getElementById(table_idname);
	table.innerHTML = ``;

	var width = 50, height=50;
	var margin = {right:0, left:0, top:0, bottom:0};


	d3.csv(file, function(error, data) {
		if (error) throw error;

      	data.forEach(function(d,i) {
      		d.cases = +d.cases;
      		d.deaths = +d.deaths;

      		idname = d.district.split(' ').join('_');

      		if (d.cases >= min_case_count_to_show_in_table) {
				table.innerHTML += `<tr class="table-primary">` +
										`<td align="left">`+d.district+`, `+d.state_code+`</td>`+
										`<td align="right">`+d.cases+`</td>`+
										`<td align="right">`+d.cases_per_lakh+`</td>`+
										`<td align="right">`+d.current_avg_growth_rate+`</td>`+
										`<td align="right">`+d.deaths+`</td>`+
										`<td align="right"><div id="`+idname+`"></div></td>`+
									`</tr>`
      		}


      		var data = [];
      		for (var j=0; j<num_past_days_growth_rate; j++) {
      			data[j].cx = 
      			data[j].cy = 
      			data[j].color = growth_rate_color_mapping(d["day"+j]);
      		}

      		var svg = d3.select(idname).append("svg")
		          .attr("width", width + margin.left + margin.right)
		          .attr("height", height + margin.top + margin.bottom)
		        .append("g")
		          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");




		});

		$(document).ready(function () {
			$('#top_hotspots_table').DataTable({
			    "paging": true,
			    "pagingType": "simple_numbers",
			    "aaSorting": [],
			    /*
			    columnDefs: [{
			      orderable: false,
			      targets: 3
			    }],
			    */
			    "order": [[ 2, "desc" ]]
			});
			$('.dataTables_length').addClass('bs-select');
		});

	});

}