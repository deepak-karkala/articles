var minDeviceWidth = 375;
var maxDeviceWidth = 1024;

months_list = ["January", "February", "March", "April", "May", "June",
               "July", "August", "September", "October", "November", "December"];
/*
 * Sets up the layout buttons to allow for toggling between view modes.
 */
function setupButtons() {
  d3.select('#toolbar')
    .selectAll('.button')
    .on('click', function () {
      // Remove active class from all buttons
      d3.selectAll('.button').classed('active', false);
      // Find the button just clicked
      var button = d3.select(this);

      // Set it as the active button
      button.classed('active', true);

      // Get the id of the button
      var buttonId = button.attr('id');

      // Toggle the bubble chart based on
      // the currently clicked button.
      //myBubbleChart.toggleDisplay(buttonId);
    });
}

// setup the buttons.
setupButtons();


/*
district_name_mapping = {"Jagitial":"Jagtial", "Jangoan":"Jangaon", "Kumuram Bheem Asifabad":"Komaram Bheem Asifabad",
                         "Mahabubnagar": "Mahbubnagar", "Ranga Reddy": "Rangareddy", "Yadadri Bhuvanagiri":"Yadadri Bhongir",
                         "Jayashankar": "Jayashankar Bhupalapally", "West Khasi Hills":"West khasi Hills", "East Jaintia Hills":"East Jainta Hills",
                        "Kalaburagi":"Gulbarga", "Belagavi":"Belgaum", "Bagalkote":"Bagalkot", "Ballari":"Bellary",
                        "Shivamogga":"Shimoga", "Chikkamagaluru":"Chikmagalur", "Bengaluru Rural":""}
*/