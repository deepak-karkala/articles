

table_idname = "top_hotspots_table_body";
filename = "data/districtwise_top_hotspots.csv";
insert_district_rows(table_idname, filename);

function insert_district_rows(table_idname, file) {
	var table = document.getElementById(table_idname);
	table.innerHTML = ``;

	d3.csv(file, function(error, data) {
		if (error) throw error;

      	data.forEach(function(d,i) {
      		d.cases = +d.cases;
      		d.deaths = +d.deaths;

				table.innerHTML += `<tr class="table-primary">` +
										`<td>`+d.district+`</td>`+
										`<td>`+d.state+`</td>`+
										`<td>`+d.cases+`</td>`+
										`<td>`+d.deaths+`</td>`+
									`</tr>`

		});

		$(document).ready(function () {
			$('#top_hotspots_table').DataTable({
			    "paging": true,
			    "pagingType": "full_numbers",
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