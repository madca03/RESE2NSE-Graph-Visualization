"use strict"

/*************  Constants  *************/

const BASEURL = "http://localhost:3000";
// node visual properties
const NODERADIUS = 8;
const NODEFILL = "black";
// link visual properties
const LINKSTROKEOPACITY = '1';
const LINKSTROKEWIDTH = '2px';
const UPDATERATE = 1500;

/*************  Application starts here  *************/

var dummy;

// http://stackoverflow.com/questions/544993/official-way-to-ask-jquery-wait-for-all-images-to-load-before-executing-somethin
/* wait for all images to load */
$(window).on("load", function() {
  var graph = new Graph();
  var ui = new UI();
  var dataFetcher = new DataFetcher();
  var slider = new Slider();
  var eventHandler = new EventHandler();
  var graphDrawer = new GraphDrawer();

  ui.init();
  slider.init(dataFetcher, graph);
  graphDrawer.setDimensions(ui.svgWidth, ui.svgHeight);

  dataFetcher.setWidth(ui.svgWidth);
  dataFetcher.setHeight(ui.svgHeight);
  dataFetcher.setBaseSVGWidth(ui.baseSVGWidth);

  function displayGraph() {
    dataFetcher.getDataForDisplay(graph.archiveDate, function(data) {
      graphDrawer.setGraph(data.graph);

      /* if graph display if just for update */
      if (graphDrawer.graphDisplayed) {
        graphDrawer.updateGraphDisplay();
      }
      /* if it's the first time to display the graph */
      else {
        graphDrawer.drawGraphDisplay();
        graphDrawer.graphDisplayed = true;
      }

      /* update the maximum value of the slider to the total archive count
        add the old archiveDate length to the number of new archiveDate
      */

      /* update the array of archive dates */
      // http://stackoverflow.com/questions/1374126/how-to-extend-an-existing-javascript-array-with-another-array-without-creating
      // graph.archiveDate.push.apply(graph.archiveDate, data.date_archive);

      slider.storeArchiveDate(graph.archiveDate, data.date_archive);
      slider.updateSliderRange(graph.archiveDate.length);
      slider.updateArchiveDate(graph.archiveDate);
    });
  }

  // dummy = displayGraph;
  dummy = graph;
  displayGraph();
  // var display_timer = setInterval(function() {
  //   if (!dataFetcher.updateDisabled) {
  //     displayGraph();
  //   }
  // }, UPDATERATE);

  // setTimeout(function() {
  //   displayGraph();
  //   console.log("hello");
  // }, 3000);

  /* function is called when the browser is resized
  */

  // window.onresize = function() {
  //   ui.updateUIOnBrowserResize();
  //   dataFetcher.getDataForDisplay();
  //
  //   console.log("browser resize");
  //   clearInterval(display_timer);
  //
  //   display_timer = setInterval(function() {
  //     dataFetcher.getDataForDisplay();
  //   }, UPDATERATE);
  // }


  $('.range-menu').change(function() {
    var range;
    if ($(this).val() === "all") {
      range = $(this).val();
    } else {
      range = $(this).val().split("_");
    }

    var last_entry_id = graph.archiveDate[graph.archiveDate.length - 1].id;

    var request = $.ajax({
      url: BASEURL + "/datetime/" + range[0] + "/" + range[1]
        + "/" + last_entry_id,
      type: "GET",
      dataType: "json",
      context: this
    });

    request.done(function(_data, textStatus, jqXHR) {
      graph.archiveDate = _data.data;
      slider.adjustSliderHandlePosition($(this).val(), graph.archiveDate);
    });
  });

  // add click event listener to edit graph button
  $('.edit-btn').on('click', function() {
    // clearInterval(display_timer);
    eventHandler.editBtnClicked();

    // add event handler to cancel button
    $('.cancel-btn').on('click', function() {
      eventHandler.cancelBtnClicked();
    });

    // add event handler to save button
    $('.save-btn').on('click', function() {
      eventHandler.saveBtnClicked();
    });
  });
}); // end application block

/***********************  END  ***********************/
