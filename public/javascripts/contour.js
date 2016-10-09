"use strict"

const BASEURL = "http://localhost:3000";

$(window).on("load", function() {
  var dataFetcher = new DataFetcher();

  function displayContour(data) {
    var x_data = [];
    var y_data = [];
    var z_data = [];

    for (var i = 0; i < data.x.length; i++) {
      var null_arr = [];
      var temp = [];

      x_data.push(data[i].x_coordinate);
      y_data.push(data[i].y_coordinate);

      for (var j = 0; j < i; j++) {
        temp.push(null);
      }
      temp.push(data[i].packets_sent);
      for (var j = 0; j < data.length - 1 - i; j++) {
        temp.push(null);
      }
      // null_arr = Array(i).fill(null);
      // temp = temp.concat(null_arr);
      // temp.push(data[i].z_coordinate);
      // null_arr = Array(data.length - i - 1);
      // temp = temp.concat(null_arr);
      z_data.push(temp);
    }

    // console.log(x_data);
    // console.log(y_data);
    // console.log(z_data);

    // var data = [ {
    //   z: z_data,
    //   x: x_data,
    //   y: y_data,
    //   type: 'heatmap',
    //   zsmooth: 'best',
    //   // showscale: false,
    //   connectgaps: true,
    // }];
    //
    // var layout = {
    //   title: 'Setting the X and Y Coordinates in a Contour Plot'
    // }
    //
    // Plotly.newPlot('myDiv', data, layout);
  }

  dataFetcher.getDataForContour(displayContour);
});
